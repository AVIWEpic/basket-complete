const { findProduct } = require("../product/product");

function saveBasket(basket) {
  let basketTotal = 0;
  let errorsExist = false;

  const items = basket.items.map(({ id, quantity }) => {
    const product = findProduct(id);
    if (product) {
      try {
        const itemTotal = quantity * product.price;
        if (isNaN(itemTotal)) {
          throw Error("price or quantity not found");
        }

        basketTotal += itemTotal
        if (product.discountPercentage) {
          const discount = (itemTotal * product.discountPercentage) / 100;
          if (isNaN(discount)) {
            throw Error("disocunt could not be calculated");
          }
          basketTotal -= discount
          return {
            ...product,
            quantity,
            total: financial(itemTotal - discount),
            discount: financial(discount),
          };
        } else {
          return { ...product, quantity, total: financial(itemTotal) };
        }
      } catch (error) {
        console.error(error);
        errorsExist = true;
        return { id, quantity, error: "Item could not be purchased" };
      }
    } else {
      errorsExist = true;
      return { id, quantity, error: "Product not found" };
    }
  });

  if (errorsExist) {
    return { items };
  }

  return { items, total: financial(basketTotal) };
}

function financial(x) {
  return Number.parseFloat(x).toFixed(2);
}

module.exports = { saveBasket };
