const products = require('../data/products')


function findProduct(productId) {
  return products.find(p => p.id === productId)
}

module.exports =  { findProduct}