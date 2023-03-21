import React, { useEffect, useState } from 'react';
import { getProducts, Product } from './api/product';
import './App.css';
import Loading from './components/Loading';
import Message from './components/Message';
import Products from './product/Products';

function App() {
  const [products, setProducts] = useState<Product[] | undefined>();
  const [error, setError] = useState<string | undefined>();

  const [bio, setBio] = useState(null);

  async function fetchAllProducts() {
    setProducts(undefined);

    const result = await getProducts()
    console.log('result', result)
    if (result.products) setProducts(result.products)
    else setError(result.error)

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
    if (products) return <Products products={products} />



    return <Loading />

  }
}

export default App;
