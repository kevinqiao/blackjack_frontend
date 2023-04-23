import { motion, useSpring } from "framer-motion";
import { useCallback, useEffect, useMemo, useState } from "react";
import useCoordManager from "../../../service/CoordManager";
import useEventSubscriber from "../../../service/EventManager";
import { useGameManager } from "../../../service/GameManager";
import { useTournamentManager } from "../../../service/TournamentManager";
import useInterval from "../../../util/useInterval";

export default function TurnSeatAnimation() {
  const {seatOffset} =useTournamentManager();
  const { round, currentTurn, seats } = useGameManager();

  const { cardXY, seatCoords } = useCoordManager();
  const { event } = useEventSubscriber(["turnOver"], []);
  const [delay, setDelay] = useState(0);

  const pathLength = useSpring(0, {
    stiffness: 10,
    mass: 0.1,
    damping: 10,
  });

  useEffect(() => {
    if (round === 1 && currentTurn) {
      setDelay(200);
      pathLength.jump(0);
    } else {
      setDelay(0);
    }
  }, [currentTurn, pathLength]);

  const updateProgress = useCallback(() => {
    if (round > 0 && currentTurn && currentTurn.seat < 3 && currentTurn.expireTime) {
      const past = currentTurn.expireTime - Date.now();
      pathLength.set((15000 - past) / 15000);
      if (past < -500) pathLength.jump(0);
    }
  }, [currentTurn]);
  useInterval(updateProgress, delay);
  const pwidth = useMemo(() => {
    if (currentTurn && seatCoords && seats && cardXY) {
      let seatNo = currentTurn.seat;
      if (seatNo < 3) {
        seatNo = seatOffset + seatNo;
        if (seatNo > 2) seatNo = seatNo - 3;
      }
      const seat = seats.find((s) => s.no === currentTurn.seat);
      const currentSlot = seat?.slots.find((s) => s.id === seat.currentSlot);
      if (currentSlot?.cards?.length) {
        const seatCoord = seatCoords.find((s: any) => s.no === seatNo);
        const dif = (currentSlot.cards.length - 1) * seatCoord["dx"] * cardXY["width"];
        const w = cardXY["width"] + 8 + (currentSlot.cards.length < 4 ? dif * 2 : dif);
        return w;
      }
    }
    return 0;
  }, [currentTurn, seatCoords, seats, cardXY]);
  const pheight = useMemo(() => {
    return cardXY ? cardXY["height"] + 10 : 0;
  }, [cardXY]);
  const ptop = useMemo(() => {
    if (currentTurn && seatCoords && cardXY) {
      let seatNo = currentTurn.seat;
      if (seatNo < 3) {
        seatNo = seatOffset + seatNo;
        if (seatNo > 2) seatNo = seatNo - 3;
      }
      const seatCoord = seatCoords.find((s: any) => s.no === seatNo);
      if (seatCoord) return seatCoord["y"] - 5;
    }
    return 0;
  }, [currentTurn, seatCoords, cardXY]);

  const pleft = useMemo(() => {
    if (currentTurn && seatCoords && seats && cardXY) {
      const seat = seats.find((s) => s.no === currentTurn.seat);
      const currentSlot = seat?.slots.find((s) => s.id === seat.currentSlot);
      if (currentSlot?.cards?.length) {
        let seatNo = currentTurn.seat;
        if (seatNo < 3) {
          seatNo = seatOffset + seatNo;
          if (seatNo > 2) seatNo = seatNo - 3;
        }
        const seatCoord = seatCoords.find((s: any) => s.no === seatNo);
        if (seatCoord) {
          const dif = ((currentSlot.cards.length - 1) * seatCoord["dx"] * cardXY["width"]) / 2;
          const x = seatCoord["x"] - 5 - (currentSlot.cards.length < 4 ? dif * 2 : dif) - cardXY["width"] / 2;
          return x;
        }
      }
    }
    return 0;
  }, [currentTurn, seatCoords, seats, cardXY]);

  const show = {
    opacity: 1,
    display: "block",
    transition: {
      type: "spring",
      duration: 0.5,
    },
  };

  return (
    <>
      {round === 1 && currentTurn && currentTurn.seat < 3 ? (
        <motion.div style={{ position: "absolute", top: ptop, left: pleft }} animate={show}>
          <motion.svg
            width={pwidth}
            height={pheight}
            style={{
              border: "2px solid grey",
              borderRadius: 5,
            }}
          >
            <motion.rect
              width={pwidth}
              height={pheight}
              stroke="red"
              strokeWidth={8}
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
