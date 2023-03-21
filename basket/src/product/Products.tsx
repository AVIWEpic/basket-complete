import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { Product } from '../api/product';
import ProductCard from './ProductCard';
import Message from '../components/Message';

const useStyles = makeStyles((theme) => ({
  empty: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
  products: {
    flexGrow: 1,
  },
}));
interface ProductGridProps {
  products: Product[]
}
export default function Products({ products }: ProductGridProps) {
  const classes = useStyles();

  const productDisplay = () => {

    if (products.length === 0) return <Message notificationType='info' notificationText={'No products found'} />

    return (
      <Grid container className={classes.products} spacing={2}>
        <Grid item xs={12}>
          <Grid container justifyContent="center" spacing={2}>
            {products.map(product =>
              <Grid key={product.id} item>
                <ProductCard product={product} />
              </Grid>
            )}
          </Grid>
        </Grid>

      </Grid>
    );
  }
  return <div>
    <h1>Products</h1>
    <div>{productDisplay()}</div>
  </div>
}
