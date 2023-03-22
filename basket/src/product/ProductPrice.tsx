import React from "react";
import { Product } from "../api/product";
import { makeStyles } from "@material-ui/core/styles";
import formatPrice from "../utils/formatPrice";

const useStyles = makeStyles({
  oldPrice: {
    textDecorationLine: "line-through",
    paddingRight: 5,
  },
});
interface ProductPriceProps {
  product: Product;
}
export default function ProductPrice({ product }: ProductPriceProps) {
  const classes = useStyles();

  const { price, discountPercentage } = product;
  if (discountPercentage) {
    const discountPrice = price - (price * discountPercentage) / 100;
    return (
      <>
        <span className={classes.oldPrice}>{formatPrice(price)}</span>
        <span>{formatPrice(discountPrice)}</span>
      </>
    );
  }

  return <>{formatPrice(price)}</>;
}
