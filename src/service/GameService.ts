import { useCallback, useEffect, useState } from "react";
import { CardModel, GameAction, SeatBetSlot, SeatModel } from "../model";
import { GameModel } from "../model/types/Game";
import useGameEngine from "../proxy/GameEngine";
import useGameDao from "../proxy/RepositoryManager";
import useInterval from "../util/useInterval";


const useGameService = () => {
    const { game, create, update } = useGameDao();
    const [action, setAction] = useState<GameAction | null>(null);
    const gameEngine = useGameEngine(game);
    const [checkInterval, setCheckInterval] = useState(0)
    const checkGame = useCallback(() => {
        if (game?.currentAction?.expireTime <= Date.now()) {
            console.log("current action expired")
        }
    }, [game]);

    useInterval(checkGame, checkInterval);//checkInterval-0:disable


    const createGame = () => {
        const initData: GameModel = {
            gameId: Date.now(),
            round: 1,
            cards: gameEngine.shuffle(),
            seats: [
                { no: 0, status: 1, slots: [], currentSlot: 0 },
                { no: 1, status: 1, slots: [], currentSlot: 0 },
                { no: 2, status: 1, slots: [], currentSlot: 0 },
                { no: 3, status: 1, slots: [], currentSlot: 0 },
            ],
            currentAction: null,
            status: 0,
        };
        create(initData);
        const actionData: GameAction = { id: Date.now(), name: "initGame", data: initData, expireTime: 0, seat: 0, slot: 0 }
        setAction(actionData);
        const dif = 0;
        const size = game.seats.length - 1;
        let count = 0;
        for (let i = 0; i < size; i++) {

            const no = dif + i >= size ? dif + i - size : dif + i;
            const seat = game.seats.find((s: SeatModel) => s.no === no);
            if (seat) {
                count++;
                let time = count * 500;
                const currentSlot: SeatBetSlot = { id: Date.now(), cards: [] };
                seat.slots.push(currentSlot);
                seat.currentSlot = currentSlot.id;
                let card = gameEngine.releaseCard();
                currentSlot.cards.push(card.no)
                console.log(card.no);
                let card1 = card.no;
                setTimeout(() => setAction({ id: Date.now(), name: "releaseCard", expireTime: 0, seat: seat.no, slot: seat.currentSlot, data: { no: card1 } }), time);
                card = gameEngine.releaseCard();
                console.log(card.no);
                let card2 = card.no
                currentSlot.cards.push(card.no)
                setTimeout(() => setAction({ id: Date.now() + 2, name: "releaseCard", expireTime: 0, seat: seat.no, slot: seat.currentSlot, data: { no: card2 } }), time + 250)
            }
        }
        const dealerSeat = game.seats.find((s: SeatModel) => s.no === size);

        if (dealerSeat) {
            console.log(dealerSeat)
            count++;
            let time = count * 500;
            dealerSeat.slots.push({ id: Date.now(), cards: [] })
            let dealerCard: CardModel = gameEngine.releaseCard();
            dealerSeat.slots[0]['cards'].push(dealerCard.no)
            console.log("time:" + time)
            setTimeout(() => setAction({ id: Date.now(), name: "releaseCard", expireTime: 0, seat: size, slot: dealerSeat.currentSlot, data: { ...dealerCard } }), time)
            // dealerCard = gameEngine.releaseCard();
            // dealerSeat.slots[0]['cards'].push(dealerCard.no)
            setTimeout(() => setAction({ id: Date.now(), name: "releaseCard", expireTime: 0, seat: size, slot: dealerSeat.currentSlot, data: { no: 0 } }), time + 250)
        }
    }
    const hit = (seatNo: number): CardModel | null => {
        if (game) {
            const releaseds = game.seats.map((s: any) => s["slots"].map((c: SeatBetSlot) => c["cards"])).flat(2);
            const toReleases = game.cards.filter((c: CardModel) => !releaseds.includes(c.no));
            const no = Math.floor(Math.random() * toReleases.length);
            const card = toReleases[no];
            return card;
        } else
            return null
    }
    const split = (seatNo: number): SeatBetSlot | null => {
        return null;
    }
    const double = (seatNo: number): CardModel | null => {
        return null;

    }
    const insure = (seatNo: number) => {

    }
    const stand = (seatNo: number): boolean => {
        return true;
    }
    useEffect(() => {

    }, [])
    return { action, createGame, hit, split, double, insure, stand }

}
export default useGameService
