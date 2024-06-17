let allProducts = [] as Product[]

export function useProducts() {

  const products = useState<Product[]>('products')

  function setProducts(newProducts: Product[]): void {
    if (!Array.isArray(newProducts))
      throw new Error('Products must be an array.')
    products.value = newProducts ?? []
    allProducts = JSON.parse(JSON.stringify(newProducts))
  }

  return { products, allProducts, setProducts }
}