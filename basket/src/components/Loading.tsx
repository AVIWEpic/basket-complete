import React from 'react';
import LinearProgress from '@material-ui/core/LinearProgress';
import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
}));

export default function Loading() {
  const classes = useStyles();

  return (
    <div className={classes.root} data-testid='loading-bar'>
      <LinearProgress />
      <LinearProgress color="secondary" />
    </div>
  );
}
