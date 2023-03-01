import React, { useEffect, useRef, useState } from "react";
import { animated, useSpring } from "@react-spring/web";
import "../../styles.css";
import AnimateBox from "./AnimateBox";
import useCoordManager from "../../service/CoordManager";
import useEventSubscriber from "../../service/EventManager";
import useGameManager from "../../service/GameManager";
import MyChipBox from "./MyChipBox";

const ChipBox = () => {
  const { myChipXY } = useCoordManager();
  const { createEvent } = useEventSubscriber([]);

  return (
    <div
      style={{
        position: "relative",
        top: 0,
        left: 0,
        zIndex: 10,
      }}
    >
      {myChipXY ? (
        <>
          <AnimateBox />
          <MyChipBox />
        </>
      ) : null}
      <div
        style={{
          position: "absolute",
          top: 40,
          left: 0,
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          width: "100%",
          zIndex: 1000,
        }}
      >
        <div
          style={{
            cursor: "pointer",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: 120,
            height: 40,
            backgroundColor: "red",
            color: "white",
          }}
          onClick={() => createEvent({ name: "resetGame" })}
        >
          New
        </div>
        <div
          style={{
            cursor: "pointer",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: 120,
            height: 40,
            backgroundColor: "red",
            color: "white",
          }}
          onClick={() => createEvent({ name: "dealCompleted" })}
        >
          Deal
        </div>
      </div>
    </div>
  );
};
export default ChipBox;
