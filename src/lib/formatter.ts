export function formatRupiah(value: number) {
  return value.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' });
}
export function formatDate(date: string | Date) {
  return new Date(date).toLocaleDateString('id-ID');
}
