import { useEffect } from "react";
import { CardModel, SeatBetSlot, SeatModel } from "../model";
import { ActionTurn } from "../model/types/ActionTurn";
import Constants from "../model/types/Constants";
import { GameModel } from "../model/types/Game";
import useEventSubscriber from "../service/EventManager";
import useGameEngine from "../service/GameEngine";


const useLaunchProcessor = () => {
    const { createEvent } = useEventSubscriber([], []);
    const gameEngine = useGameEngine();

    const process = (game: GameModel) => {
        game.round = 1;
        createEvent({ name: "startGame", topic: "model", data: { round: 1 }, delay: 0 })
        let time = 0;

        for (let i = 0; i < 3; i++) {
            const no = game.startSeat + i >= 3 ? game.startSeat + i - 3 : game.startSeat + i;
            const seat = game.seats.find((s: SeatModel) => s.no === no);
            if (seat) {
                // const currentSlot: SeatBetSlot = { id: Date.now() + i + 10, cards: [], status: 0 };
                // seat.slots.push(currentSlot);
                // seat.currentSlot = currentSlot.id;
                let card = gameEngine.releaseCard(game, seat.no, seat.currentSlot);
                if (card?.no) {
                    let card1 = card.no;
                    seat.slots[0].cards.push(card1)
                    time = (i + 1) * 500;
                    createEvent({ name: "releaseCard", topic: "model", data: { seat: seat.no, no: card1 }, delay: time })
                    card = gameEngine.releaseCard(game, seat.no, seat.currentSlot);
                    if (card?.no) {
                        time = time + 300;
                        let card2 = card.no
                        seat.slots[0].cards.push(card2)
                        createEvent({ name: "releaseCard", topic: "model", data: { seat: seat.no, no: card2 }, delay: time })
                    }
                    const seatCards = game.cards.filter((c) => seat.slots[0].cards.includes(c.no));
                    const scores = gameEngine.getHandScore(seatCards);
                    if (scores.includes(21)) {
                        seat.status = 1;
                        gameEngine.turnSeat(game, seat)
                    }
                }
            }
        }

        const dealerSeat = game.seats.find((s: SeatModel) => s.no === 3);
        if (dealerSeat) {
            time = time + 300
             dealerSeat.slots.push({ id: Date.now() + 10, cards: [], status: 0 })
            const dealerCard: CardModel | null = gameEngine.releaseCard(game, dealerSeat.no, dealerSeat.currentSlot);
            if (dealerCard) {
                dealerSeat.slots[0]['cards'].push(dealerCard.no)
                // setTimeout(() => setAction({ id: Date.now(), name: "releaseCard", seat: size, data: { seat: size, no: dealerCard.no } }), time)
                createEvent({ name: "releaseCard", topic: "model", data: { seat: 3, no: dealerCard.no }, delay: time })
                // setTimeout(() => setAction({ id: Date.now(), name: "releaseCard", seat: size, data: { seat: size, no: 0 } }), time + 250)
            }
        }
        console.log(game)
        const startSeat = game.seats.find((s) => s.no === game.startSeat);
        console.log(startSeat)
        if (typeof startSeat !== 'undefined') {
            if (startSeat.status === 0) {
                time = time + 300;
                const actionTurn: ActionTurn = { id: Date.now() + 2, acts: [], expireTime: Date.now() + Constants.TURN_INTERVAL + time + 500, seat: game.startSeat, data: null }
                game.currentTurn = actionTurn;
                createEvent({ name: "createNewTurn", topic: "model", data: { ...actionTurn, expireTime: Constants.TURN_INTERVAL }, delay: time })
                return;
            }
            if (gameEngine.turnSeat(game, startSeat))
                return;
            gameEngine.turnDealer(game)
            game.status=1;
        }
    }


    useEffect(() => {

    }, [])
    return { process }

}
export default useLaunchProcessor
