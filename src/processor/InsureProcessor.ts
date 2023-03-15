import { useEffect } from "react";
import { SeatModel } from "../model";
import ActionType from "../model/types/ActionType";
import { GameModel } from "../model/types/Game";
import useEventSubscriber from "../service/EventManager";
import useGameEngine from "../service/GameEngine";


const useInsureProcessor = () => {
    const { createEvent } = useEventSubscriber([], []);
    const gameEngine = useGameEngine();
    const process = (gameObj: GameModel) => {

        const seat = gameObj.seats.find((s: SeatModel) => s.no === gameObj.currentTurn.seat);
        if (!seat)
            return null;
        seat.acted.push(ActionType.INSURE)
        Object.assign(gameObj.currentTurn, { id: Date.now(), expireTime: Date.now() + 15000, acts: gameEngine.getActs(gameObj, seat.no), seat: seat.no })
        createEvent({ name: "createNewTurn", topic: "model", data: Object.assign({}, gameObj.currentTurn, { expireTime: 1500 }), delay: 10 })
        seat.status = 1

    }

    useEffect(() => {

    }, [])
    return { process }

}
export default useInsureProcessor
