import { AnimationControls } from "framer-motion";
import { useCallback, useEffect } from "react";
import useCoordManager from "../../service/CoordManager";
import useEventSubscriber from "../../service/EventManager";
import { useGameManager } from "../../service/GameManager";

export default function useCardReleaseAnimation(controls: AnimationControls, cardControls: AnimationControls) {
  const { gameId, seatOffset, seats } = useGameManager();
  const { viewport, cardXY, seatCoords } = useCoordManager();
  const { event } = useEventSubscriber(["cardReleased"], []);

  const handleHit = useCallback(
    (seatNo: number, cardNo: number) => {
      const seat = seats.find((s) => s.no === seatNo);
      if (!seat) return {};
      if (seatNo < 3) {
        seatNo = seatOffset + seatNo;
        if (seatNo > 2) seatNo = seatNo - 3;
      }
      const seatCoord = seatCoords.find(
        (s: { no: number; direction: number; x: number; y: number }) => s.no === seatNo
      );

      controls.start((card) => {
        const currentSlot = seat.slots.find((s) => s.id === seat.currentSlot);
        if (currentSlot?.cards.includes(card["no"])) {
          const index = currentSlot.cards.findIndex((c) => c === card["no"]);
          const dif = cardXY["width"] * (currentSlot.cards.length < 4 ? seatCoord["dx"] * 2 : seatCoord["dx"]);
          let x = dif * (index - (currentSlot.cards.length - 1) / 2) - (viewport["width"] - seatCoord["x"]);
          let y = seatCoord["y"];
          let r = [60, 60, 0, 0];
          // const { x, y, zIndex, rotate, times } = getTargetPos(seatNo, i);
          if (card["no"] === cardNo) {
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
          cardControls.start((o) => {
            if (cardNo === o.cardNo) {
              const rotate = `rotateY(${Number(o.face) === 1 ? "180deg" : "360deg"})`;
              return {
                opacity: 1 - Number(o.face),
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
    if (event?.name === "cardReleased") {
      handleHit(event.data.seatNo, event.data.cardNo);
    }
  }, [event]);
  return gameId;
}
