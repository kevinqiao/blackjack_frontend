import * as React from "react";
import Link from "@mui/material/Link";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import * as TaskApi from "../api/TaskAPI";
export default function DeleteAllButton() {
  const [open, setOpen] = React.useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const confirm = async () => {
    await TaskApi.removeAll();
    setOpen(false);
  };
  return (
    <div>
      <Link href="#" onClick={handleClickOpen}>
        <span style={{ fontSize: 20 }}>Delete all tasks</span>
      </Link>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Are you sure to delete all tasks?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            If you remove all tasks, you cannot restore.Please make sure your action.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={confirm} autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
