import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Product } from '../api/product';
import ProductCard from './ProductCard';
import Message from '../components/Message';
import { BasketItem } from '../api/basket';
import { Button } from '@material-ui/core';


const useStyles = makeStyles((theme) => ({
  page: {
    height: '100%',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column'
  },
  pageHeader: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'spacebetween',
    alignItems: 'center'
  },
  empty: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
  productArea: {
    width: '100%',
    height: '80%',
    overflow: 'auto'
  },
  products: {
    width: '100%',
    display: 'flex',
    flexGrow: 1,
    flexWrap: 'wrap'

  },
  productBlock: {
    padding: '4px',
    margin: '10px',
    width: '135',
    height: '150'
  }
}));
interface ProductGridProps {
  products: Product[],
  basketItems: BasketItem[],
  updateBasketItems: (items: BasketItem[]) => void
  viewBasket: () => void
}
export default function Products({ products, basketItems, updateBasketItems, viewBasket }: ProductGridProps) {
  const classes = useStyles();

  const basketItem = (id: string) => basketItems.find(item => item.id === id)

  const updateBasketItem = (item: BasketItem) => {
    const otherItems = basketItems.filter(oldItem => oldItem.id !== item.id)
    if (item.quantity > 0) {
      updateBasketItems([...otherItems, item])
    } else {
      updateBasketItems(otherItems)
    }
  }

  const productDisplay = () => {

    if (products.length === 0) return <Message notificationType='info' notificationText={'No products found'} />

    return (
      <div className={classes.products} >

        {products.map(product =>
          <div key={product.id} className={classes.productBlock}>
            <ProductCard product={product} basketItem={basketItem(product.id)} updateBasketItem={updateBasketItem} />
          </div>
        )}
      </div>
    );
  }
  return <div>
    <div className={classes.pageHeader}>
      <div><h1>Products</h1></div>
      <div> <Button color="primary" onClick={viewBasket} variant='contained' disabled={basketItems.length < 1}>
        View Basket
      </Button>
      </div>
    </div>
    <div className={classes.productArea}>{productDisplay()}</div>
  </div>
}
