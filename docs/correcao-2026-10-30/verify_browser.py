"""Local Chromium checks. No writes reach contact/admin services.

Usage: python verify_browser.py --deps PATH_TO_PYTHON_PLAYWRIGHT
Requires the portfolio dev server; output goes beside this script.
"""
import argparse
import json
import re
import sys
from datetime import datetime, timedelta, timezone
from pathlib import Path

sys.stdout.reconfigure(encoding='utf-8')

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--deps', help='Optional directory containing playwright')
parser.add_argument('--base', default='http://127.0.0.1:5173')
parser.add_argument('--layout-only', action='store_true', help='Recheck only visual captures, on a page without a controlled clock')
args = parser.parse_args()
if args.deps:
    sys.path.insert(0, args.deps)
from playwright.sync_api import sync_playwright, expect

OUT = Path(__file__).parent
checks, events, measurements = [], [], []
RESULT = 'layout-results.json' if args.layout_only else 'browser-results.json'


def record(name, fn):
    if args.layout_only and not name.startswith('Home'):
        return
    try:
        detail = fn()
        checks.append(dict(name=name, passed=True, detail=detail))
        print('PASS ' + name, flush=True)
    except Exception as error:
        checks.append(dict(name=name, passed=False, detail=str(error)[:2000]))
        print('FAIL ' + name + ': ' + str(error)[:250], flush=True)
        page.screenshot(path=str(OUT / ('failure-' + str(len(checks)) + '.png')))
    (OUT / RESULT).write_text(json.dumps(dict(checks=checks, measurements=measurements, events=events), ensure_ascii=False, indent=2), encoding='utf-8')


