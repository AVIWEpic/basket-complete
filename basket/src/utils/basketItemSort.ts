import { BasketItem } from "../api/basket";
import { Product } from "../api/product";

export default function basketItemSort(basketItems: (BasketItem & Product)[]) {
  // sort by name
  return basketItems.sort((a, b) => {
    const nameA = a.name.toUpperCase(); // ignore upper and lowercase
    const nameB = b.name.toUpperCase(); // ignore upper and lowercase
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }

    // names must be equal
    return 0;
  });
}
