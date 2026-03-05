export function formatDate (iso) {
  if (!iso) return ''

  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return iso

  return date.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}
