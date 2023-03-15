import { AnimationControls } from "framer-motion";
import { useCallback, useEffect } from "react";
import { SeatModel } from "../../model";
import useCoordManager from "../../service/CoordManager";
import useEventSubscriber from "../../service/EventManager";
import { useGameManager } from "../../service/GameManager";

export default function useCardReleaseAnimation(controls: AnimationControls, cardControls: AnimationControls) {
  const { gameId, seats } = useGameManager();
  const { viewport, cardXY, seatCoords } = useCoordManager();
  const { event } = useEventSubscriber(["hitCreated"], []);


  const handleHit = useCallback(
    (seatNo: number, cardNo: number) => {
      const seatCoord = seatCoords.find(
        (s: { no: number; direction: number; x: number; y: number }) => s.no === seatNo
      );
      const seat = seats.find((s) => s.no === seatNo);
      if (!seat) return {};
      controls.start((i) => {
        const currentSlot = seat.slots.find((s) => s.id === seat.currentSlot);
        if (currentSlot?.cards.includes(i)) {
          const index = currentSlot.cards.findIndex((c) => c === i);
          const dif = cardXY["width"] * (currentSlot.cards.length < 4 ? seatCoord["dx"] * 2 : seatCoord["dx"]);
          let x = dif * (index - (currentSlot.cards.length - 1) / 2) - (viewport["width"] - seatCoord["x"]);
          let y = seatCoord["y"];
          let r = [60, 60, 0, 0];
          // const { x, y, zIndex, rotate, times } = getTargetPos(seatNo, i);
          if (i === cardNo) {
            // console.log("seatNo:" + seatNo + " cardNo:" + cardNo + " slotId:" + slot.id);
            return {
              x: x,
              y: y,
              rotate: r,
              zIndex: [0, index + 1, index + 1, index + 1],
              transition: {
                duration: 1,
                default: { ease: "linear" },
                times: [0, 0.3, 0.7, 1],
              },
            };
          } else
            return {
              opacity: 1,
              zIndex: index + 1,
              x: x,
              y: y,
              scale: 1,
              transition: {
                duration: 1,
                default: { ease: "linear" },
              },
            };
        }
        return {};
      });

      setTimeout(
        () =>
          cardControls.start((id) => {
            const ids = id.split("-");
            if (cardNo === Number(ids[0])) {
              const rotate = `rotateY(${Number(ids[1]) === 1 ? "180deg" : "360deg"})`;
              return {
                opacity: 1 - Number(ids[1]),
                transform: rotate,
                transition: {
                  type: "spring",
                  duration: 1,
                },
              };
            } else return {};
          }),
        400
      );
    },
    [controls, cardControls, seats]
  );
  useEffect(() => {
    if (event?.name === "hitCreated") {
      // console.log("hitCreated at seat:" + event.data.seatNo + " card no:" + event.data.cardNo);
      // console.log("hit created seat:" + event.data.seatNo + " cardNo:" + event.data.cardNo);
      handleHit(event.data.seatNo, event.data.cardNo);
    }
  }, [event]);
  return gameId;
}
