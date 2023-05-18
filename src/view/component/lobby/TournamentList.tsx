import { motion, PanInfo } from "framer-motion";
import { TournamentModel } from "../../../model";
import useCoordManager from "../../../service/CoordManager";
import { useTournamentManager } from "../../../service/TournamentManager";
import useTournamentService from "../../../service/TournamentService";
import { useNavManager } from "../../../service/NavManager";
import { useState } from "react";
import useEventSubscriber from "../../../service/EventManager";
const TournamentList = () => {

  const {menu,change}=useNavManager();
  const [height, setheight] = useState(window.innerHeight);
  const { tournaments} = useTournamentManager();
  const tournamentService = useTournamentService();
  const { createEvent } = useEventSubscriber([], [])
  const join=(t:TournamentModel)=>{
    createEvent({name:'openLoading',topic:"",delay:10})
    if(tournamentService){
        tournamentService.join(t);
    }
  }
  const handlePan = (event: MouseEvent | TouchEvent, info: PanInfo) => {
    const { offset } = info;
      if (offset.x > 0&&menu>0) {
        console.log("Panning to the right");
        change(menu-1)

      } else if(offset.x < 0&&menu<4) {
        console.log("Panning to the left");
        change(menu+1)
      }
  }

  return (
    <motion.div  style={{height:height,width:"100%",overflowY:"auto",touchAction:"none"}} onPan={handlePan}>
     <div style={{height:100}}/>
     {tournaments.map((t) => (
        <div  key={t.id}>
        <div
          style={{ display: "flex", justifyContent: "center", alignItems:"center",width: "100%"}}
        >
          <div
            style={{
              cursor: "pointer",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width:"70%",
              height: 60,
              backgroundColor: "blue",
              color: "white",
            }}
            onClick={() => join(t)}
          >
            T({t.id})[{t.type}]
          </div>
        </div>
        <div style={{height:70}}/>
        </div>
      ))}
      {tournaments.map((t) => (
        <div  key={t.id}>
        <div
          style={{ display: "flex", justifyContent: "center", alignItems:"center",width: "100%"}}
        >
          <div
            style={{
              cursor: "pointer",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width:"70%",
              height: 60,
              backgroundColor: "blue",
              color: "white",
            }}
            onClick={() => join(t)}
          >
            T({t.id})[{t.type}]
          </div>
        </div>
        <div style={{height:70}}/>
        </div>
      ))}
    </motion.div>
  );
};
export default TournamentList;
