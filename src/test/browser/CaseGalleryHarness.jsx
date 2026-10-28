// The production entry never imports this local verification fixture.
import ProjectGallery from '../../components/project-details/ProjectGallery.jsx';
import '../../pages/project-case-study.css';

const galleryImages = [
  {
    src: '/images/projects/AETHER-front-end/01-portal.webp',
    alt: 'Captura de teste AETHER',
    caption: 'Arquivo real do portal AETHER, usado nesta galeria apenas para verificar interação e foco.',
    width: 1901, height: 911,
  },
  {
    src: '/images/projects/meu-caixa/01-visao-geral.webp',
    alt: 'Captura de teste Meu Caixa',
    caption: 'Arquivo real da tela pública do Meu Caixa, usado nesta galeria apenas para verificar a navegação entre imagens.',
    width: 1917, height: 905,
  },
  {
    src: '/images/projects/verificacao-local/arquivo-inexistente.webp',
    alt: 'Arquivo inexistente para teste do fallback',
    caption: 'Arquivo ausente intencionalmente: verifica a substituição após o erro real de carregamento.',
    width: 1600, height: 1000,
  },
];

export default function CaseGalleryHarness() {
  return (
    <main className="case-study">
      <div className="page-width" style={{ paddingTop: 48, paddingBottom: 80 }}>
        <h1>Galeria de teste local</h1>
        <p>Conteúdo exclusivo de verificação. As duas capturas reais pertencem a projetos diferentes e foram reunidas somente para testar navegação, teclado, foco e imagem ausente. Esta galeria não integra os estudos publicados.</p>
        <ProjectGallery images={galleryImages} projectTitle="Galeria de teste local" />
      </div>
    </main>
  );
}
