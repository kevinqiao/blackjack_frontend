import { motion, useSpring } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import useCoordManager from "../../../service/CoordManager";
import useEventSubscriber from "../../../service/EventManager";
import { useGameManager } from "../../../service/GameManager";
import useInterval from "../../../util/useInterval";

export default function TurnSeatAnimation() {
  const { currentTurn, seats } = useGameManager();
  const [display, setDisplay] = useState(false);
  const { cardXY, seatCoords } = useCoordManager();
  const { event } = useEventSubscriber(["turnOver"], []);
  const count = useRef(0);
  const [delay, setDelay] = useState(0);

  const pathLength = useSpring(0, {
    stiffness: 10,
    mass: 0.1,
    damping: 10,
  });
  useEffect(() => {
    if (currentTurn && currentTurn?.seat < 3 && currentTurn?.seat >= 0 && pathLength) {
      pathLength.jump(0);
      count.current = 0;
      setDelay(100);
      setDisplay(true);
    }
  }, [currentTurn, pathLength]);
  useEffect(() => {
    if (event?.name === "turnOver") {
      count.current = 0;
      pathLength.jump(0);
      setDelay(0);
      setDisplay(false);
    }
  }, [event, pathLength]);
  const updateProgress = () => {
    count.current++;
    if (count.current > 165) {
      setDelay(0);
      pathLength.jump(0);
      count.current = 0;
      setDisplay(false);
    } else {
      pathLength.set(count.current / 150);
    }
  };
  useInterval(updateProgress, delay);
  const pwidth = useMemo(() => {
    if (currentTurn && seatCoords && seats && cardXY) {
      const seat = seats.find((s) => s.no === currentTurn.seat);
      const currentSlot = seat?.slots.find((s) => s.id === seat.currentSlot);
      if (currentSlot?.cards?.length) {
        const seatCoord = seatCoords.find((s: any) => s.no === currentTurn.seat);
        const dif = (currentSlot.cards.length - 1) * seatCoord["dx"] * cardXY["width"];
        const w = cardXY["width"] + 40 + (currentSlot.cards.length < 4 ? dif * 2 : dif);
        return w;
      }
    }
    return 0;
  }, [currentTurn, seatCoords, seats, cardXY]);
  const pheight = useMemo(() => {
    return cardXY ? cardXY["height"] + 40 : 0;
  }, [cardXY]);
  const ptop = useMemo(() => {
    if (currentTurn && seatCoords && cardXY) {
      const seatCoord = seatCoords.find((s: any) => s.no === currentTurn.seat);
      if (seatCoord) return seatCoord["y"] - 20;
    }
    return 0;
  }, [currentTurn, seatCoords, cardXY]);

  const pleft = useMemo(() => {
    if (currentTurn && seatCoords && seats && cardXY) {
      const seat = seats.find((s) => s.no === currentTurn.seat);
      const currentSlot = seat?.slots.find((s) => s.id === seat.currentSlot);
      if (currentSlot?.cards?.length) {
        const seatCoord = seatCoords.find((s: any) => s.no === currentTurn.seat);
        if (seatCoord) {
          const dif = ((currentSlot.cards.length - 1) * seatCoord["dx"] * cardXY["width"]) / 2;
          const x = seatCoord["x"] - 20 - (currentSlot.cards.length < 4 ? dif * 2 : dif) - cardXY["width"] / 2;
          return x;
        }
      }
    }
    return 0;
  }, [currentTurn, seatCoords, seats, cardXY]);

  const show = {
    opacity: 1,
    display: "block",
  };

  const hide = {
    opacity: 0,
    transitionEnd: {
      display: "none",
    },
  };
  return (
    <>
      {currentTurn && currentTurn?.seat < 3 ? (
        <motion.div style={{ position: "absolute", top: ptop, left: pleft }} animate={display ? show : hide}>
          <motion.svg
            width={pwidth}
            height={pheight}
            style={{
              border: "2px solid grey",
            }}
          >
            <motion.rect
              width={pwidth}
              height={pheight}
              stroke="red"
              strokeWidth={5}
              style={{
                fill: "none",
                border: "none",
                pathLength: pathLength,
              }}
            />
          </motion.svg>
        </motion.div>
      ) : null}
    </>
  );
}
