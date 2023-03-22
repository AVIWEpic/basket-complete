import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import { Product } from "../api/product";
import { BasketItem } from "../api/basket";
import BasketQuantity from "./BasketQuantity";
import Message from "../components/Message";
import ProductPrice from "../product/ProductPrice";

const useStyles = makeStyles({
  root: {
    display: "flex",
  },
  details: {
    display: "flex",
    flexDirection: "column",
    width: "75%",
  },
  content: {
    flex: "1 0 auto",
  },
  cover: {
    width: 151,
  },
  controls: {
    padding: "1ch 0",
    display: "flex",
    justifyContent: "space-between",
    alignContent: "center",
  },
  media: {
    objectFit: "contain",
    height: "6em",
  },
});

interface BasketCardProps {
  basketItem: Product & BasketItem;
  updateBasketItem: (item: Product & BasketItem) => void;
}
export default function BasketCard({
  basketItem,
  updateBasketItem,
}: BasketCardProps) {
  const classes = useStyles();
  const updateQuantity = (newQuantity: string) => {
    const quantity = newQuantity ? parseInt(newQuantity) : 0;
    updateBasketItem({ ...basketItem, quantity });
  };
  const displayQuantity = basketItem?.quantity.toString() || "";

  return (
    <Card className={classes.root}>
      {basketItem.error && (
        <Message notificationType={"info"} notificationText={"item.error"} />
      )}
      <div className={classes.details}>
        <CardContent className={classes.content}>
          <Typography component="h5" variant="h5" align="left">
            {basketItem.name}
          </Typography>
          {basketItem.description && (
            <Typography variant="subtitle1" color="textSecondary" align="left">
              {basketItem.description}
            </Typography>
          )}
          {basketItem.error && (
            <Typography variant="subtitle1" color="error" align="left">
              {basketItem.error}
            </Typography>
          )}
          <Typography align="right">
            <ProductPrice product={basketItem} />
          </Typography>
        </CardContent>
      </div>
      <div>
        <div className={classes.controls}>
          <BasketQuantity
            quantity={displayQuantity}
            updateQuantity={updateQuantity}
          />
        </div>
        {basketItem.imageUrl && (
          <img
            className={classes.media}
            src={basketItem.imageUrl}
            title={basketItem.name}
            alt=""
          />
        )}
      </div>
    </Card>
  );
}
