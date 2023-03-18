import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { SeatModel } from "../../model";
import useCoordManager from "../../service/CoordManager";
import useEventSubscriber from "../../service/EventManager";
import useGameEngine from "../../service/GameEngine";
import { useGameManager } from "../../service/GameManager";
import "./score.css";

export default function SlotScorePanel() {
  const [active, setActive] = useState(false);
  const { event, createEvent } = useEventSubscriber(["gameStart", "cardReleased", "gameOver"], []);
  const gameEngine = useGameEngine();
  const { viewport, cardXY, seatCoords } = useCoordManager();
  const { cards, seats } = useGameManager();
  useEffect(() => {
    if (event?.name === "gameStart") setActive(true);
    else if (event?.name === "gameOver") setActive(false);
  }, [event]);
  const top = (seatNo: number, slot: number): number => {
    const seatCoord = seatCoords.find((s: any) => s.no === seatNo);
    const seat = seats.find((s: SeatModel) => s.no === seatNo);
    if (seat?.currentSlot === slot) return seatCoord["y"] + cardXY["height"] + 25;
    else return seatCoord ? seatCoord["y"] - cardXY["height"] : 0;
  };

  const left = (seatNo: number, slot: number): number => {
    const seatCoord = seatCoords.find((s: any) => s.no === seatNo);
    const seat = seats.find((s: SeatModel) => s.no === seatNo);
    if (seat?.currentSlot === slot)
      return seatCoord ? seatCoord["x"] - seatCoord["dx"] * cardXY["width"] + cardXY["width"] / 2 : 0;
    else {
      const slots = seat?.slots.filter((s) => s.id !== seat.currentSlot);
      if (slots) {
        let index = slots?.map((s) => s.id).findIndex((s) => s === slot);
        if (index >= 0) {
          const l = seatCoord["x"] + (0.5 + index - slots.length / 2) * cardXY["width"] * 0.8;
          return l;
        }
      }
      return 0;
    }
  };
  const score = (seat: SeatModel, slotId: number): string => {
    let v: string = "";
    let s: number[];
    const slot = seat.slots.find((s) => s.id === slotId);
    if (slot) {
      const scards = cards.filter((c) => slot.cards.includes(c.no));
      s = gameEngine.getHandScore(scards);

      if (s.length === 0) {
        v = "Bust";
      } else if (s.includes(21)) {
        v = "BlackJack";
      } else {
        v = v + s[0];
        for (let i = 1; i < s.length; i++) {
          v = v + "/" + s[i];
        }
      }
    }
    return v;
  };
  return (
    <>
      {active &&
        seats.map((seat) =>
          seat.slots.map((slot) => (
            <motion.div
              key={seat.no + "-" + slot.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: active && slot.cards.length > 0 ? 1 : 0 }}
              transition={{ duration: 3, type: "spring" }}
              style={{
                position: "absolute",
                top: top(seat.no, slot.id),
                left: left(seat.no, slot.id),
              }}
            >
              {slot.id === seat.currentSlot ? (
                <div className="tooltip">
                  <span className="tooltiptext">{score(seat, slot.id)}</span>
                </div>
              ) : (
                <div className="tooltip">
                  <span className="stooltiptext">{score(seat, slot.id)}</span>
                </div>
              )}
            </motion.div>
          ))
        )}
    </>
  );
}
