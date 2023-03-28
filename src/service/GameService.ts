import { useEffect, useRef, useState } from "react";
import { CardModel, GameModel } from "../model";
import useDealProcessor from "../processor/DealProcessor";
import useHitProcessor from "../processor/HitProcessor";
import useLaunchProcessor from "../processor/LaunchProcessor";
import useShuffleProcessor from "../processor/ShuffleProcessor";
import useSplitProcessor from "../processor/SplitProcessor";
import useStandProcessor from "../processor/StandProcessor";
import useGameDao from "../respository/RepositoryManager";
import useGameEngine from "./GameEngine";


const useGameService = () => {
    const lastSeatRef = useRef(-1);
    const [game, setGame] = useState<GameModel | null>(null);
    const { create, update } = useGameDao();
    const gameEngine = useGameEngine();
    const dealProcessor = useDealProcessor();
    const hitProcessor = useHitProcessor();
    const standProcessor = useStandProcessor();
    const splitProcessor = useSplitProcessor();
    const launchProcessor = useLaunchProcessor();
    const shuffleProcessor = useShuffleProcessor();


    const createGame = () => {
        const startSeat: number = lastSeatRef.current + 1 >= 3 ? 0 : lastSeatRef.current + 1;
        lastSeatRef.current = startSeat;
        const gameId = Date.now();
        const initData: GameModel = {
            gameId: gameId,
            startSeat: startSeat,
            round: 0,
            cards: [],
            seats: [
                { no: 0, status: 0, acted: [], slots: [{ id: gameId + 1, cards: [], status: 0 }], bet: 0, currentSlot: gameId + 1 },
                { no: 1, status: 0, acted: [], slots: [{ id: gameId + 2, cards: [], status: 0 }], bet: 0, currentSlot: gameId + 2 },
                { no: 2, status: 0, acted: [], slots: [{ id: gameId + 3, cards: [], status: 0 }], bet: 0, currentSlot: gameId + 3 },
                { no: 3, status: 0, acted: [], slots: [{ id: gameId + 4, cards: [], status: 0 }], bet: 0, currentSlot: gameId + 4 },
            ],
            currentTurn: { id: 0, acts: [], seat: -1, expireTime: 0, data: null },
            status: 0,
        };
        create(initData)
        // initData['cards'] = gameEngine.shuffle();
        shuffleProcessor.process(initData);
        setGame(initData)


    }
    const deal = (seatNo: number, chips: number) => {
        if (game)
            dealProcessor.process(game, seatNo, chips)

    }
    const startGame = () => {
        if (game) {
            game.round = 1;
            launchProcessor.process(game)
        }
    }
    const hit = (seatNo: number) => {
        if (game) {
            hitProcessor.process(game);
            // update(game)
            setGame(JSON.parse(JSON.stringify(game)))
        }

    }
    const split = (seatNo: number) => {
        if (game) {
            splitProcessor.process(game);
            setGame(JSON.parse(JSON.stringify(game)))
        }
    }
    const switchSlot = (seatNo: number, slot: number) => {
        return;
    }
    const double = (seatNo: number): CardModel | null => {
        return null;

    }
    const insure = (seatNo: number): CardModel | null => {
        return null;

    }
    const shuffle = () => {
        if (game)
            game['cards'] = gameEngine.shuffle();
    }
    const stand = (seatNo: number) => {
        if (game) {
            standProcessor.process(game);
            setGame(JSON.parse(JSON.stringify(game)))
        }
    }

    useEffect(() => {

    }, [])
    return { createGame, shuffle, deal, startGame, hit, split, double, insure, switchSlot, stand }

}
export default useGameService
