const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC',
});

export default function formatDate(value) {
  const date = new Date(value);
  return value && Number.isFinite(date.getTime())
    ? dateFormatter.format(date)
    : 'Data não informada';
}
