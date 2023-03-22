import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import { Product } from "../api/product";
import ProductPrice from "./ProductPrice";
import { BasketItem } from "../api/basket";
import BasketQuantity from "../basket/BasketQuantity";

const useStyles = makeStyles({
  root: {
    width: "20em",
    textOverflow: "ellipse",
  },
  media: {
    objectFit: "contain",
    height: "10em",
  },
  actionRow: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionRowElement: {
    padding: " 0 1em",
    display: "flex",
    justifyContent: "space-between",
    alignContent: "center",
  },
});

interface ProductCardProps {
  product: Product;
  basketItem?: BasketItem;
  updateBasketItem: (updatedItem: BasketItem) => void;
}

export default function ProductCard({
  product,
  basketItem,
  updateBasketItem,
}: ProductCardProps) {
  const classes = useStyles();

  const updateQuantity = (newQuantity: string) => {
    const quantity = newQuantity ? parseInt(newQuantity) : 0;
    updateBasketItem({ id: product.id, quantity });
  };

  const displayQuantity = basketItem?.quantity.toString() || "";
  return (
    <Card className={classes.root}>
      <CardActionArea>
        {product.imageUrl && (
          <img
            className={classes.media}
            src={product.imageUrl}
            title={product.name}
            alt=""
          />
        )}
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {product.name}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions className={classes.actionRow}>
        <div>
          <ProductPrice product={product} />
        </div>
        <div className={classes.actionRowElement}>
          <BasketQuantity
            quantity={displayQuantity}
            updateQuantity={updateQuantity}
          />
        </div>
      </CardActions>
    </Card>
  );
}
