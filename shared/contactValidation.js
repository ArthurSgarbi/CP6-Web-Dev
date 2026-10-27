export const contactFields = ['name', 'email', 'subject', 'message'];
export const limits = { name: 120, email: 254, subject: 180, message: 1000 };
export function normalizeContact(input = {}) {
  return Object.fromEntries(contactFields.map((key) => [key,
    typeof input[key] === 'string' ? input[key].trim().replace(/\r\n/g, '\n') : '',
  ]));
}
export function validateContact(input) {
  const data = normalizeContact(input);
  const errors = {};
  if (data.name.length < 3) errors.name = 'Informe um nome com pelo menos 3 caracteres';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.email = 'Informe um e-mail válido';
  if (data.subject.length < 5) errors.subject = 'Informe um assunto com pelo menos 5 caracteres';
  if (data.message.length < 20) errors.message = 'A mensagem deve ter no mínimo 20 caracteres';
  for (const key of contactFields) {
    if (data[key].length > limits[key]) errors[key] = key === 'message'
      ? 'A mensagem deve ter no máximo 1.000 caracteres'
      : `Use no máximo ${limits[key]} caracteres`;
  }
  if (/[\r\n]/.test(data.email)) errors.email = 'Informe um e-mail válido';
  return errors;
}
