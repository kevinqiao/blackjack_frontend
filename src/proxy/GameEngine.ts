import { useEffect } from "react";
import { CardModel, GameModel, SeatBetSlot } from "../model";
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
const useGameEngine = (game: GameModel) => {
    const shuffle = (): CardModel[] => {
        return make_deck()
    }
    const releaseCard = (): CardModel => {
        const releaseds = game.seats.map((s: any) => s["slots"].map((c: SeatBetSlot) => c["cards"])).flat(2);
        const toReleases = game.cards.filter((c: CardModel) => !releaseds.includes(c.no));
        const no = Math.floor(Math.random() * toReleases.length);
        const card = toReleases[no];
        return card;
    }

    useEffect(() => {

    }, [])
    return { shuffle, releaseCard }

}
export default useGameEngine
