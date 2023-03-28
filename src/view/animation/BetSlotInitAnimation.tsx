import { AnimationControls } from "framer-motion";
import { useCallback, useEffect } from "react";
import useCoordManager from "../../service/CoordManager";
import { useGameManager } from "../../service/GameManager";

export default function useBetSlotInitAnimation(controls: AnimationControls, cardControls: AnimationControls) {
  const { gameId, cards, seats } = useGameManager();
  const { viewport, cardXY, seatCoords } = useCoordManager();

  const handleInit = useCallback(() => {
    controls.start((i) => {
      for (const seat of seats) {
        if (seat?.slots?.length > 0) {
          const slots = seat.slots.filter((s) => s.id !== seat.currentSlot);
          for (let j = 0; j < slots.length; j++) {
            if (slots[j].cards.includes(i)) {
              const seatCoord = seatCoords.find(
                (s: { no: number; direction: number; x: number; y: number }) => s.no === seat.no
              );
              let x = seatCoord["x"] - viewport["width"] + (0.5 + j - slots.length / 2) * cardXY["width"] * 0.8;
              let y = seatCoord["y"] - cardXY["height"] - 15;
              let r = [60, 0, 0, 0];
              const index = slots[j].cards.findIndex((c) => c === i);
              return {
                opacity: [0, 0, 1, 1, 1],
                x: [0, x, x, x, x],
                y: [0, y, y, y, y],
                rotate: r,
                zIndex: [0, index + 1, index + 1, index + 1],
                transition: {
                  duration: 0.2,
                  default: { ease: "linear" },
                  times: [0, 0.4, 0.5, 0.8, 1],
                },
              };
            }
          }
        }
      }

      return {};
    });
    return cardControls.start((id) => {
      const ids = id.split("-");
      if (Number(+ids[0]) <= 0) return {};
      for (const seat of seats) {
        if (seat.slots.length > 0 && seat.currentSlot > 0) {
          const slot = seat.slots.find((s) => s.id === seat.currentSlot);

          if (slot?.cards.includes(+ids[0])) {
            const rotate = `rotateY(${Number(ids[1]) === 1 ? "180deg" : "360deg"})`;
            return {
              opacity: [0, 0, 0, 0, 1 - Number(ids[1])],
              transform: [rotate, rotate, rotate, rotate, rotate],
              transition: {
                duration: 0.5,
                default: { ease: "linear" },
                times: [0, 0.4, 0.5, 0.8, 1],
              },
            };
          }
        }
      }
      return {};
    });
  }, [controls, cardControls, seatCoords, seats]);
  useEffect(() => {
    if (cardControls && seatCoords && gameId > 0) {
      setTimeout(() => handleInit().then(() => console.log("completed init")), 100);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cardControls, controls, seatCoords, gameId]);

  return gameId;
}
