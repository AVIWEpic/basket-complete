import React, { useEffect, useState } from 'react';
import { BasketItem, saveBasket, SavedBasket } from './api/basket';
import { getProducts, Product } from './api/product';
import './App.css';
import BasketView from './basket/BasketView';
import Loading from './components/Loading';
import Message from './components/Message';
import Products from './product/Products';

function App() {
  const [products, setProducts] = useState<Product[] | undefined>();
  const [basketItems, setBasketItems] = useState<BasketItem[]>([]);
  const [basket, setBasket] = useState<SavedBasket | undefined>();

  const [error, setError] = useState<string | undefined>();

  async function fetchAllProducts() {
    setProducts(undefined);

    const result = await getProducts()
    if (result.products) setProducts(result.products)
    else setError(result.error)
  }

  async function saveBasketWithItems(basketItems: BasketItem[]) {
    const result = await saveBasket(basketItems)

    if (result.basket) {
      setBasket(result.basket)
    } else {
      setError(result.error)
    }
  }
  function viewBasket() {
    saveBasketWithItems(basketItems)
  }

  function updateAndViewBasket(updatedItems: BasketItem[]) {
    setBasketItems(updatedItems)
    if (updatedItems.length > 0) {
      saveBasketWithItems(updatedItems)
    } else {
      setBasket(undefined)
    }
  }

  useEffect(() => {
    fetchAllProducts()
  }, []);

  return (
    <div className="App">
      {pageBody()}
    </div>
  );

  function pageBody() {
    if (error) return <Message notificationText={error} notificationType='error' />
    if (basket) return <BasketView basket={basket} updateAndViewBasket={updateAndViewBasket} />
    if (products) return <Products products={products} basketItems={basketItems} updateBasketItems={setBasketItems} viewBasket={viewBasket} />

    return <Loading />

  }
}

export default App;
