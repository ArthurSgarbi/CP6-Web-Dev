"""Recheck image painting in an isolated, real-clock Chromium page.

Complements full-page captures by scrolling the carousel image into view.
No application state or styles are patched; only the saved theme is selected.
"""
import argparse
import json
import sys
from pathlib import Path

sys.stdout.reconfigure(encoding='utf-8')
parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--deps')
parser.add_argument('--base', default='http://127.0.0.1:5173')
args = parser.parse_args()
if args.deps:
    sys.path.insert(0, args.deps)
from playwright.sync_api import sync_playwright, expect

out = Path(__file__).parent
results = []
with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    for width, height in [(320,740), (390,844), (768,1024), (1440,900)]:
        for theme in ['light', 'dark']:
            context = browser.new_context(viewport=dict(width=width, height=height), reduced_motion='reduce')
            context.route('**/*', lambda route: route.continue_() if route.request.method in ['GET','HEAD','OPTIONS'] else route.abort())
            page = context.new_page()
            page.add_init_script("localStorage.setItem('portfolio-theme', " + json.dumps(theme) + ")")
            page.goto(args.base, wait_until='networkidle')
            image = page.locator('.project-reel-slide:not([hidden]) img')
            image.scroll_into_view_if_needed()
            image.evaluate('(i)=>i.decode()')
            page.evaluate('()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)))')
            data = image.evaluate("""i=>{
              const r=i.getBoundingClientRect(), s=getComputedStyle(i);
              return {src:i.currentSrc,complete:i.complete,naturalWidth:i.naturalWidth,naturalHeight:i.naturalHeight,
                width:r.width,height:r.height,display:s.display,visibility:s.visibility,opacity:s.opacity};
            }""")
            assert data['complete'] and data['naturalWidth'] > 0 and data['width'] > 0 and data['height'] > 0, data
            expect(image).to_be_visible()
            page.locator('.project-reel').screenshot(path=str(out / f'reel-{width}-{theme}.png'))
            results.append(dict(width=width,theme=theme,image=data))
            print(f'CAPTURE {width} {theme}', flush=True)
            context.close()
    browser.close()
(out / 'image-paint-results.json').write_text(json.dumps(results, ensure_ascii=False, indent=2), encoding='utf-8')
