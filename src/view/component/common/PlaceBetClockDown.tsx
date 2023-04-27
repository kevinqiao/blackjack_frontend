import { motion, useSpring } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import useCoordManager from "../../../service/CoordManager";
import useEventSubscriber from "../../../service/EventManager";
import { useGameManager } from "../../../service/GameManager";
import useInterval from "../../../util/useInterval";

export default function PlaceBetClockDown() {
  const { gameId, round, currentTurn } = useGameManager();
  const { viewport } = useCoordManager();
  const { event } = useEventSubscriber(["turnOver"], []);
  const [timer, setTimer] = useState(0);
  const [expire, setExpire] = useState(15000 + Date.now());

  const pathLength = useSpring(0, {
    stiffness: 10,
    mass: 0.1,
    damping: 10,
  });
  useEffect(() => {
    if (expire - Date.now() > 0) {
      console.log("interval start");
      setTimer(200);
      pathLength.jump(0);
    }
  }, [expire]);
  // useEffect(() => {
  //   if (currentTurn?.round === 0) {
  //     setTimer(200);
  //     pathLength.jump(0);
  //   } else {
  //     setTimer(0);
  //   }
  // }, [currentTurn, pathLength]);

  const updateProgress = useCallback(() => {
    const past = expire - Date.now();
    console.log(past);
    if (past < -1200) {
      pathLength.jump(0);
      setTimer(0);
    } else pathLength.set((15000 - past) / 15000);
  }, [expire, timer]);

  useInterval(updateProgress, timer);

  const ptop = viewport ? viewport["height"] * 0.3 : 0;
  const pleft = viewport ? viewport["width"] * 0.5 - 90 : 0;

  const show = {
    opacity: 1,
    display: "block",
    transition: {
      type: "spring",
      duration: 1.5,
    },
  };

  return (
    <>
      {gameId > 0 ? (
        <motion.div style={{ position: "absolute", zIndex: 8000, top: ptop, left: pleft }} animate={show}>
          <motion.svg width={180} height={80}>
            <motion.rect
              width={180}
              height={80}
              style={{
                fill: "blue",
                stroke: "rgb(255, 255, 255)",
                strokeWidth: 7,
                pathLength: pathLength,
              }}
            />
            <text text-anchor="middle" x="90" y="45" fill="red">
              I love SVG!
            </text>
          </motion.svg>
        </motion.div>
      ) : null}
    </>
  );
}
