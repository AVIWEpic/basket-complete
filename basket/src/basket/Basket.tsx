import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { Product } from '../api/product';
import BasketCard from './BasketCard';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    height: 140,
    width: 100,
  },
  control: {
    padding: theme.spacing(2),
  },
}));
interface BasketProps {
  products: Product[]
}
export default function Basket({ products }: BasketProps) {
  const classes = useStyles();



  return (
    <Grid container className={classes.root} spacing={2}>
      <Grid item xs={12}>
        <Grid container justifyContent="center" spacing={2}>
          {products.map((product) => (
            <Grid key={product.id} item>
              <BasketCard product={product} />
            </Grid>
          ))}
        </Grid>
      </Grid>

    </Grid>
  );
}
