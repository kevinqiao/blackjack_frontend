import { motion, useAnimationControls } from "framer-motion";
import { useEffect } from "react";
import { SeatBetSlot, SeatModel } from "../../model";
import useCoordManager from "../../service/CoordManager";
import useEventSubscriber from "../../service/EventManager";
import useGameEngine from "../../service/GameEngine";
import { useGameManager } from "../../service/GameManager";
import "./score.css";

export default function SlotScorePanel() {
  const { event, createEvent } = useEventSubscriber(["slotSplitted"], []);
  const gameEngine = useGameEngine();
  const { viewport, cardXY, seatCoords } = useCoordManager();
  const { cards, seats } = useGameManager();
  const controls = useAnimationControls();
  useEffect(() => {
    const seatNo = event?.data.seat;
    const slotId = event?.data.slot;
    if (seatNo >= 0 && slotId > 0)
      controls.start((o) => {
        if (o.seat === seatNo && o.slot === slotId)
          return {
            opacity: [0, 0, 1],
            transition: {
              duration: 4,
              default: { ease: "linear" },
              times: [0, 0.8, 1],
            },
          };
        else return {};
      });
  }, [event]);
  const top = (seatNo: number, slot: number): number => {
    const seatCoord = seatCoords.find((s: any) => s.no === seatNo);
    const seat = seats.find((s: SeatModel) => s.no === seatNo);
    if (seat?.currentSlot === slot) return seatCoord["y"] + cardXY["height"] + 25;
    else {
      const t = seatCoord ? seatCoord["y"] - cardXY["height"] : 0;
      return t;
    }
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
  const score = (seat: SeatModel, slot: SeatBetSlot): string => {
    let v: string = "";
    let s: number[];
    if (slot?.cards) {
      const slotCards = cards.filter((c) => slot.cards.includes(c.no));
      s = gameEngine.getHandScore(slotCards);
      if (s.length === 0) {
        v = "Bust";
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
      {viewport &&
        seats.map((seat) =>
          seat.slots.map((slot) => (
            <motion.div
              key={seat.no + "-" + slot.id}
              custom={{ seat: seat.no, slot: slot.id }}
              initial={{ opacity: slot.id === seat.currentSlot ? 1 : 0 }}
              animate={controls}
              style={{
                position: "absolute",
                top: top(seat.no, slot.id),
                left: left(seat.no, slot.id),
              }}
            >
              {slot.id === seat.currentSlot ? (
                <div className="tooltip">
                  <span className="tooltiptext">{score(seat, slot)}</span>
                </div>
              ) : (
                <div className="tooltip">
                  <span className="stooltiptext">{score(seat, slot)}</span>
                </div>
              )}
            </motion.div>
          ))
        )}
    </>
  );
}
