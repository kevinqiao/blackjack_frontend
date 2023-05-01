import { useEffect } from "react";
import { SeatModel } from "../model";
import ActionType from "../model/types/ActionType";
import { GameModel } from "../model/types/Game";
import useTableDao from "../respository/TableDao";
import useEventSubscriber from "../service/EventManager";
import useEventService from "../service/EventService";


const useNotActProcessor = () => {
    // const { createEvent } = useEventSubscriber([], []);
    const eventService = useEventService();
    const tableDao  = useTableDao();
    const process = (game:GameModel) => {
        const table = tableDao.findTableWithLock(game.tableId);
        if(!table)
            return;
        if(game.currentTurn.round===0){
            const unactedSeats = game.seats.filter((s)=>s.no<3&&(!s.bet||s.bet===0));
            if(unactedSeats?.length>0){
                     for(let useat of unactedSeats){

                        const seat = table.seats.find((s) => s.no === useat.no);
                        if(seat){
                            console.log(JSON.parse(JSON.stringify(seat)))
                            if(seat.missActs===1){
                                 table.seats = table.seats.filter((s)=>s.no!==seat.no)
                                eventService.sendEvent({
                                    name: "removeSeat", topic: "model", data: { tableId:table.id,seatNo: seat.no }, delay: 10})  
                            }else
                            seat.missActs=seat.missActs?seat.missActs+1:1   
                        }
                     }  
                     tableDao.updateTableWithLock(table, table.ver) 
               
            }
            if(table.seats.length===0)
                eventService.sendEvent({ name: "clearGame", topic: "model", data: {gameId:game.gameId}, delay: 100 });
            
        }else if(game.currentTurn.round===1){
            const seat = table.seats.find((s) => s.no === game.currentTurn.seat);
            if(seat){
                console.log(JSON.parse(JSON.stringify(seat)))
                if(seat.missActs===1){
                    table.seats = table.seats.filter((s)=>s.no!==seat.no)
                    eventService.sendEvent({
                        name: "removeSeat", topic: "model", data: { tableId:table.id,seatNo: seat.no }, delay: 10})  
                }else
                seat.missActs=seat.missActs?seat.missActs+1:1   
                tableDao.updateTableWithLock(table, table.ver) 
            }
         }  
       
    }

    useEffect(() => {

    }, [])
    return { process }

}
export default useNotActProcessor


