const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const { findProduct, getProducts } = require("./product/product");
const { saveBasket } = require("./basket/basket");
const port = 4000;

app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.get("/products", (req, res) => {
  res.send(getProducts());
});

app.get("/products/:productId", (req, res) => {
  const productId = req.params.productId;
  const product = findProduct(productId);

  return product ? res.send(product) : res.sendStatus(404);
});

app.post("/basket", (req, res) => {
  res.send(saveBasket(basket));
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
