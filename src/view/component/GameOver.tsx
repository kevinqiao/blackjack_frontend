import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { SeatModel } from "../../model";
import useCoordManager from "../../service/CoordManager";
import useEventSubscriber from "../../service/EventManager";
import useGameEngine from "../../service/GameEngine";
import { useGameManager } from "../../service/GameManager";
import "./score.css";

export default function GameOver() {
  const [active, setActive] = useState(false);
  const { cards, seats, results } = useGameManager();
  const { event, createEvent } = useEventSubscriber(["gameOver", "gameStart"], []);
  const gameEngine = useGameEngine();
  const { viewport, cardXY, seatCoords } = useCoordManager();

  useEffect(() => {
    if (event?.name === "gameOver") {
      setActive(true);
    } else setActive(false);
  }, [event]);

  const top = (seatNo: number, slot: number): number => {
    const seatCoord = seatCoords.find((s: any) => s.no === seatNo);
    const seat = seats.find((s: SeatModel) => s.no === seatNo);
    if (seat?.currentSlot === slot) return seatCoord["y"] - 15;
    else return seatCoord ? seatCoord["y"] - cardXY["height"] : 0;
  };

  const left = (seatNo: number, slot: number): number => {
    const seatCoord = seatCoords.find((s: any) => s.no === seatNo);
    const seat = seats.find((s: SeatModel) => s.no === seatNo);
    if (seat?.currentSlot === slot) return seatCoord ? seatCoord["x"] : 0;
    else {
      const slots = seat?.slots.filter((s) => s.id !== seat.currentSlot);
      if (slots) {
        let index = slots?.map((s) => s.id).findIndex((s) => s === slot);
        if (index >= 0) {
          const l = seatCoord["x"] + (0.8 + index - slots.length / 2) * (cardXY["width"] + 95) * 0.6;
          return l;
        }
      }
      return 0;
    }
  };
  const score = (seat: SeatModel, slotId: number): string => {
    if (results?.length > 0) {
      const r = results.find((r) => r.slot === slotId);
      if (r?.win === 1) return "WIN";
      else if (r?.win === 2) return "LOSE";
      else return "PUSH";
    }
    return "";
  };
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: active ? 0.6 : 0 }}
        style={{
          position: "absolute",
          zIndex: 300,
          backgroundColor: "black",
          width: "100%",
          height: "100%",
        }}
      ></motion.div>
      {active &&
        seats
          .filter((s) => s.no !== 3)
          .map((seat) =>
            seat.slots.map((slot) => (
              <motion.div
                key={seat.no + "-" + slot.id}
                custom={{ seat: seat.no, slot: slot.id }}
                initial={{ opacity: 0 }}
                animate={{ opacity: active ? 1 : 0 }}
                style={{
                  position: "absolute",
                  top: top(seat.no, slot.id),
                  left: left(seat.no, slot.id),
                  width: 50,
                  height: 25,
                }}
              >
                <div className="tooltip">
                  <span className="stooltiptext">{score(seat, slot.id)}</span>
                </div>
              </motion.div>
            ))
          )}
    </>
  );
}
