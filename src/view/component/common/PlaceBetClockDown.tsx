import { motion, useAnimation, useSpring } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import useCoordManager from "../../../service/CoordManager";
import useEventSubscriber from "../../../service/EventManager";
import { useGameManager } from "../../../service/GameManager";
import useInterval from "../../../util/useInterval";


export default function PlaceBetClockDown() {

  const { gameId, currentTurn } = useGameManager();
  const { viewport } = useCoordManager();
  const {event} = useEventSubscriber(["startPlay"],[])
  const [frequency, setFrequency] = useState(0);
  const controls = useAnimation();
  useEffect(()=>{
    if(currentTurn?.round===0)
       setFrequency(1000)
  },[currentTurn])
  useEffect(()=>{
     if(event?.name==="startPlay"){
      console.log("start play")
      setFrequency(0)
     }
  },[event])

  const ptop = viewport ? viewport["height"] * 0.3 : 0;
  const pleft = viewport ? viewport["width"] * 0.5 - 90 : 0;
  const updateProgress = useCallback(() => {
    if(currentTurn){
      const timeRemaining = (currentTurn.expireTime - Date.now())/15000;
      controls.start({ strokeDashoffset: timeRemaining<0?0:timeRemaining });
      if(currentTurn.expireTime - Date.now()<-1500)
       setFrequency(0)
    } 
  },[currentTurn])
  useInterval(updateProgress,frequency)
  const w=100;
  const h=50;
  const r = 60;
  return (
    <>
       {gameId > 0&&currentTurn?.round===0&&frequency>0? ( 
        <div style={{ position: "absolute", zIndex: 8000, top: ptop, left: pleft }} >
          <svg width="200" height="200"  xmlns="http://www.w3.org/2000/svg">
              <motion.path
                // d={`M${cx},${cy} a${r},${r} 0 0,1 0,${2*r} a${r},${r} 0 0,1 0,${0-r*2}`}
                d="M20,20 H160 V100 H20 Z"
                pathLength="1"
                fill="blue"
                stroke="#eee"
                strokeWidth="6"
                strokeDasharray="1"
                strokeLinecap="round"
                strokeLinejoin={"round"}
              />
              <motion.path
                // d={`M${cx},${cy} a${r},${r} 0 0,1 0,${2*r} a${r},${r} 0 0,1 0,${0-r*2}`}
                d="M20,20 H160 V100 H20 Z"
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
              <text textAnchor="middle" x="80" y="70" fill="white">
                Place Your bet
              </text>
          </svg>
        </div>
      ) : null}
    </>
  );
}
