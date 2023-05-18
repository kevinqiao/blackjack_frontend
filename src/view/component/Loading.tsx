import { animate, motion, useMotionValue } from "framer-motion";
import { useEffect } from "react";
import useCoordManager from "../../service/CoordManager";
import useEventSubscriber from "../../service/EventManager";
import { useTournamentManager } from "../../service/TournamentManager";

function Loading() {
  const { viewport } = useCoordManager();
  const { table,tournament } = useTournamentManager();
  const {event} = useEventSubscriber(['openLoading'],[])
  const y = useMotionValue(0)

  useEffect(() => {
    if(viewport&&event?.name==="openLoading"){
      console.log('animating...')
      animate(y, 0-viewport['height'], { duration:0.5 })
    }
  }, [viewport,event]);
  const close=()=>[
    animate(y, 0, { duration:0.5 })
  ]
  return (
    <>

        {viewport?<motion.div
          style={{
            y,
            position: "fixed",
            top:viewport['height'],
            left:0,
            zIndex: 9000,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width:viewport['width'],
            height:  viewport["height"],
            backgroundColor: "grey",
            color: "white",
            fontSize: 30,
          }}
          onClick={close}
        >
      Finding opponent to Match
        </motion.div>:null}
  
    </>
  );
}

export default Loading;
