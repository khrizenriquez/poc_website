export function normalize(value) {
  return value
    .trim()
    .toLocaleLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}
export function filterProducts(products, query, category, translate) {
  const search = normalize(query);
  return products.filter(
    (product) =>
      (category === 'all' || product.category === category) &&
      normalize(`${translate(`products.names.${product.nameKey}`)} ${product.id}`).includes(search),
  );
}
