import { motion } from "framer-motion";
import { useState } from "react";
import { SeatModel } from "../../model";
import useCoordManager from "../../service/CoordManager";
import useEventSubscriber from "../../service/EventManager";
import useGameEngine from "../../service/GameEngine";
import { useGameManager } from "../../service/GameManager";
import "./score.css";

export default function GameOver() {
  const [active, setActive] = useState(false);
  const { cards, seats, results, newGame } = useGameManager();
  const { event, createEvent } = useEventSubscriber(["gameOver", "gameStart"], []);
  const gameEngine = useGameEngine();
  const { viewport, cardXY, seatCoords } = useCoordManager();

  const top = (seatNo: number, slot: number): number => {
    const seatCoord = seatCoords.find((s: any) => s.no === seatNo);
    const seat = seats.find((s: SeatModel) => s.no === seatNo);
    if (seat?.currentSlot === slot) return seatCoord["y"] + cardXY["height"] / 2;
    else return seatCoord ? seatCoord["y"] - (cardXY["height"] + 115) * 0.3 : 0;
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
          const l = seatCoord["x"] + (0.5 + index - slots.length / 2) * (cardXY["width"] + 95) * 0.6;
          return l;
        }
      }
      return 0;
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: active ? 0.6 : 0 }}
        style={{
          position: "absolute",
          zIndex: 1400,
          backgroundColor: "black",
          width: "100%",
          height: "100%",
        }}
      ></motion.div>
      <div
        style={{
          cursor: "pointer",
          position: "absolute",
          zIndex: 1400,
          top: 10,
          left: 20,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: 80,
          height: 40,
          backgroundColor: "red",
          borderRadius: 5,
          color: "white",
        }}
        onClick={newGame}
      >
        New Game
      </div>
    </>
  );
}
