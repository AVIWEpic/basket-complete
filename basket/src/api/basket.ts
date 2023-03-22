import { Product } from "./product";

async function saveBasket(items: BasketItem[]) {
  const res = await fetch("/basket", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ items }),
  });
  try {
    if (res.ok) {
      const basket = await res.json();
      return { basket: basket as unknown as SavedBasket, error: undefined };
    }
    return { error: "Error saving basket", basket: undefined };
  } catch (error) {
    return { error: "Error saving basket", basket: undefined };
  }
}

interface Basket {
  items: BasketItem[];
  total?: number;
}
interface SavedBasket {
  items: (BasketItem & Product)[];
  total?: number;
}

interface BasketItem {
  id: string;
  quantity: number;
  error?: string;
}

export { saveBasket };
export type { BasketItem, Basket, SavedBasket };
