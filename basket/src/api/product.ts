async function getProducts() {
  const res = await fetch("/products");

  try {
    if (res.ok) {
      const products = await res.json();
      return { products: products as unknown as Product[], error: undefined };
    }
    if (res.status === 404) {
      return { error: "Products not found", products: undefined };
    }
    return { error: "Error getting products", products: undefined };
  } catch (error) {
    console.log(error);
    return { error: "Error getting products", products: undefined };
  }
}

interface Product {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  price: number;
  discountPercentage?: number;
}

export { getProducts };
export type { Product };
