export default function ProjectsError({ error, onRetry, isRetrying = false }) {
  const messages = {
    RATE_LIMIT: 'O limite temporário de consultas ao GitHub foi atingido. Aguarde alguns minutos e tente novamente.',
    NETWORK: 'Não foi possível conectar ao GitHub. Verifique sua conexão e tente novamente.',
    TIMEOUT: 'O GitHub demorou para responder. Tente novamente em instantes.',
    CONFIGURATION: import.meta.env.DEV ? error?.message : 'A integração de projetos ainda não foi configurada.',
    NOT_FOUND: 'O perfil configurado não foi encontrado no GitHub.',
  };

  return (
    <div className="projects-state projects-error" role="status" aria-live="polite" aria-atomic="true">
      <p className="projects-state-title">Não foi possível carregar os projetos no momento.</p>
      <p>{messages[error?.code] ?? 'A integração com o GitHub está indisponível. Tente novamente em instantes.'}</p>
      <button className="project-action" type="button" onClick={onRetry} disabled={isRetrying}>
        {isRetrying ? 'Tentando novamente…' : 'Tentar novamente'}
      </button>
    </div>
  );
}
