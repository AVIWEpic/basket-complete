const products = require("../data/products");

function getProducts() {
  return products;
}
function findProduct(productId) {
  return products.find((p) => p.id === productId);
}

module.exports = { getProducts, findProduct };
