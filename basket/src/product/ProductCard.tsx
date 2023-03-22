import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { Product } from '../api/product';
import ProductPrice from './ProductPrice';
import { BasketItem } from '../api/basket';
import BasketQuantity from '../basket/BasketQuantity';

// TODO prices and discounts, add basket item, change qty or remove when qty exists
const useStyles = makeStyles({
  root: {
    width: 345,
    textOverflow: 'ellipse'
  },
  media: {
    objectFit: 'contain',
    height: '75'
  },
  actionRow: {
    width: '100%'
  },
  actionRowElement: {
    width: '50%',
  }
});

interface ProductCardProps {
  product: Product,
  basketItem?: BasketItem,
  updateBasketItem: (updatedItem: BasketItem) => void
}

export default function ProductCard({ product, basketItem, updateBasketItem }: ProductCardProps) {
  const classes = useStyles();

  const updateQuantity = (newQuantity: string) => {
    const quantity = newQuantity ? parseInt(newQuantity) : 0
    updateBasketItem({ id: product.id, quantity })
  }

  const displayQuantity = basketItem?.quantity.toString() || ''
  return (
    <Card className={classes.root}>
      <CardActionArea>
        {product.imageUrl && <img
          className={classes.media}
          src={product.imageUrl}
          title={product.name}
          alt=''
        />}
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {product.name}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions className={classes.actionRow}>
        <Typography align='left'>
          <ProductPrice product={product} />
        </Typography>
        <Typography align='right' className={classes.actionRowElement}>
          <BasketQuantity quantity={displayQuantity} updateQuantity={updateQuantity} />
        </Typography>
      </CardActions>
    </Card>
  );
}
