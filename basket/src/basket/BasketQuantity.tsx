import React from "react";

import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';
import { IconButton, Button } from '@material-ui/core';

interface BasketQuantityProps {
  quantity: string,
  updateQuantity: (updatedQuantity: string) => void
}

const useStyles = makeStyles((theme) => ({
  quantity: {
    width: '5ch',

    '& .MuiTextField-root': {
      margin: theme.spacing(1),
    },
  },
}));

export default function BasketQuantity({ quantity, updateQuantity }: BasketQuantityProps) {
  const classes = useStyles();

  const handleChange = (event: any) => {
    updateQuantity(event.target.value)
  }

  const addToBasket = () => {
    updateQuantity('1')
  }

  const removeFromBasket = () => {
    updateQuantity('')
  }

  if (quantity) {
    return <>
      <TextField
        className={classes.quantity}
        id="quantity"
        type="number"
        inputProps={{ min: 0, max: 10 }}
        InputLabelProps={{
          shrink: true,
        }}
        // variant="outlined"
        onChange={handleChange}
        value={quantity}
      />
      <IconButton size="small" onClick={removeFromBasket}>
        <DeleteIcon />
      </IconButton>
    </>
  }

  return <Button size="small" color="primary" onClick={addToBasket}>
    Buy Now
  </Button>
}