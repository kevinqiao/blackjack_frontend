import { motion, useAnimationControls } from "framer-motion";
import { useEffect, useState } from "react";
import { SeatModel } from "../../model";
import useCoordManager from "../../service/CoordManager";
import useEventSubscriber from "../../service/EventManager";
import useGameEngine from "../../service/GameEngine";
import { useGameManager } from "../../service/GameManager";
import { useTournamentManager } from "../../service/TournamentManager";
import { useUserManager } from "../../service/UserManager";
import "./score.css";

export default function GameOver() {
  const [active, setActive] = useState(false);
  const {seatOffset} = useGameManager();
  const {seats, results } = useGameManager();
  const { event, createEvent } = useEventSubscriber(["gameOver", "gameStart"], []);
  const gameEngine = useGameEngine();
  const { viewport, cardXY, seatCoords } = useCoordManager();
  const resultControls = useAnimationControls();

  useEffect(() => {
    if (results?.length > 0) {
      resultControls.start((o) => {
        return {
          opacity: 1,
          transition: {
            duration: 2,
            type: "tween",
          },
        };
      });
    }
  }, [results]);
  const top = (seatNo: number, slot: number): number => {
    const sno = seatNo;
    if (seatNo < 3) {
      seatNo = seatOffset + seatNo;
      if (seatNo > 2) seatNo = seatNo - 3;
    }
    const seatCoord = seatCoords.find((s: any) => s.no === seatNo);
    console.log(seatCoord)
    const seat = seats.find((s: SeatModel) => s.no === sno);
    if (seat?.currentSlot === slot) return seatCoord["y"] + cardXY["height"] / 2;
    else return seatCoord ? seatCoord["y"] - (cardXY["height"] + 115) * 0.3 : 0;
  };

  const left = (seatNo: number, slot: number): number => {
    const sno = seatNo;
    if (seatNo < 3) {
      seatNo = seatOffset + seatNo;
      if (seatNo > 2) seatNo = seatNo - 3;
    }
    const seatCoord = seatCoords.find((s: any) => s.no === seatNo);
    const seat = seats.find((s: SeatModel) => s.no === sno);
    if (seat?.currentSlot === slot) return seatCoord ? seatCoord["x"] + cardXY["width"] / 4 : 0;
    else {
      const slots = seat?.slots.filter((s) => s.id !== seat.currentSlot);
      if (slots) {
        let index = slots?.map((s) => s.id).findIndex((s) => s === slot);
        if (index >= 0) {
          const l =
            seatCoord["x"] + (cardXY["width"] / 2 + (0.5 + index - slots.length / 2) * (cardXY["width"] + 95)) * 0.6;
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
          zIndex: 1400,
          backgroundColor: "black",
          width: "100%",
          height: "100%",
        }}
      ></motion.div>
      {/* <div
        style={{
          cursor: "pointer",
          position: "absolute",
          zIndex: 1400,
          top: 10,
          left: 20,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: 80,
            height: 40,
            backgroundColor: "red",
            borderRadius: 5,
            color: "white",
          }}
        >
          New Game
        </div>
        <div>{uid}</div>
      </div> */}
      {seats
        .filter((s) => s.no !== 3)
        .map((seat) =>
          seat.slots.map((slot) => (
            <motion.div
              key={seat.no + "-" + slot.id}
              custom={{ seat: seat.no, slot: slot.id }}
              initial={{ opacity: 0 }}
              animate={resultControls}
              style={{
                position: "absolute",
                zIndex: 2000,
                top: top(seat.no, slot.id),
                left: left(seat.no, slot.id),
                width: 50,
                height: 25,
              }}
            >
              <div className="tooltip">
                <span className="tooltiptext">{score(seat, slot.id)}</span>
              </div>
            </motion.div>
          ))
        )}
    </>
  );
}
