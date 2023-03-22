import React from "react";

import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";
import { makeStyles } from "@material-ui/core/styles";

function Alert(props: JSX.IntrinsicAttributes & AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    "& > * + *": {
      marginTop: theme.spacing(2),
    },
  },
}));

interface SnackbarProps {
  notificationType: "error" | "info" | "warning" | "success";
  notificationText: string;
  onClose?: () => void;
}

export default function Message({
  notificationType,
  notificationText,
  onClose,
}: SnackbarProps) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Alert severity={notificationType} onClose={onClose}>
        {notificationText}
      </Alert>
    </div>
  );
}
