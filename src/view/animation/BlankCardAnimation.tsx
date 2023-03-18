import { AnimationControls } from "framer-motion";
import { useCallback, useEffect, useMemo } from "react";
import useCoordManager from "../../service/CoordManager";
import useEventSubscriber from "../../service/EventManager";
import { useGameManager } from "../../service/GameManager";

export default function useBlankCardAnimation(
  controls: AnimationControls,
  cardControls: AnimationControls,
  blankControls: AnimationControls
) {
  const { gameId, seats } = useGameManager();
  const { viewport, cardXY, seatCoords } = useCoordManager();
  const { event } = useEventSubscriber(["blankReleased", "blankReplaced"], []);
  const seat = useMemo(() => {
    if (seats) return seats.find((s) => s.no === 3);
    else return null;
  }, [seats]);

  const seatCoord = useMemo(() => {
    if (seatCoords) return seatCoords.find((s: any) => s.no === 3);
    else return null;
  }, [seatCoords]);
  const handleInit = useCallback(() => {
    if (seat?.slots && seat.slots.length > 0 && seat.slots[0].cards.length === 1 && seatCoord) {
      const x = 50 - seatCoord["x"];
      const y = seatCoord["y"];
      const rotate = [60, 0, 0, 0, 0];
      const times = [0, 0.2, 0.4, 0.5, 0.8, 1];
      const opacity = [0, 0, 0, 0, 1];
      // const transform = [rotate, rotate, rotate, rotate, rotate];

      blankControls.start({
        opacity: opacity,
        x: [0, x, x, x, x],
        y: [0, y, y, y, y],
        rotate: rotate,
        zIndex: -5,
        transition: {
          duration: 0.2,
          default: { ease: "linear" },
          times: times,
        },
      });
    }
    return;
  }, [blankControls, seat, seatCoord, gameId]);

  const handleRelase = useCallback(() => {
    const x = -seatCoord["x"] + cardXY["width"] * 0.3;
    const y = seatCoord["y"];
    const rotate = [60, 60, 0, 0];
    const times = [0, 0.4, 0.8, 1];
    const opacity = [null, 0, 0];
    // const transform = [`rotateX("60deg")`,`rotateX("60deg")`, `rotateX("0deg")`, `rotateX("60deg")`, `rotateX("60deg")`];

    blankControls.start({
      x: [null, x + 50, x + 50, x],
      y: [null, y, y, y],
      rotate: rotate,
      zIndex: [0, -5, -5, -5],
      transition: {
        duration: 0.2,
        default: { ease: "linear" },
        times: times,
      },
    });

    return;
  }, [blankControls, seat, seatCoord]);
  const handleReplace = useCallback(
    async (cardNo) => {
      if (seat && seatCoord) {
        const x = cardXY["width"] * 0.3 - seatCoord["x"];
        const y = seatCoord["y"];
        controls.start((i) => {
          if (i === cardNo && seat.slots?.length > 0) {
            const index = seat.slots[0]["cards"].findIndex((c) => c === cardNo);
            return {
              opacity: [0, 1, 1, 1],
              x: [x, x + 30, x + 120, x],
              y: [y, y, y, y],
              rotate: [0, 0, 0, 0],
              zIndex: [null, 1 + index, 1 + index, 1 + index],
              transition: {
                default: { ease: "linear" },
                duration: 2.5,
                times: [0, 0.2, 0.7, 1],
              },
            };
          }
          return {};
        });
        blankControls.start({
          x: [null, x, x, 0],
          y: [null, y, x, 0],
          rotate: [0, 0, 0, 60],
          opacity: [1, 0, 0, 0],
          transition: {
            duration: 0.5,
            default: { ease: "linear" },
            times: [0, 0.1, 0.6, 1],
          },
        });
        setTimeout(
          () =>
            cardControls.start((id) => {
              const ids = id.split("-");
              if (Number(ids[0]) === cardNo) {
                const rotate = `rotateY(${Number(ids[1]) === 1 ? "180deg" : "360deg"})`;
                return {
                  opacity: 1 - Number(ids[1]),
                  transform: rotate,
                  transition: {
                    default: { type: "spring", mass: 0.3, stiffness: 30 },
                    duration: 2,
                  },
                };
              } else return {};
            }),
          500
        );
      }
      return;
    },
    [blankControls, seat, seatCoord]
  );
  useEffect(() => {
    if (seat && blankControls && seatCoords && gameId > 0) {
      setTimeout(() => handleInit(), 100);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blankControls, seatCoords, gameId, seat]);

  useEffect(() => {
    if (event?.name === "blankReleased") {
      handleRelase();
    } else if (event?.name === "blankReplaced") {
      handleReplace(event.data.no);
    }
  }, [event]);
  return gameId;
}
