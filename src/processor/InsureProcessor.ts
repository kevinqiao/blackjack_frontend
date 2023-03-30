import { useEffect } from "react";
import { SeatModel } from "../model";
import ActionType from "../model/types/ActionType";
import { GameModel } from "../model/types/Game";
import useEventSubscriber from "../service/EventManager";


const useInsureProcessor = () => {
    const { createEvent } = useEventSubscriber([], []);
    const process = (gameObj: GameModel) => {

        const seat = gameObj.seats.find((s: SeatModel) => s.no === gameObj.currentTurn.seat);
        if (!seat)
            return null;
        seat.acted.push(ActionType.INSURE)
        createEvent({
            name: "insureBet", topic: "model", data: { seatNo: seat.no }, delay: 10
        })
    }

    useEffect(() => {

    }, [])
    return { process }

}
export default useInsureProcessor
