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
const useGameEngine = () => {
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

    const getHandScore = (cards: CardModel[]): number[] => {
        const aces = cards.filter((c) => c.rank === 14);
        const scores: number[] = [];
        const score = cards.filter((c) => c.rank < 14).map((c) => c.rank > 10 ? 10 : c.rank).reduce((a, c) => a + c, 0)
        console.log("non aces total score:" + score);
        if (aces?.length > 0) {
            for (let i = 1; i < aces.length; i++) {
                const ascore = i + (aces.length - i) * 11;
                if ((score + ascore) <= 21)
                    scores.push(score + ascore)
            }
        } else {
            scores.push(score)
        }
        return scores;
    }


    useEffect(() => {

    }, [])
    return { shuffle, releaseCard, getHandScore }

}
export default useGameEngine
