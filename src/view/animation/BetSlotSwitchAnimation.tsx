import { AnimationControls } from "framer-motion";
import { useCallback, useEffect } from "react";
import { SeatModel } from "../../model";
import useCoordManager from "../../service/CoordManager";
import useEventSubscriber from "../../service/EventManager";
import { useGameManager } from "../../service/GameManager";

export default function useBetSlotSwitchAnimation(controls: AnimationControls, cardControls: AnimationControls) {
  const { gameId, seats } = useGameManager();
  const { viewport, cardXY, seatCoords } = useCoordManager();
  const { event } = useEventSubscriber(["betSwitched"]);

  const getTargetPos = useCallback(
    (seatNo: number, cardNo: number) => {
      const pos: { x: number; y: number; scale: number } = {
        x: 0,
        y: 0,
        scale: 1,
      };
      if (seatCoords && seats) {
        const seatCoord = seatCoords.find(
          (s: { no: number; direction: number; x: number; y: number }) => s.no === seatNo
        );
        const seat = seats.find((s: SeatModel) => s.no === seatNo);
        if (seat) {
          const slot = seat.slots.find((s) => s.id === seat.currentSlot);
          if (slot) {
            const index = slot.cards.findIndex((c) => c === cardNo);
            let x = 0;
            let y = 0;
            let scale = 1;
            if (seatCoord.direction === 2) {
              //right
              // zIndex = seat.cards.length-index;
              const dif = cardXY["height"] * 0.2;
              y = seatCoord["y"] - dif * (index - (slot.cards.length - 1) / 2) - 150;
              x = 0 - cardXY["height"] - 30;
            } else if (seatCoord.direction === 1) {
              //left
              const dif = cardXY["height"] * 0.2;
              y = seatCoord["y"] - dif * ((slot.cards.length - 1) / 2 - index) - 150;
              x = cardXY["height"] - viewport["width"] - 30;
            } else if (seatCoord.direction === 0) {
              const dif = cardXY["width"] * 0.3;
              x = dif * (index - (slot.cards.length - 1) / 2) - seatCoord["x"];
              y = seatCoord["y"];
              scale = 1;
            }
            //hit
            pos["x"] = x;
            pos["y"] = y;
            pos["scale"] = scale;
          }
        }
      }
      return pos;
    },
    [cardXY, seatCoords, seats, viewport]
  );

  const handleSwitch = useCallback(
    (seatNo: number, slot: number) => {
      controls.start((i) => {
        const seat = seats.find((s) => s.no === seatNo);
        if (seat) {
          const currentSlot = seat.slots.find((s) => s.id === slot);
          if (currentSlot?.cards?.includes(i)) {
            // const x = -600 + index * 30;
            const { x, y, scale } = getTargetPos(seatNo, i);
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
          const slots = seat.slots.filter((s) => s.id !== slot);
          for (let j = 0; j < slots.length; j++) {
            if (slots[j].cards.includes(i)) {
              const seatCoord = seatCoords.find(
                (s: { no: number; direction: number; x: number; y: number }) => s.no === seatNo
              );
              const x = 0 - seatCoord["x"] + (0.5 + j - slots.length / 2) * cardXY["width"] * 0.8;
              const y = seatCoord["y"] - cardXY["height"];
              const scale = 0.6;
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
    [controls, cardControls, seats]
  );
  useEffect(() => {
    if (event?.name === "betSwitched") {
      console.log("betswitched at seat:" + event.data.seatNo);
      handleSwitch(event.data.seatNo, event.data.slot);
    }
  }, [event]);
  return gameId;
}
