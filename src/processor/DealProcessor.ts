import { useEffect } from "react";
import { SeatModel } from "../model";
import { GameModel } from "../model/types/Game";
import useEventSubscriber, { EventModel } from "../service/EventManager";


const useDealProcessor = () => {
    const { createEvent } = useEventSubscriber([], []);
    const process = (game: GameModel,seatNo:number,chips:number) => {
        const seat:SeatModel|undefined= game.seats.find((s)=>s.no===seatNo);
        if(seat&&chips>0){
            console.log("deal processing at seat:"+seatNo+" with chips:"+chips)
            seat.bet=chips;
            const event: EventModel = { name: "placeBet", topic: "model", data:{seatNo:seatNo,chips:chips}, delay: 0 }
            createEvent(event)
       }
    }
    useEffect(() => {

    }, [])
    return { process }

}
export default useDealProcessor
