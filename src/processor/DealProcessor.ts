import { useEffect } from "react";
import { GameModel } from "../model/types/Game";
import useEventSubscriber, { EventModel } from "../service/EventManager";


const useDealProcessor = () => {
    const { createEvent } = useEventSubscriber([], []);
    const process = (game: GameModel, seatNo: number, chips: number) => {

        for (let seat of game.seats) {
            if (seat.no === 3)
                continue;
            seat.bet = chips;
            const event: EventModel = { name: "placeBet", topic: "model", data: { seatNo: seat.no, chips: chips + seat.no }, delay: 0 }
            setTimeout(() => createEvent(event), seat.no * 100)
        }
    }
    useEffect(() => {

    }, [])
    return { process }

}
export default useDealProcessor
