import { AnimationControls } from "framer-motion";
import { useCallback, useEffect } from "react";
import { SeatModel } from "../../model";
import useCoordManager from "../../service/CoordManager";
import { useGameManager } from "../../service/GameManager";

export default function useCardInitAnimation(controls: AnimationControls, cardControls: AnimationControls) {
  const { gameId, seats } = useGameManager();
  const { viewport, cardXY, seatCoords } = useCoordManager();

  const getTargetPos = useCallback(
    (seatNo: number, cardNo: number): any => {
      const pos: { x: any; y: any; zIndex: any; rotate: any; times: any } = {
        x: 0,
        y: 0,
        zIndex: 0,
        rotate: 0,
        times: [],
      };
      if (seatCoords && seats) {
        const seatCoord = seatCoords.find(
          (s: { no: number; direction: number; x: number; y: number }) => s.no === seatNo
        );
        const seat = seats.find((s: SeatModel) => s.no === seatNo);
        if (seatCoord && seat?.slots) {
          const slot = seat.slots.find((s) => s.id === seat.currentSlot);
          if (slot?.cards) {
            const index = slot.cards.findIndex((c) => c === cardNo);
            let x = 0;
            let y = 0;
            let dx = 0;
            let dy = 0;
            let r: any[] = [];
            if (seatCoord.direction === 2) {
              //left
              const dif = cardXY["height"] * 0.2;
              y = seatCoord["y"] - dif * (index - (slot.cards.length - 1) / 2) - 150;
              x = -cardXY["width"];
              r = [60, 60, 90, 90];
              dy = 80;
            } else if (seatCoord.direction === 1) {
              //left
              const dif = cardXY["height"] * 0.2;
              y = seatCoord["y"] - dif * ((slot.cards.length - 1) / 2 - index) - 150;
              x = cardXY["width"] - viewport["width"];
              r = [60, 60, 90, 90];
              dy = 80;
            } else if (seatCoord.direction === 0) {
              //bottom
              const dif = cardXY["width"] * 0.3;
              x = dif * (index - (slot.cards.length - 1) / 2) - seatCoord["x"] + cardXY["width"] / 2;
              y = seatCoord["y"];
              r = [60, 60, 0, 0];
              dx = 80;
            }
            pos["rotate"] = r;
            pos["x"] = [0, x, x, x, x];
            pos["y"] = [0, y, y, y, y];
            pos["zIndex"] = [0, index + 1, index + 1, index + 1];
            pos["times"] = [0, 0.4, 0.5, 0.8, 1];
            return pos;
          }
        }
      }
      return {};
    },
    [cardXY, seatCoords, viewport, seats]
  );

  const handleInit = useCallback(() => {
    console.log(seats);
    controls.start((i) => {
      for (const seat of seats) {
        if (seat.slots.length > 0 && seat.currentSlot > 0) {
          const slot = seat.slots.find((s) => s.id === seat.currentSlot);
          if (slot) {
            const index = slot["cards"].findIndex((c) => c === i);
            if (index >= 0) {
              const { x, y, zIndex, rotate, times } = getTargetPos(seat["no"], i);
              return {
                x: x,
                y: y,
                rotate: rotate,
                zIndex: zIndex,
                transition: {
                  duration: 0.2,
                  default: { ease: "linear" },
                  times: times,
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
  }, [controls, cardControls, seats, seatCoords, getTargetPos]);
  useEffect(() => {
    if (cardControls && seatCoords && gameId > 0) {
      setTimeout(() => handleInit().then(() => console.log("completed init")), 100);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cardControls, controls, seatCoords, gameId]);

  return gameId;
}
