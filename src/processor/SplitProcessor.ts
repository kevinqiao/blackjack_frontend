import { useEffect } from "react";
import { SeatModel } from "../model";
import { GameModel } from "../model/types/Game";
import useEventSubscriber from "../service/EventManager";
import useGameEngine from "../service/GameEngine";


const useSplitProcessor = () => {
    const { createEvent } = useEventSubscriber([], []);
    const gameEngine = useGameEngine();
    const process = (gameObj: GameModel) => {

        const seat = gameObj.seats.find((s: SeatModel) => s.no === gameObj.currentTurn.seat);
        if (!seat)
            return null;
        if (gameEngine.splitSlot(gameObj, seat)) {
            const currentSlot = seat.slots.find((s) => s.id === seat.currentSlot);
            if (currentSlot) {
                const cards = gameObj.cards.filter((c) => currentSlot.cards.includes(c.no));
                const scores = gameEngine.getHandScore(cards);
                console.log(scores)
                if (scores.length === 0 || scores.includes(21)) {
                    currentSlot.status = 1;
                    if (gameEngine.turnSlot(gameObj, seat)) {
                        return;
                    }
                    if (gameEngine.turnSeat(gameObj, seat)) {
                        seat.status = 1;
                        return;
                    }
                    gameEngine.turnDealer(gameObj, seat);

                }
            }
        }

    }

    useEffect(() => {

    }, [])
    return { process }

}
export default useSplitProcessor
