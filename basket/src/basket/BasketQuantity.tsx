import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import DeleteIcon from "@material-ui/icons/Delete";
import { IconButton, Button, FormLabel } from "@material-ui/core";

interface BasketQuantityProps {
  quantity: string;
  updateQuantity: (updatedQuantity: string) => void;
}

const useStyles = makeStyles((theme) => ({
  quantityBlock: {
    display: "flex",
    alignItems: "center",
  },
  quantity: {
    marginLeft: "1em",
    width: "3em",
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
    },
  },
}));

export default function BasketQuantity({
  quantity,
  updateQuantity,
}: BasketQuantityProps) {
  const classes = useStyles();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChange = (event: any) => {
    updateQuantity(event.target.value);
  };

  const addToBasket = () => {
    updateQuantity("1");
  };

  const removeFromBasket = () => {
    updateQuantity("");
  };

  if (quantity) {
    return (
      <>
        <div className={classes.quantityBlock}>
          <FormLabel>Qty</FormLabel>
          <TextField
            className={classes.quantity}
            id="quantity"
            type="number"
            inputProps={{ min: 0, max: 10 }}
            onChange={handleChange}
            value={quantity}
          />
        </div>
        <IconButton size="small" onClick={removeFromBasket}>
          <DeleteIcon />
        </IconButton>
      </>
    );
  }

  return (
    <Button size="small" color="primary" onClick={addToBasket}>
      Buy Now
    </Button>
  );
}
