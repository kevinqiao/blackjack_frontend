import { useEffect } from "react";
import { SeatBetSlot, SeatModel } from "../model";
import ActionType from "../model/types/ActionType";
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

            const cards = gameObj.cards.filter((c) => currentSlot.cards.includes(c.no));
            const scores = gameEngine.getHandScore(cards);
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

            } else {
                Object.assign(gameObj.currentTurn, { id: Date.now(), expireTime: Date.now() + 15000, acts: [ActionType.HIT, ActionType.STAND] })
                createEvent({ name: "createNewTurn", topic: "model", data: Object.assign({}, gameObj.currentTurn, { expireTime: 15000 }), delay: 1500 })
                console.log(JSON.parse(JSON.stringify(seat)))
            }

        }

    }

    useEffect(() => {

    }, [])
    return { process }

}
export default useHitProcessor
