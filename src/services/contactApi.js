export const contactFailure = 'Não foi possível enviar sua mensagem agora. Revise os dados ou tente novamente em alguns instantes.';
export async function sendContact(data, requestId) {
  let response;
  try {
    response = await fetch('/api/contact', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, requestId }), signal: AbortSignal.timeout(30000),
    });
  } catch {
    throw new Error('Não foi possível conectar ao servidor. Seus dados foram mantidos. Tente novamente em alguns instantes.');
  }
  const result = await response.json().catch(() => ({}));
  if (!response.ok || result.ok !== true) {
    const error = new Error(response.status === 429
      ? 'Aguarde um minuto antes de tentar enviar novamente.' : contactFailure);
    if (response.status === 422) error.fields = result.errors;
    throw error;
  }
}
