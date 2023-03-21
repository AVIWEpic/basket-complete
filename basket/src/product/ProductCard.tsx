import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { Product } from '../api/product';

// TODO prices and discounts, add basket item, change qty or remove when qty exists
const useStyles = makeStyles({
  root: {
    width: 345,
    textOverflow: 'ellipse'
  },
});

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const classes = useStyles();

  return (
    <Card className={classes.root}>
      <CardActionArea>
        {product.imageUrl && <CardMedia
          component="img"
          height="140"
          width="140"
          image={product.imageUrl}
          title={product.name}
        />}
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {product.name}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Button size="small" color="primary">
          Buy Now
        </Button>
        <Button size="small" color="primary">
          Learn More
        </Button>
      </CardActions>
    </Card>
  );
}
