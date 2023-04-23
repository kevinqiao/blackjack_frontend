import { useEffect } from "react";
import { TournamentModel } from "../model";
import { GameModel } from "../model/types/Game";
import { SlotBattleResult } from "../model/types/SlotBattleResult";
import useTableDao from "../respository/TableDao";
import { useTournamentDao } from "../respository/TournamentDao";
import useUserDao from "../respository/UserDao";
import useEventSubscriber, { EventModel } from "../service/EventManager";
import useGameEngine from "../service/GameEngine";


const useSettleGameProcessor = () => {
    const { createEvent } = useEventSubscriber([], []);
    const gameEngine = useGameEngine();
    const process = (game: GameModel) => {
        const dealerSeat = game.seats.find((s) => s.no === 3);
        if (dealerSeat) {
            const results: SlotBattleResult[] = [];
            const dealerScore = dealerSeat.slots[0]['score']
            if (typeof dealerScore !== "undefined" && dealerScore >= 0) {
                game.seats.filter((s) => s.no !== 3).forEach((s) => {
                    for (let slot of s.slots) {
                        const slotCards = game.cards.filter((c) => slot.cards.includes(c.no))
                        const scores = gameEngine.getHandScore(slotCards);
                        const item: SlotBattleResult = { seat: s.no, slot: slot.id, score: scores?.length > 0 ? scores[0] : 0, win: 0, chips: 0 }
                        if (!scores || scores.length === 0 || dealerScore > scores[0]) {
                            item['win'] = 2;
                        } else if (dealerScore === 0 || dealerScore < scores[0]) {
                            item['win'] = 1;
                        }
                        results.push(item)
                    }
                })
                game.status=2;
            }
            game.results = results;
            createEvent({ name: "settleGame", topic: "model", data: results, delay: 1000 });
        }
   }
    useEffect(() => {

    }, [])
    return { process }

}
export default useSettleGameProcessor
