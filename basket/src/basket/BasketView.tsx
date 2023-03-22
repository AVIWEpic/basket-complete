import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import BasketCard from "./BasketCard";
import { BasketItem, SavedBasket } from "../api/basket";
import { Button } from "@material-ui/core";
import Loading from "../components/Loading";
import basketItemSort from "../utils/basketItemSort";

const useStyles = makeStyles((theme) => ({
  pageHeader: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginLeft: "2em",
    marginRight: "2em",
  },
  pageHeaderActions: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: "5em",
    paddingRight: "5em",
  },
  productArea: {
    height: "80vh",
    overflow: "auto",
  },
  products: {
    display: "flex",
    flexGrow: 1,
    flexWrap: "wrap",
  },
  itemBlock: {
    padding: "1em",
  },
}));
interface BasketViewProps {
  basket: SavedBasket;
  updateAndViewBasket: (items: BasketItem[]) => void;
  closeBasket: () => void;
  basketLoading: boolean;
}
export default function BasketView({
  basket,
  updateAndViewBasket,
  closeBasket,
  basketLoading,
}: BasketViewProps) {
  const classes = useStyles();

  const updateBasketItem = (item: BasketItem) => {
    const otherItems = basket.items.filter((oldItem) => oldItem.id !== item.id);
    const items: BasketItem[] =
      item.quantity > 0 ? [...otherItems, item] : otherItems;

    updateAndViewBasket(items);
  };

  const basketItems = basketItemSort(basket.items);
  return (
    <div>
      <div className={classes.pageHeader}>
        <div>
          <h1>Basket</h1>
        </div>
        {basketLoading && <Loading />}
        <div className={classes.pageHeaderActions}>
          {basket.total && <h2>Total: £{basket.total}</h2>}
          <div>
            <Button
              color="primary"
              onClick={closeBasket}
              variant="contained"
              disabled={basketLoading}
            >
              Products
            </Button>
          </div>
        </div>
      </div>

      <div className={classes.productArea}>
        <div className={classes.products}>
          {basketItems.map((item) => (
            <div key={item.id} className={classes.itemBlock}>
              <BasketCard
                basketItem={item}
                updateBasketItem={updateBasketItem}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
