import * as React from "react";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import * as TaskApi from "../api/TaskAPI";
export default function DeleteTaskButton({ task, ...props }) {
  const [open, setOpen] = React.useState(false);
  const handleClickOpen = (event) => {
    setOpen(true);
  };
  const handleClose = () => {
    if (props.onClose) props.onClose();
    setOpen(false);
  };
  const confirm = async () => {
    await TaskApi.removeTask(task.id);
    setOpen(false);
  };
  return (
    <div>
      <div style={{ cursor: "pointer", width: 50 }} onClick={(event) => handleClickOpen(event)}>
        <DeleteForeverIcon style={{ fontSize: "40px", color: "black" }} />
      </div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{`Are you sure to delete ${task.label}?`}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            If you remove the task, you cannot restore. Please make sure your action.
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
