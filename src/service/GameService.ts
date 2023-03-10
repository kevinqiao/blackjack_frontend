import { useCallback, useEffect, useState } from "react";
import { CardModel, GameAction, SeatBetSlot, SeatModel } from "../model";
import { ActionTurn } from "../model/types/ActionTurn";
import ActionType from "../model/types/ActionType";
import { GameModel } from "../model/types/Game";
import useGameDao from "../respository/RepositoryManager";
import useInterval from "../util/useInterval";
import useGameEngine from "./GameEngine";


const useGameService = () => {
    const [lastSeat, setLastSeat] = useState(-1);
    const { game, create, update } = useGameDao();
    const [action, setAction] = useState<GameAction | null>(null);
    const gameEngine = useGameEngine();
    const [checkInterval, setCheckInterval] = useState(0)
    const checkGame = useCallback(() => {

    }, [game]);

    useInterval(checkGame, checkInterval);//checkInterval-0:disable


    const createGame = () => {
        const initData: GameModel = {
            gameId: Date.now(),
            startSeat: lastSeat + 1,
            round: 1,
            cards: gameEngine.shuffle(),
            seats: [
                { no: 0, status: 0, slots: [], currentSlot: 0 },
                { no: 1, status: 0, slots: [], currentSlot: 0 },
                { no: 2, status: 0, slots: [], currentSlot: 0 },
                { no: 3, status: 0, slots: [], currentSlot: 0 },
            ],
            currentTurn: { id: 0, act: -1, seat: -1, expireTime: 0, data: null },
            status: 0,
        };

        // create(initData);
        const actionData: GameAction = { id: Date.now(), name: "initGame", data: JSON.parse(JSON.stringify(initData)), seat: 0 }
        setAction(actionData);
        const size = initData.seats.length - 1;

        for (let i = 0; i < size; i++) {
            const no = lastSeat + i + 1 >= size ? lastSeat + i + 1 - size : lastSeat + 1 + i;
            const seat = initData.seats.find((s: SeatModel) => s.no === no);
            if (seat) {

                const currentSlot: SeatBetSlot = { id: Date.now(), cards: [] };
                seat.slots.push(currentSlot);
                seat.currentSlot = currentSlot.id;
                let card = gameEngine.releaseCard(initData);
                if (card?.no) {
                    let card1 = card.no;
                    currentSlot.cards.push(card1)
                    let time1 = (i + 1) * 500;
                    if (i === 2)
                        time1 = 2000
                    setTimeout(() => setAction({ id: Date.now(), name: "releaseCard", seat: seat.no, data: { seat: seat.no, no: card1 } }), time1);
                    card = gameEngine.releaseCard(initData);
                    if (card?.no) {
                        let card2 = card.no
                        currentSlot.cards.push(card2)
                        let time2 = (i + 1) * 500 + 300;
                        if (i === 2)
                            time2 = 2500;
                        setTimeout(() => setAction({ id: Date.now() + 2, name: "releaseCard", seat: seat.no, data: { seat: seat.no, no: card2 } }), time2)
                    }
                }
            }
        }
        const dealerSeat = initData.seats.find((s: SeatModel) => s.no === size);
        if (dealerSeat) {
            let time = 3000;
            dealerSeat.slots.push({ id: Date.now(), cards: [] })
            const dealerCard: CardModel | null = gameEngine.releaseCard(initData);
            if (dealerCard) {
                dealerSeat.slots[0]['cards'].push(dealerCard.no)
                setTimeout(() => setAction({ id: Date.now(), name: "releaseCard", seat: size, data: { seat: size, no: dealerCard.no } }), time)
                // setTimeout(() => setAction({ id: Date.now(), name: "releaseCard", seat: size, data: { seat: size, no: 0 } }), time + 250)
            }
        }
        const actionTurn: ActionTurn = { id: Date.now() + 2, act: ActionType.BEGIN, expireTime: Date.now() + 15000, seat: lastSeat + 1, data: null }
        initData.currentTurn = actionTurn;
        handleAct(initData, ActionType.BEGIN);
        create(initData)


        // setTimeout(() => setAction({ id: Date.now(), name: "createNewTurn", seat: lastSeat + 1, data: actionTurn }), count * 500 + 350)
    }
    const hit = (seatNo: number) => {
        const gameObj = JSON.parse(JSON.stringify(game));
        if (gameObj?.currentTurn?.seat === seatNo) {
            const seat = gameObj.seats.find((s: SeatModel) => s.no === seatNo);
            if (seat) {
                const currentSlot = seat.slots?.find((s: SeatBetSlot) => s.id === seat.currentSlot);
                if (currentSlot) {
                    let card = gameEngine.releaseCard(gameObj);
                    if (card) {
                        const data = { seat: seatNo, no: card.no }
                        currentSlot.cards.push(card.no)
                        // const actionTurn: ActionTurn = { id: Date.now(), act: ActionType.HIT, expireTime: Date.now() + 15000, seat: lastSeat + 1, data: null }
                        gameObj.currentTurn.act = ActionType.HIT;
                        setAction({ id: Date.now(), name: "releaseCard", seat: seatNo, data });
                        handleAct(gameObj, ActionType.HIT);
                        update(gameObj)
                    }
                }
            }
        }
    }
    const split = (seatNo: number): SeatBetSlot | null => {
        return null;
    }
    const switchSlot = (seatNo: number, slot: number) => {
        return;
    }
    const double = (seatNo: number): CardModel | null => {
        return null;

    }

    const stand = (seatNo: number) => {

        if (game && game.currentTurn?.seat === seatNo) {
            const gameObj = JSON.parse(JSON.stringify(game));
            const seat = gameObj.seats.find((s: SeatModel) => s.no === seatNo);
            if (seat) {
                // gameObj.currentTurn.act = ActionType.STAND;
                handleAct(gameObj, ActionType.STAND);
                update(gameObj)
            }
        }
    }
    const handleAct = (gameObj: GameModel, act: ActionType) => {

        const seat = gameObj.seats.find((s: SeatModel) => s.no === gameObj.currentTurn.seat);
        if (!seat)
            return null;
        if (act === ActionType.BEGIN) {
            gameObj.currentTurn = { id: Date.now(), act: ActionType.ALL, expireTime: Date.now(), seat: lastSeat + 1, data: null }
            setTimeout(() => setAction({ id: Date.now(), name: "createNewTurn", seat: lastSeat + 1, data: Object.assign({}, gameObj.currentTurn, { expireTime: 15000 }) }), 1500)
        } else if (act === ActionType.HIT) {
            const cards = gameObj.cards.filter((c) => seat.slots[0].cards.includes(c.no));
            const scores = gameEngine.getHandScore(cards);
            if (scores?.length === 0) {//bust
                seat.status = 1;
                processNextSeat(gameObj, seat);
            } else {
                Object.assign(gameObj.currentTurn, { id: Date.now(), expireTime: Date.now() + 15000, act: ActionType.ALL })
                setTimeout(() => setAction({ id: Date.now(), name: "createNewTurn", seat: gameObj.currentTurn.seat, data: Object.assign({}, gameObj.currentTurn, { expireTime: 15000 }) }), 1500)
            }
        } else if (act === ActionType.STAND) {
            seat.status = 1;
            processNextSeat(gameObj, seat)
        }  //1-bust check on hit 2-slot check on stand 
    }
    const processNextSeat = (gameObj: GameModel, seat: SeatModel) => {
        const nextSeatNo: number = seat.no + 1 >= gameObj.seats.length - 1 ? seat.no + 1 - (gameObj.seats.length - 1) : seat.no + 1;
        const nextSeat = gameObj.seats.find((s: SeatModel) => s.no === nextSeatNo);
        if (nextSeat?.status === 0) {
            Object.assign(gameObj.currentTurn, { id: Date.now(), expireTime: Date.now() + 15000, act: ActionType.ALL, seat: nextSeatNo })
            setTimeout(() => setAction({ id: Date.now(), name: "createNewTurn", seat: nextSeatNo, data: Object.assign({}, gameObj.currentTurn, { expireTime: 1500 }) }), 10)
        } else {
            const dealerNo = gameObj.seats.length - 1;
            Object.assign(gameObj.currentTurn, { id: Date.now(), expireTime: 0, act: ActionType.ALL, seat: dealerNo })
            setTimeout(() => setAction({ id: Date.now(), name: "createNewTurn", seat: dealerNo, data: Object.assign({}, gameObj.currentTurn, { expireTime: 1500 }) }), 10)
            for (let i = 0; i < 4; i++) {
                let card = gameEngine.releaseCard(gameObj);
                setTimeout(() => setAction({ id: Date.now(), name: "releaseCard", seat: dealerNo, data: { seat: dealerNo, no: card?.no } }), (i + 1) * 300)
            }
        }
    }

    useEffect(() => {

    }, [])
    return { action, createGame, hit, split, double, switchSlot, stand }

}
export default useGameService
