import { AnimationControls } from "framer-motion";
import { useCallback, useEffect } from "react";
import { SeatModel } from "../../model";
import useCoordManager from "../../service/CoordManager";
import useEventSubscriber from "../../service/EventManager";
import { useGameManager } from "../../service/GameManager";


export default function useCardReleaseAnimation(controls:AnimationControls,cardControls:AnimationControls) {
  const { gameId,  seats} = useGameManager();
  const { viewport, cardXY, seatCoords } = useCoordManager();
  const { event } = useEventSubscriber(["hitCreated"]);

  
  const getTargetPos = useCallback(
    (seatNo: number, cardNo: number) => {
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
        if (seat) {
          const index = seat.cards.findIndex((c) => c === cardNo);
          let x = 0;
          let y = 0;
          let dx = 0;
          let dy = 0;
          let zIndex=index+1;
          let r: any[] = [];
          if (seatCoord.direction === 2) {
            //right
            // zIndex = seat.cards.length-index;
            const dif = cardXY["height"] * 0.2;
            y = seatCoord["y"] - dif * (index-(seat.cards.length - 1) / 2) -150;
            x = 0-cardXY["height"]-30;
            r = [60, 60, 90, 90];
            dy =0;

          } else if (seatCoord.direction === 1) {
            //left
            const dif = cardXY["height"] * 0.2;
            y = seatCoord["y"] - dif * ((seat.cards.length - 1) / 2 - index) - 150;
            x = cardXY["height"] - viewport["width"] - 30;
            r = [60, 60, 90, 90];
            dy = 80;
          } else if (seatCoord.direction === 0) {
            //bottom
            const dif = cardXY["width"] * 0.3;
            x = dif * (index - (seat.cards.length - 1) / 2) - seatCoord["x"];
            y = seatCoord["y"];
            r = [60, 60, 0, 0];
            dx = 80;
          }
            pos["zIndex"] = [0, zIndex, zIndex, zIndex]
            //hit
            pos["x"] = [null, x + dx, x + dx, x];
            pos["y"] = [null, y + dy, y + dy, y];
            pos["rotate"] = r;
            pos["times"] = [0, 0.3, 0.7, 1];

        }
      }
      return pos;
    },[cardXY,seatCoords,seats,viewport])
   

  const handleHit = useCallback((seatNo: number, cardNo: number) => {

    controls.start((i) => {
      const seat = seats.find((s) => s.no === seatNo);
      if (seat) {
        const index = seat["cards"].findIndex((c) => c === i);
        if (index >= 0) {
          // const x = -600 + index * 30;
          const { x, y, zIndex, rotate, times } = getTargetPos(seatNo, i);
          if (i === cardNo) {
            return {
              x: x,
              y: y,
              rotate: rotate,
              zIndex: zIndex,
              transition: {
                duration: 1,
                default: { ease: "linear" },
                times: times,
              },
            };
          } else
            return {
              opacity:1,
              x: x[x.length - 1],
              y: y[y.length - 1],
              transition: {
                duration: 1,
                default: { ease: "linear" },
              },
            };
        }
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
                duration: 1.5,
              },
            };
          } else return {};
        }),
      400
    );
  },[controls,cardControls,seats]);
  useEffect(() => {
    if (event?.name === "hitCreated") {
      handleHit(event.data.seatNo, event.data.cardNo);
    } 
  }, [event]);
  return gameId
}
