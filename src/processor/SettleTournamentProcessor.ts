import { useEffect } from "react";
import { TableModel, TournamentModel } from "../model";
import { GameModel } from "../model/types/Game";
import { SlotBattleResult } from "../model/types/SlotBattleResult";
import useTableDao from "../respository/TableDao";
import { useTournamentDao } from "../respository/TournamentDao";
import useUserDao from "../respository/UserDao";
import useEventSubscriber, { EventModel } from "../service/EventManager";
import useEventService from "../service/EventService";
import useGameEngine from "../service/GameEngine";


const useSettleTournamentProcessor = () => {
    const eventService = useEventService();
    const userDao = useUserDao();
    const process = (tournament: TournamentModel,table:TableModel) => {
        console.log("tournament round over")
        eventService.sendEvent({ name: "finishTournament", topic: "model", data: {id:table.tournamentId}, delay: 10 })
        for(let seat of table.seats){
            if(seat.no<3){
                const user = userDao.findUserWithLock(seat.uid);
                user.tableId=0;
                userDao.updateUserWithLock(user,user.ver);
            }
        }
   }
    useEffect(() => {

    }, [])
    return { process }

}
export default useSettleTournamentProcessor
