import { AnimationControls } from "framer-motion";
import { useCallback, useEffect } from "react";
import useCoordManager from "../../service/CoordManager";
import { useGameManager } from "../../service/GameManager";
import { useTournamentManager } from "../../service/TournamentManager";

export default function useGameInitAnimation(controls: AnimationControls, cardControls: AnimationControls) {
  const {seatOffset} = useTournamentManager();
  const { gameId,  cards, seats } = useGameManager();
  const { viewport, cardXY, seatCoords } = useCoordManager();

  const handleInit = useCallback(() => {
    controls.start((o) => { 
  

      if (o.seat >= 0 && o.slot > 0) {
        const seat = seats.find((s) => s.no === o.seat);
  
        if (seat) {
          let seatNo = o.seat;
          if (seatNo < 3) {
            seatNo = seatOffset + seatNo;
            if (seatNo > 2) seatNo = seatNo - 3;
          }
          const seatCoord = seatCoords.find((s: any) => s.no === seatNo);
          const currentSlot = seat.slots.find((s) => s.id === seat.currentSlot);
          const index = currentSlot?.cards.findIndex((c) => c === o.no);
          if (currentSlot?.cards && typeof index != "undefined" && index >= 0) {
            // const index = currentSlot.cards.findIndex((c) => c === o.no);
            const dif = cardXY["width"] * (currentSlot.cards.length < 4 ? seatCoord["dx"] * 2 : seatCoord["dx"]);
            const x = dif * (index - (currentSlot.cards.length - 1) / 2) - (viewport["width"] - seatCoord["x"]);
            const y = seatCoord["y"];
            const r = [60, 60, 0, 0];
            return {
              opacity: [0, 0, 0, 1, 1],
              x: [0, x, x, x, x],
              y: [0, y, y, y, y],
              rotate: r,
              zIndex: [0, index + 1, index + 1, index + 1],
              transition: {
                duration: 0.5,
                default: { ease: "linear" },
                times: [0, 0.4, 0.5, 0.8, 1],
              },
            };
          } else if (seat.slots.length > 1) {
            const slots = seat.slots.filter((s) => s.id !== seat.currentSlot);
            const slotIndex = slots.findIndex((s) => s.id === o.slot);
            // console.log(o);
            if (slotIndex >= 0 && slots[slotIndex]?.cards?.includes(o.no)) {
              let x =
                seatCoord["x"] -
                viewport["width"] +
                (0.5 + slotIndex - slots.length / 2) * (cardXY["width"] + 95) * 0.6;
              let y = seatCoord["y"] - (cardXY["height"] + 65) * 0.8;
              let r = [60, 0, 0, 0];
              const index = slots[slotIndex].cards.findIndex((c) => c === o.no);
              return {
                opacity: [0, 0, 1, 1, 1],
                x: [0, x, x, x, x],
                y: [0, y, y, y, y],
                scale: [0.6, 0.6, 0.6, 0.6, 0.6],
                rotate: r,
                zIndex: [0, index + 1, index + 1, index + 1],
                transition: {
                  duration: 0.5,
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

    cardControls.start((o) => {
      if (o.seat >= 0) {
        const rotate = `rotateY(${o.face === 1 ? "180deg" : "360deg"})`;
        return {
          opacity: [0, 0, 0, 0, 1 - o.face],
          transform: [rotate, rotate, rotate, rotate, rotate],
          transition: {
            duration: 0.5,
            default: { ease: "linear" },
            times: [0, 0.4, 0.5, 0.8, 1],
          },
        };
      }
      return {};
    });
  }, [controls, cardControls, seatCoords, seats]);
  useEffect(() => {
  
    if (cardControls && seatCoords && gameId > 0) {
      setTimeout(() => handleInit(), 100);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cardControls, controls, seatCoords, gameId]);
}
