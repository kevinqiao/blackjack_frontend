import { motion, useAnimationControls } from "framer-motion";
import { useEffect, useRef } from "react";
import { SeatModel } from "../../model";
import useCoordManager from "../../service/CoordManager";
import useEventSubscriber from "../../service/EventManager";
import useGameEngine from "../../service/GameEngine";
import { useGameManager } from "../../service/GameManager";
import "./score.css";

export default function SlotScorePanel() {
  const releaseCountRef = useRef([
    { seatNo: 0, count: 0 },
    { seatNo: 1, count: 0 },
    { seatNo: 2, count: 0 },
    { seatNo: 3, count: 0 },
  ]);
  const { event, createEvent } = useEventSubscriber(["gameStart", "cardReleased", "slotSplitted", "gameOver"], []);
  const gameEngine = useGameEngine();
  const { cardXY, seatCoords } = useCoordManager();
  const { gameId, seatOffset, round, cards, seats } = useGameManager();
  const controls = useAnimationControls();
  useEffect(() => {
    const counts = releaseCountRef.current;
    counts.forEach((c) => (c.count = 0));
    controls.start((o) => {
      return {
        opacity: round > 0 ? 1 : 0,
        transition: {
          duration: 0.5,
          default: { ease: "linear" },
        },
      };
    });
  }, [gameId]);
  useEffect(() => {
    if (event?.name === "cardReleased") {
      const counts = releaseCountRef.current;
      const data = event.data;
      if (counts && data.seatNo >= 0) {
        const seatCount = counts.find((c) => c.seatNo === data.seatNo);
        if (seatCount) {
          seatCount.count++;
          if (seatCount.count === 2 || data.seatNo === 3)
            setTimeout(
              () =>
                controls.start((o) => {
                  if (o.seatNo === data.seatNo)
                    return {
                      opacity: 1,
                      transition: {
                        duration: 1,
                        default: { ease: "linear" },
                      },
                    };
                  else return {};
                }),
              500
            );
        }
      }
    } else if (event?.name === "slotSplitted") {
      const data = event.data;
      controls.start((o) => {
        if (o.seatNo === data.seat && o.slot === data.slot)
          return {
            opacity: 1,
            transition: {
              duration: 1,
              default: { ease: "linear" },
            },
          };
        else return {};
      });
    }
  }, [event]);
  const top = (seatNo: number, slot: number): number => {
    const seat = seats.find((s: SeatModel) => s.no === seatNo);
    if (seatNo < 3) {
      seatNo = seatOffset + seatNo;
      if (seatNo > 2) seatNo = seatNo - 3;
    }
    const seatCoord = seatCoords.find((s: any) => s.no === seatNo);

    if (seat?.currentSlot === slot) return seatNo === 3 ? seatCoord["y"] + cardXY["height"] + 45 : seatCoord["y"] - 10;
    else return seatCoord ? seatCoord["y"] - (cardXY["height"] + 95) * 0.6 : 0;
  };

  const left = (seatNo: number, slot: number): number => {
    const seat = seats.find((s: SeatModel) => s.no === seatNo);
    if (seatNo < 3) {
      seatNo = seatOffset + seatNo;
      if (seatNo > 2) seatNo = seatNo - 3;
    }
    const seatCoord = seatCoords.find((s: any) => s.no === seatNo);

    if (seatNo === 3) return seatCoord["x"] + cardXY["width"] * 0.15;
    if (seat?.currentSlot === slot && seatCoord)
      return seatNo === 2 ? seatCoord["x"] + cardXY["width"] : seatCoord["x"] + cardXY["width"] * 0.15;
    else {
      const slots = seat?.slots.filter((s) => s.id !== seat.currentSlot).sort((a, b) => a.id - b.id);
      if (slots) {
        let index = slots?.findIndex((s) => s.id === slot);
        if (index >= 0)
          return seatNo === 2
            ? seatCoord["x"] + (0.7 + index - slots.length / 2) * (cardXY["width"] + 95) * 0.6
            : seatCoord["x"] + (0.35 + index - slots.length / 2) * (cardXY["width"] + 95) * 0.6;
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
      {round > 0 &&
        seats.map((seat) =>
          seat.slots.map((slot) => (
            <motion.div
              key={seat.no + "-" + slot.id}
              custom={{ seatNo: seat.no, slot: slot.id }}
              initial={{ opacity: 0 }}
              animate={controls}
              transition={{ duration: 3, type: "spring" }}
              style={{
                display: "flex",
                justifyContent: "flex-start",
                position: "absolute",
                top: top(seat.no, slot.id),
                left: left(seat.no, slot.id),
              }}
            >
              {slot.id === seat.currentSlot ? (
                <div className="tooltip">
                  <span className={seat.no === 3 ? "dtooltiptext" : "tooltiptext"}>{score(seat, slot.id)}</span>
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
