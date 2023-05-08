
import { ActionTurn } from "../model/types/ActionTurn";
import useTurnDao from "../respository/TurnDao";
import useEventService from "./EventService";




const useTurnService = () => {
    const {findAll,updateGameTurn,removeGameTurn} = useTurnDao();
    // const { createEvent } = useEventSubscriber([], []);
    const eventService = useEventService();
    const newActionTurn = (turn:ActionTurn,delay:number) => {
  
        if(turn?.expireTime){
            const timeout =turn.expireTime-Date.now()-delay;
            if(timeout>0)
                updateGameTurn(turn)
            else
                stopCount(turn.gameId)
            eventService.sendEvent({ name: "createNewTurn", topic: "model", data: {...turn,expireTime:timeout}, delay: delay})
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
