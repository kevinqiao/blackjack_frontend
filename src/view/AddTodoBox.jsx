import { Box, Button, TextField } from "@mui/material";
import React, { useState } from "react";
import * as TaskApi from "../api/TaskAPI";

const AddTodoBox = () => {
  const [inputTaskLabel, setInputTaskLabel] = useState("");
  const createTask = async (taskLabel) => {
    if (taskLabel && taskLabel.trim().length > 0) {
      setInputTaskLabel("");
      const task = {
        id: Date.now(),
        label: taskLabel,
        createTime: Date.now(),
        completed: false,
      };
      await TaskApi.createTask(task);
    }
  };
  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-start",
          width: "70%",
        }}
      >
        <TextField
          id="filled-basic"
          style={{ width: "60%", maxWidth: 300, marginRight: 10 }}
          value={inputTaskLabel}
          onKeyUp={(e) => {
            if (e.key === "Enter") createTask(inputTaskLabel);
          }}
          onChange={(e) => setInputTaskLabel(e.target.value)}
        />
        <Button
          variant="outlined"
          style={{ textTransform: "none", color: "black", backgroundColor: "#CFE5F6" }}
          onClick={() => createTask(inputTaskLabel)}
        >
          <span style={{ fontSize: "20px" }}>Add</span>
        </Button>
      </Box>
    </>
  );
};
export default AddTodoBox;
