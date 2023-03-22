import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import { Product } from '../api/product';
import { BasketItem } from '../api/basket';
import BasketQuantity from './BasketQuantity';
import Message from '../components/Message';
import ProductPrice from '../product/ProductPrice';

const useStyles = makeStyles(({
  root: {
    display: 'flex',
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
  },
  content: {
    flex: '1 0 auto',
  },
  cover: {
    width: 151,
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
  },
  playIcon: {
    height: 38,
    width: 38,
  },
}));

interface BasketCardProps {
  basketItem: Product & BasketItem,
  updateBasketItem: (item: Product & BasketItem) => void
}
export default function BasketCard({ basketItem, updateBasketItem }: BasketCardProps) {
  const classes = useStyles();
  const updateQuantity = (newQuantity: string) => {
    const quantity = newQuantity ? parseInt(newQuantity) : 0
    updateBasketItem({ ...basketItem, quantity })
  }
  const displayQuantity = basketItem?.quantity.toString() || ''

  return (
    <Card className={classes.root}>
      {basketItem.error && <Message notificationType={'info'} notificationText={'item.error'} />}
      <div className={classes.details}>
        <CardContent className={classes.content}>
          <Typography component="h5" variant="h5">
            {basketItem.name}
          </Typography>
          {basketItem.description && <Typography variant="subtitle1" color="textSecondary">
            {basketItem.description}
          </Typography>}
          <Typography><ProductPrice product={basketItem} /></Typography>
        </CardContent>
        <div className={classes.controls}>
          <BasketQuantity quantity={displayQuantity} updateQuantity={updateQuantity} />
        </div>
      </div>
      <CardMedia
        className={classes.cover}
        image={basketItem.imageUrl}
      />
    </Card>
  );
}
