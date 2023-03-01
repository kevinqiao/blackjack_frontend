import React, { useRef, useState } from "react";
import { Container, Grid, Box } from "@mui/material";
import useMeasure from "react-use-measure";
import "../../styles.css";
import { useEffect } from "react";
import { useMemo } from "react";

const BetChipBox = () => {
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "flex-start", width: "100%" }}>
      <div
        style={{
          display: "flex",
          border: "1px solid blue",
        }}
      >
        <div class="pokerchip red" onClick={() => console.log("1")}></div>
        <div class="pokerchip red" onClick={() => console.log("2")}></div>
        <div class="pokerchip red" onClick={() => console.log("3")}></div>
        <div class="pokerchip red" onClick={() => console.log("2")}></div>
        <div class="pokerchip red" onClick={() => console.log("3")}></div>
      </div>
    </div>
  );
};
export default BetChipBox;
