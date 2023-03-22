import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Product } from "../api/product";
import ProductCard from "./ProductCard";
import Message from "../components/Message";
import { BasketItem } from "../api/basket";
import { Button } from "@material-ui/core";

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
    justifyContent: "space-around",
  },
  empty: {
    width: "100%",
    "& > * + *": {
      marginTop: theme.spacing(2),
    },
  },
  productArea: {
    height: "80vh",
    overflow: "auto",
  },
  products: {
    width: "100%",
    display: "flex",
    flexGrow: 1,
    flexWrap: "wrap",
  },
  productBlock: {
    padding: theme.spacing(1),
    margin: theme.spacing(1),
    width: "135",
    height: "150",
  },
}));
interface ProductGridProps {
  products: Product[];
  basketItems: BasketItem[];
  updateBasketItems: (items: BasketItem[]) => void;
  viewBasket: () => void;
}
export default function Products({
  products,
  basketItems,
  updateBasketItems,
  viewBasket,
}: ProductGridProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>();
  const classes = useStyles();

  const basketItem = (id: string) => basketItems.find((item) => item.id === id);
  const basketCount = basketItems.reduce(
    (accumulator, currentValue) => accumulator + currentValue.quantity,
    0
  );

  const updateBasketItem = (item: BasketItem) => {
    const otherItems = basketItems.filter((oldItem) => oldItem.id !== item.id);
    if (item.quantity > 0) {
      updateBasketItems([...otherItems, item]);
    } else {
      updateBasketItems(otherItems);
    }
  };

  const productDisplay = () => {
    if (products.length === 0) {
      return (
        <Message
          notificationType="info"
          notificationText={"No products found"}
        />
      );
    }

    if (selectedProduct) {
      return (
        <div className={classes.products}>
          <ProductCard
            product={selectedProduct}
            basketItem={basketItem(selectedProduct.id)}
            updateBasketItem={updateBasketItem}
            showAll={() => setSelectedProduct(undefined)}
          />
        </div>
      );
    }
    return (
      <div className={classes.products}>
        {products.map((product) => (
          <div key={product.id} className={classes.productBlock}>
            <ProductCard
              product={product}
              basketItem={basketItem(product.id)}
              updateBasketItem={updateBasketItem}
              showSingle={() => setSelectedProduct(product)}
            />
          </div>
        ))}
      </div>
    );
  };
  return (
    <div>
      <div className={classes.pageHeader}>
        <div>
          <h1>Products</h1>
        </div>
        <div>
          <Button
            color="primary"
            onClick={viewBasket}
            variant="contained"
            disabled={basketItems.length < 1}
          >
            Basket ({basketCount})
          </Button>
        </div>
      </div>
      <div className={classes.productArea}>{productDisplay()}</div>
    </div>
  );
}
