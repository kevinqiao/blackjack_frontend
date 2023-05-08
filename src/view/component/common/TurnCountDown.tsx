import { motion, useAnimation, useSpring } from "framer-motion";
import { useCallback, useEffect, useMemo, useState } from "react";
import useCoordManager from "../../../service/CoordManager";
import useEventSubscriber from "../../../service/EventManager";
import { useGameManager } from "../../../service/GameManager";
import useInterval from "../../../util/useInterval";

export default function TurnCountDown() {
  const { seatOffset } = useGameManager();
  const { currentTurn, seats } = useGameManager();
  const { cardXY, seatCoords } = useCoordManager();
  const [frequency, setFrequency] = useState(0);
  const controls = useAnimation();
  useEffect(()=>{
    if(currentTurn?.seat===3)
        setFrequency(0)
    else if(currentTurn?.round===1)
       setFrequency(1000)
  },[currentTurn])

  const updateProgress = useCallback(() => {
    if(currentTurn &&(currentTurn.expireTime - Date.now())<=15000){
      const timeRemaining = (currentTurn.expireTime - Date.now())/15000;
      controls.start({ strokeDashoffset: timeRemaining<0?0:timeRemaining });
      if(currentTurn.expireTime - Date.now()<-1500)
       setFrequency(0)
    } 
  },[currentTurn])
  useInterval(updateProgress,frequency)
  const pwidth = useMemo(() => {
    if (currentTurn && seatCoords && seats && cardXY) {
      let seatNo = currentTurn.seat;
      if (seatNo < 3) {
        seatNo = seatOffset + seatNo;
        if (seatNo > 2) seatNo = seatNo - 3;
      }
      const seat = seats.find((s) => s.no === currentTurn.seat);
      const currentSlot = seat?.slots.find((s) => s.id === seat.currentSlot);
      if (currentSlot?.cards?.length) {
        const seatCoord = seatCoords.find((s: any) => s.no === seatNo);
        const dif = (currentSlot.cards.length - 1) * seatCoord["dx"] * cardXY["width"];
        const w = cardXY["width"] + 8 + (currentSlot.cards.length < 4 ? dif * 2 : dif);
        return w;
      }
    }
    return 0;
  }, [currentTurn, seatCoords, seats, cardXY]);
  const pheight = useMemo(() => {
    return cardXY ? cardXY["height"] + 10 : 0;
  }, [cardXY]);
  const ptop = useMemo(() => {
    if (currentTurn && seatCoords && cardXY) {
      let seatNo = currentTurn.seat;
      if (seatNo < 3) {
        seatNo = seatOffset + seatNo;
        if (seatNo > 2) seatNo = seatNo - 3;
      }
      const seatCoord = seatCoords.find((s: any) => s.no === seatNo);
      if (seatCoord) return seatCoord["y"] - 6;
    }
    return 0;
  }, [currentTurn, seatCoords, cardXY]);

  const pleft = useMemo(() => {
    if (currentTurn && seatCoords && seats && cardXY) {
      const seat = seats.find((s) => s.no === currentTurn.seat);
      const currentSlot = seat?.slots.find((s) => s.id === seat.currentSlot);
      if (currentSlot?.cards?.length) {
        let seatNo = currentTurn.seat;
        if (seatNo < 3) {
          seatNo = seatOffset + seatNo;
          if (seatNo > 2) seatNo = seatNo - 3;
        }
        const seatCoord = seatCoords.find((s: any) => s.no === seatNo);
        if (seatCoord) {
          const dif = ((currentSlot.cards.length - 1) * seatCoord["dx"] * cardXY["width"]) / 2;
          const x = seatCoord["x"] - 6 - (currentSlot.cards.length < 4 ? dif * 2 : dif) - cardXY["width"] / 2;
          return x;
        }
      }
    }
    return 0;
  }, [currentTurn, seatCoords, seats, cardXY]);

 
  return (
    <>
      {currentTurn&& frequency>0 ? (
        <div key={currentTurn.id+""} style={{ position: "absolute", zIndex: 8000, top: ptop, left: pleft }}>
          <svg
            width={pwidth}
            height={pheight}
            style={{
              border: "2px solid grey",
              borderRadius: 5,
            }}
          >
           <motion.path
                // d={`M${cx},${cy} a${r},${r} 0 0,1 0,${2*r} a${r},${r} 0 0,1 0,${0-r*2}`}
                d={`M0,0 H${pwidth} V${pheight} H0 Z`}
                pathLength="1"
                fill="none"
                stroke="#eee"
                strokeWidth="8"
                strokeDasharray="1"
                strokeLinecap="round"
                strokeLinejoin={"round"}
              />
              <motion.path
                // d={`M${cx},${cy} a${r},${r} 0 0,1 0,${2*r} a${r},${r} 0 0,1 0,${0-r*2}`}
                d={`M0,0 H${pwidth} V${pheight} H0 Z`}
                pathLength="1"
                fill="none"
                stroke="black"
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin={"round"}
                strokeDasharray="1"
                initial={{ strokeDashoffset: 1 }}
                animate={controls}
                transition={{ duration: 1, ease: 'linear' }}
              />
          </svg>
        </div>
      ) : null}
    </>
  );
}
