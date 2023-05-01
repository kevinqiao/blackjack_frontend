import { useEffect } from "react";
import { delay } from "rxjs";
import { ActionTurn } from "../model/types/ActionTurn";
import useTurnDao from "../respository/TurnDao";
import useEventSubscriber from "./EventManager";
import useEventService from "./EventService";




const useTurnService = () => {
    const {findAll,updateGameTurn,removeGameTurn} = useTurnDao();
    // const { createEvent } = useEventSubscriber([], []);
    const eventService = useEventService();
    const newActionTurn = (turn:ActionTurn,delay:number) => {
  
        if(turn?.expireTime){
            console.log(turn)
            updateGameTurn(turn)
            eventService.sendEvent({ name: "createNewTurn", topic: "model", data: {...turn,expireTime:turn.expireTime-Date.now()-delay}, delay: delay})
        }
    }
    const findAllPast = (): ActionTurn[] | null => {
       const all = findAll();
  
       if(all?.length>0){
         return  all.filter((t:ActionTurn)=>t.expireTime<=Date.now())
       }
       return null;
    }
    const stopCount=(gameId:number)=>{
        removeGameTurn(gameId)
    }

   return {newActionTurn,findAllPast,stopCount}
}
export default useTurnService
