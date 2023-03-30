import { useEffect } from "react";
import { SeatBetSlot, SeatModel } from "../model";
import ActionType from "../model/types/ActionType";
import { GameModel } from "../model/types/Game";
import useEventSubscriber from "../service/EventManager";
import useGameEngine from "../service/GameEngine";
const useDoubleProcessor = () => {
    const gameEngine = useGameEngine();
    const { createEvent } = useEventSubscriber([], []);
    const process = (gameObj: GameModel) => {

        const seat = gameObj.seats.find((s: SeatModel) => s.no === gameObj.currentTurn.seat);
        if (!seat)
            return null;
        const currentSlot = seat.slots?.find((s: SeatBetSlot) => s.id === seat.currentSlot);
        if (currentSlot) {
            let card = gameEngine.releaseCard(gameObj, seat.no, currentSlot.id);
            if (card) {
                const data = { seat: seat.no, no: card.no }
                currentSlot.cards.push(card.no)
                createEvent({ name: "releaseCard", topic: "model", data, delay: 0 });
            }
            seat.acted.push(ActionType.DOUBLE)
            createEvent({
                name: "doubleBet", topic: "model", data: { seatNo: seat.no }, delay: 10
            })

            seat.status = 1;
            if (gameEngine.turnSeat(gameObj, seat)) {
                return;
            }
            gameEngine.turnDealer(gameObj);
        }
    }
    useEffect(() => {

    }, [])

    return { process }

}
export default useDoubleProcessor
