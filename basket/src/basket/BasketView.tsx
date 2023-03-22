import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import BasketCard from './BasketCard';
import { BasketItem, SavedBasket } from '../api/basket';

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
  itemBlock
    : {
    padding: '4px',
    margin: '10px',
    width: '135',
    height: '150'
  }
}));
interface BasketViewProps {
  basket: SavedBasket,
  updateAndViewBasket: (items: BasketItem[]) => void
}
export default function BasketView({ basket, updateAndViewBasket }: BasketViewProps) {
  const classes = useStyles();

  const updateBasketItem = (item: BasketItem) => {
    const otherItems = basket.items.filter(oldItem => oldItem.id !== item.id)
    const items: BasketItem[] = (item.quantity > 0) ? [...otherItems, item] : otherItems

    updateAndViewBasket(items)
  }

  return <div>
    <h1>Basket</h1>
    {basket.total && <h2>Total: {basket.total}</h2>}
    <div className={classes.products} >

      {basket.items.map(item =>
        <div key={item.id} className={classes.itemBlock
        }>
          <BasketCard basketItem={item} updateBasketItem={updateBasketItem} />
        </div>
      )}
    </div>
  </div>

}
