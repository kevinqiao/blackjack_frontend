import { useEffect } from "react";
import { SeatBetSlot, SeatModel } from "../model";
import { GameModel } from "../model/types/Game";
import useEventSubscriber from "../service/EventManager";
import useGameEngine from "../service/GameEngine";


const useHitProcessor = () => {
    const { createEvent } = useEventSubscriber([], []);
    const gameEngine = useGameEngine();
    const process = (gameObj: GameModel) => {

        const seat = gameObj.seats.find((s: SeatModel) => s.no === gameObj.currentTurn.seat);
        if (!seat)
            return null;
        const currentSlot = seat.slots?.find((s: SeatBetSlot) => s.id === seat.currentSlot);
        if (currentSlot) {
            let card = gameEngine.releaseCard(gameObj);
            if (card) {
                const data = { seat: seat.no, no: card.no }
                currentSlot.cards.push(card.no)
                createEvent({ name: "releaseCard", topic: "model", data, delay: 0 });
            }
        }

    }

    useEffect(() => {

    }, [])
    return { process }

}
export default useHitProcessor
