import { AnimationControls } from "framer-motion";
import { useCallback, useEffect } from "react";
import useCoordManager from "../../service/CoordManager";
import useEventSubscriber from "../../service/EventManager";
import { useGameManager } from "../../service/GameManager";

export default function useBetSlotSplitAnimation(controls: AnimationControls, cardControls: AnimationControls) {
  const { gameId, seats } = useGameManager();
  const { viewport, cardXY, seatCoords } = useCoordManager();
  const { event } = useEventSubscriber(["slotSplitted"], []);

  const handleSplit = useCallback(
    (seatNo: number) => {
      const seat = seats.find((s) => s.no === seatNo);
      controls.start((i) => {
        if (seat?.slots) {
          const slots = seat.slots.filter((s) => s.id !== seat.currentSlot);
          for (let j = 0; j < slots.length; j++) {
            if (slots[j].cards.includes(i)) {
              const seatCoord = seatCoords.find(
                (s: { no: number; direction: number; x: number; y: number }) => s.no === seatNo
              );
              let scale = 0.6;
              let x =
                seatCoord["x"] - viewport["width"] + (0.5 + j - slots.length / 2) * (cardXY["width"] + 95) * scale;
              let y = seatCoord["y"] - (cardXY["height"] + 65) * 0.8;
              return {
                x: x,
                y: y,
                scale: scale,
                transition: {
                  duration: 1,
                  default: { ease: "linear" },
                },
              };
            }
          }
        }
        return {};
      });
    },
    [controls, cardControls, seats, seatCoords]
  );
  useEffect(() => {
    if (event?.name === "slotSplitted") {
      handleSplit(event.data.seat);
    }
  }, [event, seats]);
  return gameId;
}
