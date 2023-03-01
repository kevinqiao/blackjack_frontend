import React, { useRef, useState } from "react";
import { Container, Grid, Box } from "@mui/material";
import { useSpring, useChain, config, animated, useSpringRef } from "@react-spring/web";
import "../styles.css";
import { useEffect } from "react";

const ChipBox = () => {
  const [scale, setScale] = useState(0.32);
  useEffect(() => {
    const r = document.querySelector(":root");
    var rs = getComputedStyle(r);
    console.log(rs.getPropertyValue("--blue"));
    r.style.setProperty("--content", '"3"');
    r.style.setProperty("--content1", '"7"');
  }, []);
  return (
    <Container maxWidth="lg" sx={{ py: 2 }}>
      <Grid container>
        <Grid item xs={12}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              width: "100%",
            }}
          >
            <div style={{ width: 60 }}>
              <div class="pokerchip white"></div>
            </div>
            <div style={{ width: 60 }}>
              <div class="pokerchip red" style={{ transform: "scale(" + scale + ")" }}></div>
            </div>
          </div>
        </Grid>
      </Grid>
    </Container>
  );
};
export default ChipBox;
