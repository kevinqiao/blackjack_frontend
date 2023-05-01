import { useEffect } from "react";
import { SeatBetSlot, SeatModel } from "../model";
import Constants from "../model/types/Constants";
import { GameModel } from "../model/types/Game";
import useEventSubscriber from "../service/EventManager";
import useEventService from "../service/EventService";
import useGameEngine from "../service/GameEngine";
import useTurnService from "../service/TurnService";



const useHitProcessor = () => {
    const { createEvent } = useEventSubscriber([], []);
    const gameEngine = useGameEngine();
    const turnService = useTurnService();
    const eventService = useEventService();
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
                eventService.sendEvent({ name: "releaseCard", topic: "model", data, delay: 0 });
            }
            const cards = gameObj.cards.filter((c) => currentSlot.cards.includes(c.no));
            const scores = gameEngine.getHandScore(cards);
            if (scores.length === 0 || scores.includes(21)) {
                currentSlot.status = 1;
                if (gameEngine.turnSlot(gameObj, seat)) {
                    return;
                }
                seat.status = 1;      
                if (gameEngine.turnSeat(gameObj, seat)) {
                    return;
                }
                gameEngine.turnDealer(gameObj);
                gameObj.status=1;
                // tournamentService.handleGameOver(gameObj)

            } else {
               
                
                Object.assign(gameObj.currentTurn, { id: Date.now(), expireTime: Date.now() + Constants.TURN_INTERVAL, acts: [] })
                turnService.newActionTurn(gameObj.currentTurn,100);
                // createEvent({ name: "createNewTurn", topic: "model", data: Object.assign({}, gameObj.currentTurn, { expireTime: Constants.TURN_INTERVAL }), delay: 100 })
            }

        }

    }

    useEffect(() => {

    }, [])
    return { process }

}
export default useHitProcessor
