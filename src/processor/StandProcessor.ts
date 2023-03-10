import { useEffect } from "react";
import { SeatModel } from "../model";
import ActionType from "../model/types/ActionType";
import { GameModel } from "../model/types/Game";
import useEventSubscriber from "../service/EventManager";
import useGameEngine from "../service/GameEngine";


const useStandProcessor = () => {
    const { createEvent } = useEventSubscriber([], []);
    const gameEngine = useGameEngine();
    const process = (gameObj: GameModel) => {

        const seat = gameObj.seats.find((s: SeatModel) => s.no === gameObj.currentTurn.seat);
        if (!seat)
            return null;
        const nextSeatNo: number = seat.no + 1 >= gameObj.seats.length - 1 ? seat.no + 1 - (gameObj.seats.length - 1) : seat.no + 1;
        const nextSeat = gameObj.seats.find((s: SeatModel) => s.no === nextSeatNo);
        if (nextSeat?.status === 0) {
            Object.assign(gameObj.currentTurn, { id: Date.now(), expireTime: Date.now() + 15000, act: ActionType.ALL, seat: nextSeatNo })
            createEvent({ name: "createNewTurn", topic: "model", data: Object.assign({}, gameObj.currentTurn, { expireTime: 1500 }), delay: 10 })
        } else {
            const dealerNo = gameObj.seats.length - 1;
            Object.assign(gameObj.currentTurn, { id: Date.now(), expireTime: 0, act: ActionType.ALL, seat: dealerNo })
            createEvent({ name: "createNewTurn", topic: "model", data: Object.assign({}, gameObj.currentTurn, { expireTime: 1500 }), delay: 10 });
            for (let i = 0; i < 4; i++) {
                let card = gameEngine.releaseCard(gameObj);
                createEvent({ name: "releaseCard", topic: "model", data: { seat: dealerNo, no: card?.no }, delay: (i + 1) * 300 })
            }
        }
    }

    useEffect(() => {

    }, [])
    return { process }

}
export default useStandProcessor
