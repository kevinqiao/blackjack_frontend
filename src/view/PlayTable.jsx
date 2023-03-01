import React, { useRef, useState } from "react";
import { Container, Grid, Box } from "@mui/material";
import { useSpring, useChain, config, animated, useSpringRef } from "@react-spring/web";
import "../styles.css";

const PlayTable = () => {
  const tref = useRef();

  const [tstyles, tapi] = useSpring(() => ({
    from: { x: 0, y: 0, opacity: 0 },
  }));
  const [sstyles, sapi] = useSpring(() => ({
    from: { x: 0, y: 0, opacity: 0 },
  }));
  const startMove = () => {
    tapi.start({ to: { x: 100, y: 100, opacity: 1 } });
  };
  return (
    <Container maxWidth="md" sx={{ py: 2 }}>
      <Grid container>
        <Grid item xs={12}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              width: "100%",
            }}
          >
            <div ref={tref} style={{ cursor: "pointer" }} className={"circle"} onClick={startMove} />
            <animated.div className={"circle"} style={tstyles}></animated.div>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Box
            sx={{
              height: 160,
            }}
          ></Box>
        </Grid>
        <Grid item xs={12}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              height: 60,
              width: "100%",
            }}
          >
            <div className={"circle"} />
            <animated.div className={"circle"} style={sstyles}></animated.div>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};
export default PlayTable;