with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    context = browser.new_context(viewport=dict(width=1440, height=900), reduced_motion='no-preference')

    def guard(route):
        if route.request.method not in ['GET', 'HEAD', 'OPTIONS']:
            events.append(dict(type='blocked-write', method=route.request.method))
            route.abort()
        else:
            route.continue_()
    context.route('**/*', guard)
    page = context.new_page()
    page.set_default_timeout(15000)
    page.on('pageerror', lambda error: events.append(dict(type='pageerror', message=str(error))))
    page.on('response', lambda response: events.append(dict(type='public-api', status=response.status, url=response.url))
            if '/api/featured' in response.url or 'api.github.com' in response.url else None)

    def goto():
        page.goto(args.base, wait_until='networkidle')
        expect(page.get_by_role('heading', level=1)).to_be_visible()

    goto()
    # Reconnaissance before interactions: capture the rendered page and labels.
    (OUT / 'rendered-controls.json').write_text(json.dumps(page.get_by_role('button').all_text_contents(), ensure_ascii=False, indent=2), encoding='utf-8')
    page.screenshot(path=str(OUT / 'initial.png'))
    page.clock.install()
    page.clock.pause_at(datetime.now(timezone.utc) + timedelta(seconds=1))
    reel = page.get_by_role('region', name='Amostras de interfaces')
    count = page.locator('.project-reel-count')

    def fresh():
        page.mouse.move(0, 0)
        page.emulate_media(reduced_motion='no-preference')
        page.evaluate("sessionStorage.removeItem('portfolio-reel-paused')")
        page.reload(wait_until='networkidle')
        expect(count).to_have_text('1 / 3')

    def advance(ms=7200):
        page.clock.run_for(ms)

    def hover():
        fresh()
        reel.hover()
        expect(reel).to_have_attribute('data-paused', 'true')
        advance(21000)
        expect(count).to_have_text('1 / 3')
        page.screenshot(path=str(OUT / 'carousel-hover.png'))
        page.mouse.move(0, 0)
        expect(reel).to_have_attribute('data-paused', 'false')
        advance()
        expect(count).to_have_text('2 / 3')
        expect(page.get_by_role('group', name='2 de 3: SYNC Mobile')).to_be_visible()
        expect(page.get_by_role('img', name=re.compile('Painel de demonstração'))).to_be_visible()
        return 'Real mouse hover/leave; controlled clock 21s + 7.2s; matching accessible slide/image.'
    record('Hover suspende; saída retoma quando autorizada', hover)

    def focus():
        fresh()
        playback = page.get_by_role('button', name='Pausar carrossel', exact=True)
        playback.focus()
        expect(page.get_by_role('button', name='Reproduzir carrossel')).to_be_focused()
        page.get_by_label('Nome', exact=True).focus()
        advance(21000)
        expect(count).to_have_text('1 / 3')
        reel.hover(); page.mouse.move(0, 0)
        advance()
        expect(count).to_have_text('1 / 3')
        playback = page.get_by_role('button', name='Reproduzir carrossel', exact=True)
        playback.focus(); page.keyboard.press('Enter')
        expect(page.get_by_role('button', name='Pausar carrossel')).to_be_focused()
        advance()
        expect(count).to_have_text('2 / 3')
        page.keyboard.press('Space')
        expect(page.get_by_role('button', name='Reproduzir carrossel')).to_be_focused()
        advance()
        expect(count).to_have_text('2 / 3')
        page.keyboard.press('Space')
        advance()
        expect(count).to_have_text('3 / 3')
        page.screenshot(path=str(OUT / 'carousel-keyboard.png'))
        return 'Focus enter/leave, hover after interruption, explicit Enter and Space; focus stays on control.'
    record('Foco interrompe; retomada explícita pelo teclado', focus)

    def manual():
        fresh()
        page.get_by_role('button', name='Pausar carrossel', exact=True).click()
        page.mouse.move(0, 0)
        advance(21000)
        expect(count).to_have_text('1 / 3')
        page.reload(wait_until='networkidle')
        expect(page.get_by_role('button', name='Reproduzir carrossel')).to_be_visible()
        advance()
        expect(count).to_have_text('1 / 3')
        page.get_by_role('button', name='Interface anterior', exact=True).click()
        expect(count).to_have_text('3 / 3')
        page.get_by_role('button', name='Próxima interface', exact=True).click()
        expect(count).to_have_text('1 / 3')
        page.mouse.move(0, 0)
        advance()
        expect(count).to_have_text('1 / 3')
        page.get_by_role('button', name='Reproduzir carrossel').click()
        advance()
        expect(count).to_have_text('1 / 3')  # Hover still suspends an explicit request.
        page.mouse.move(0, 0); advance()
        expect(count).to_have_text('2 / 3')
        return 'Real pointer click including focus-before-click, reload, previous/next, explicit play under hover.'
    record('Pausa manual persiste; navegação circular e reprodução com mouse', manual)

    def motion():
        fresh()
        page.emulate_media(reduced_motion='reduce')
        expect(page.get_by_text('Navegação manual · movimento reduzido')).to_be_visible()
        advance(21000)
        expect(count).to_have_text('1 / 3')
        page.get_by_role('button', name='Próxima interface', exact=True).click()
        expect(count).to_have_text('2 / 3')
        advance()
        expect(count).to_have_text('2 / 3')
        return 'Browser media emulation (not OS setting); manual navigation works.'
    record('Movimento reduzido bloqueia avanço automático', motion)

    def visibility():
        fresh()
        other = context.new_page()
        other.goto('about:blank')
        other.bring_to_front()
        actual_hidden = page.evaluate('document.hidden')
        other.close(); page.bring_to_front()
        # Headless Chromium may keep both tabs visible. Explicitly label that limit.
        page.evaluate("""() => {
          window.testHidden = true;
          Object.defineProperty(document, 'hidden', { configurable:true, get:()=>window.testHidden });
          document.dispatchEvent(new Event('visibilitychange'));
        }""")
        expect(reel).to_have_attribute('data-paused', 'true')
        advance(21000)
        expect(count).to_have_text('1 / 3')
        page.evaluate("window.testHidden=false; document.dispatchEvent(new Event('visibilitychange'))")
        expect(reel).to_have_attribute('data-paused', 'false')
        advance()
        expect(count).to_have_text('2 / 3')
        page.get_by_role('button', name='Pausar carrossel').focus()
        page.evaluate("window.testHidden=true; document.dispatchEvent(new Event('visibilitychange'))")
        page.evaluate("window.testHidden=false; document.dispatchEvent(new Event('visibilitychange'))")
        advance()
        expect(count).to_have_text('2 / 3')
        page.evaluate("delete document.hidden; document.dispatchEvent(new Event('visibilitychange'))")
        return dict(actual_background_tab_hidden=actual_hidden, validation='document.hidden + visibilitychange simulated; active tab switch attempted, not certified')
    record('Visibilidade simulada suspende sem revogar pausa', visibility)

    def layouts():
        global page, context
        context.close()
        # Isolate visual evidence from the clock and viewport history of the probes.
        context = browser.new_context(viewport=dict(width=1440, height=900), reduced_motion='reduce')
        context.route('**/*', guard)
        page = context.new_page()
        page.set_default_timeout(15000)
        page.on('pageerror', lambda error: events.append(dict(type='pageerror', message=str(error))))
        page.emulate_media(reduced_motion='reduce')
        for width, height in [(320,740), (390,844), (768,1024), (1440,900)]:
            page.set_viewport_size(dict(width=width, height=height))
            goto()
            expect(page.get_by_role('button', name=re.compile('Abrir prévia de'))).to_have_count(4, timeout=30000)
            for theme in ['light', 'dark']:
                page.evaluate("theme=>{localStorage.setItem('portfolio-theme',theme);document.documentElement.dataset.theme=theme}", theme)
                # Visit all sections to render lazy images/reveal animations.
                page.evaluate("""async()=>{
                  for(let y=0;y<document.body.scrollHeight;y+=600){scrollTo(0,y);await new Promise(r=>requestAnimationFrame(r))}
                  await Promise.all([...document.images].filter(i=>i.getBoundingClientRect().width>0).map(i=>i.decode().catch(()=>{})));
                  scrollTo(0,0);
                  await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));
                }""")
                data = page.evaluate("""()=>({width:innerWidth,client:document.documentElement.clientWidth,
                  scroll:document.documentElement.scrollWidth,h1:document.querySelectorAll('h1').length,
                  broken:[...document.images].filter(i=>i.getBoundingClientRect().width>0&&i.complete&&!i.naturalWidth).map(i=>i.getAttribute('src'))})""")
                data['theme'] = theme
                measurements.append(data)
                assert data['scroll'] <= data['client'] + 1, data
                assert data['h1'] == 1 and not data['broken'], data
                page.screenshot(path=str(OUT / f'home-{width}-{theme}.png'), full_page=True)
                page.locator('.hero').screenshot(path=str(OUT / f'hero-{width}-{theme}.png'))
        return '8 combinations; full-page screenshots, 1 H1, no document overflow or visible broken images.'
    record('Home em 320/390/768/1440 px nos dois temas', layouts)

    def menu_modal():
        page.set_viewport_size(dict(width=320,height=740))
        page.evaluate('scrollTo(0,0)')
        toggle = page.get_by_role('button', name='Abrir menu de navegação')
        toggle.click()
        nav = page.get_by_role('navigation', name='Navegação móvel')
        expect(nav.get_by_role('link', name=re.compile('Contato'))).to_be_visible()
        page.screenshot(path=str(OUT / 'menu-320.png'))
        page.keyboard.press('Escape')
        expect(toggle).to_be_focused()
        toggle.click(); nav.get_by_role('link', name=re.compile('Contato')).click()
        expect(page.locator('#contato')).to_be_focused()
        trigger = page.get_by_role('button', name='Abrir prévia de Meu Caixa', exact=True)
        trigger.click()
        dialog = page.get_by_role('dialog')
        close = dialog.get_by_role('button', name='Fechar detalhes do projeto')
        expect(close).to_be_focused()
        page.keyboard.press('Shift+Tab')
        assert dialog.evaluate('(d)=>d.contains(document.activeElement)')
        page.keyboard.press('Tab'); expect(close).to_be_focused()
        initial = dialog.locator('h2').inner_text()
        page.keyboard.press('ArrowRight')
        assert initial != dialog.locator('h2').inner_text()
        page.keyboard.press('ArrowLeft')
        expect(dialog.locator('h2')).to_have_text(initial)
        dialog.evaluate('(d)=>d.scrollTo(0,d.scrollHeight)')
        bounds = close.bounding_box()
        assert bounds and 0 <= bounds['y'] < 740, bounds
        page.screenshot(path=str(OUT / 'modal-320.png'))
        page.keyboard.press('Escape')
        expect(dialog).not_to_be_visible(); expect(trigger).to_be_focused()
        return 'Menu Escape/contact; modal focus trap, arrows, scrolled close, Escape and focus restoration.'
    record('Menu e modal móvel preservados', menu_modal)

    def study():
        page.set_viewport_size(dict(width=1440,height=900))
        page.get_by_role('navigation', name='Navegação principal').get_by_role('link', name='Diário', exact=True).click()
        page.get_by_role('button', name='Abrir prévia de Meu Caixa', exact=True).click()
        page.get_by_role('dialog').get_by_role('link', name=re.compile('Ver estudo completo')).click()
        expect(page).to_have_url(re.compile('/projetos/meu-caixa$'))
        expect(page.get_by_role('heading', name='Meu Caixa', level=1)).to_be_visible()
        expect(page.get_by_role('heading', name='Sobre o projeto', exact=True)).to_be_visible()
        expect(page.get_by_role('heading', name='O desafio', exact=True)).to_be_visible()
        page.screenshot(path=str(OUT / 'study-meu-caixa.png'), full_page=True)
        page.get_by_role('link', name=re.compile('Voltar aos projetos')).click()
        expect(page).to_have_url(re.compile('/#work$'))
        expect(page.get_by_role('button', name='Abrir prévia de Meu Caixa', exact=True)).to_be_visible()
        return 'Real public GitHub/featured GETs; lazy route, 2 short sections and return to /#work.'
    record('Diário → prévia → estudo → retorno', study)

    context.close(); browser.close()

(OUT / RESULT).write_text(json.dumps(dict(checks=checks, measurements=measurements, events=events), ensure_ascii=False, indent=2), encoding='utf-8')
sys.exit(1 if any(not item['passed'] for item in checks) else 0)
