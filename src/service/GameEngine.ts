import { useEffect } from "react";
import { CardModel, GameModel, SeatBetSlot, SeatModel } from "../model";
import ActionType from "../model/types/ActionType";
import useEventSubscriber from "./EventManager";
const make_deck = () => {
    const cards: CardModel[] = [];
    let no = 0;
    let j = 0;
    let v = "";
    for (let i = 2; i <= 14; i++) {
        v = i + "";
        switch (i) {
            case 14:
                v = "A";
                break;
            case 11:
                v = "J";
                break;
            case 12:
                v = "Q";
                break;
            case 13:
                v = "K";
                break;
            default:
                break;
        }
        cards[j++] = { no: ++no, value: v, rank: i, suit: "h", seat: -1, slot: 0 };
        cards[j++] = { no: ++no, value: v, rank: i, suit: "d", seat: -1, slot: 0 };
        cards[j++] = { no: ++no, value: v, rank: i, suit: "c", seat: -1, slot: 0 };
        cards[j++] = { no: ++no, value: v, rank: i, suit: "s", seat: -1, slot: 0 };
    }
    return cards;
};
const useGameEngine = () => {
    const { createEvent } = useEventSubscriber([], []);
    const shuffle = (): CardModel[] => {
        return make_deck()
    }
    const releaseCard = (game: GameModel): CardModel | null => {
        if (game) {
            const releaseds = game.seats.map((s: any) => s["slots"].map((c: SeatBetSlot) => c["cards"])).flat(2);
            const toReleases = game.cards.filter((c: CardModel) => !releaseds.includes(c.no));
            const no = Math.floor(Math.random() * toReleases.length);
            // console.log(no)
            const card = toReleases[no];
            // console.log(card)
            return card;
        } else
            return null

    }
    const getActs = (game: GameModel, seatNo: number) => {
        const acts = [ActionType.HIT, ActionType.STAND];
        const seat = game.seats.find((s) => s.no === seatNo);
        const currentSlot = seat?.slots.find((s) => s.id === seat.currentSlot);
        if (currentSlot?.cards.length === 2) {
            if (seat?.slots?.length === 1) {
                acts.push(ActionType.DOUBLE, ActionType.SURRENDER);
                const dealerSeat = game.seats.find((s) => s.no === 3);
                const card = game.cards.find((c) => c.no === dealerSeat?.slots[0].cards[0]);
                if (card?.rank === 14)
                    acts.push(ActionType.INSURE)
            }
            const splitSeats = seat?.slots.filter((s: SeatBetSlot) => s.status && s.status > 0);
            if (!splitSeats || splitSeats.length === 0) {
                acts.push(ActionType.SPLIT)
            }
        }
        return acts;
    }
    const getHandScore = (cards: CardModel[]): number[] => {
        const aces = cards.filter((c) => c.rank === 14);
        const scores: number[] = [];
        const score = cards.filter((c) => c.rank < 14).map((c) => c.rank > 10 ? 10 : c.rank).reduce((a, c) => a + c, 0)
        if (aces?.length > 0) {
            for (let i = 0; i <= aces.length; i++) {
                const ascore = i + (aces.length - i) * 11;
                if ((score + ascore) <= 21)
                    scores.push(score + ascore)
            }
        } else if (score <= 21) {
            scores.push(score)
        }
        return scores;
    }

    const turnSeat = (gameObj: GameModel, seat: SeatModel): boolean => {
        const nextSeatNo: number = seat.no + 1 >= gameObj.seats.length - 1 ? seat.no + 1 - (gameObj.seats.length - 1) : seat.no + 1;
        const nextSeat = gameObj.seats.find((s: SeatModel) => s.no === nextSeatNo);
        if (nextSeat?.status === 0) {
            Object.assign(gameObj.currentTurn, { id: Date.now(), expireTime: Date.now() + 15000, acts: getActs(gameObj, nextSeatNo), seat: nextSeatNo })
            createEvent({ name: "createNewTurn", topic: "model", data: Object.assign({}, gameObj.currentTurn, { expireTime: 1500 }), delay: 10 });
            return true;
        } else
            return false
    }
    const turnSlot = (gameObj: GameModel, seat: SeatModel): boolean => {
        const activeSlots = seat.slots.filter((s) => s.id != seat.currentSlot && (!s.status || s.status === 0)).sort((a, b) => a.id - b.id);
        if (activeSlots?.length > 0) {
            seat.currentSlot = activeSlots[0].id;
            createEvent({ name: "openSlot", topic: "model", data: { seat: seat.no, slot: seat.currentSlot }, delay: 2000 });
            let card = releaseCard(gameObj);
            if (card) {
                const currentSlot = seat.slots.find((s) => s.id === seat.currentSlot);
                currentSlot?.cards.push(card.no);
                createEvent({ name: "releaseCard", topic: "model", data: { seat: seat.no, slot: seat.currentSlot, no: card?.no }, delay: 2200 })
                Object.assign(gameObj.currentTurn, { id: Date.now(), expireTime: 0, acts: getActs(gameObj, seat.no), seat: seat.no })
                createEvent({ name: "createNewTurn", topic: "model", data: Object.assign({}, gameObj.currentTurn, { expireTime: 1500 }), delay: 2820 });
                return true;
            }
        }
        return false
    }
    const turnDealer = (gameObj: GameModel, seat: SeatModel) => {
        const dealerNo = gameObj.seats.length - 1;
        Object.assign(gameObj.currentTurn, { id: Date.now(), expireTime: 0, acts: [], seat: dealerNo })
        createEvent({ name: "createNewTurn", topic: "model", data: Object.assign({}, gameObj.currentTurn, { expireTime: 1500 }), delay: 10 });
        const dealerSeat = gameObj.seats.find((s) => s.no === dealerNo);
        if (dealerSeat) {
            for (let i = 0; i < 4; i++) {
                let card = releaseCard(gameObj);
                if (card && dealerSeat.slots?.length === 1)
                    dealerSeat.slots[0]['cards'].push(card.no)
                createEvent({ name: "releaseCard", topic: "model", data: { seat: dealerNo, no: card?.no }, delay: (i + 1) * 1600 })
            }
        }
    }
    const splitSlot = (gameObj: GameModel, seat: SeatModel): boolean => {
        let ok = false;
        const currentSlot = seat.slots.find((s) => s.id === seat.currentSlot);
        if (currentSlot?.cards.length === 2) {
            const newSlot = { id: Date.now(), status: 0, cards: [currentSlot.cards[1]] }
            seat.slots.push(newSlot);
            currentSlot.cards.splice(1, 1);
            let card = releaseCard(gameObj);
            if (card) {
                card.seat = seat.no;
                currentSlot.cards.push(card.no);
                createEvent({ name: "splitSlot", topic: "model", data: { seat: seat.no, slot: newSlot }, delay: 10 });
                createEvent({ name: "releaseCard", topic: "model", data: { seat: seat.no, no: card.no }, delay: 500 });
                Object.assign(gameObj.currentTurn, { id: Date.now(), expireTime: Date.now() + 15000, acts: getActs(gameObj, seat.no), seat: seat.no })
                createEvent({ name: "createNewTurn", topic: "model", data: Object.assign({}, gameObj.currentTurn, { expireTime: 16000 }), delay: 1000 })
                ok = true;
            }
        }
        return ok;
    }
    useEffect(() => {

    }, [])
    return { shuffle, releaseCard, getHandScore, getActs, turnSeat, turnSlot, turnDealer, splitSlot }

}
export default useGameEngine
