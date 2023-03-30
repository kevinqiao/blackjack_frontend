import { useEffect, useRef, useState } from "react";
import { GameModel } from "../model";
import useDealProcessor from "../processor/DealProcessor";
import useDoubleProcessor from "../processor/DoubleProcessor";
import useHitProcessor from "../processor/HitProcessor";
import useInitGameProcessor from "../processor/InitGameProcessor";
import useInsureProcessor from "../processor/InsureProcessor";
import useLaunchProcessor from "../processor/LaunchProcessor";
import useSplitProcessor from "../processor/SplitProcessor";
import useStandProcessor from "../processor/StandProcessor";
import useGameDao from "../respository/RepositoryManager";
import useGameEngine from "./GameEngine";


const useGameService = () => {
    const lastSeatRef = useRef(-1);
    const [game, setGame] = useState<GameModel | null>(null);
    const { find, create, update, remove } = useGameDao();
    const gameEngine = useGameEngine();
    const dealProcessor = useDealProcessor();
    const hitProcessor = useHitProcessor();
    const standProcessor = useStandProcessor();
    const splitProcessor = useSplitProcessor();
    const launchProcessor = useLaunchProcessor();
    const initGameProcessor = useInitGameProcessor();
    const insureProcessor = useInsureProcessor();
    const doubleProcessor = useDoubleProcessor();


    const initGame = () => {
        let initData: GameModel | null = find();
        if (!initData) {
            const startSeat: number = lastSeatRef.current + 1 >= 3 ? 0 : lastSeatRef.current + 1;
            lastSeatRef.current = startSeat;
            const gameId = Date.now();
            initData = {
                gameId: gameId,
                startSeat: startSeat,
                round: 0,
                cards: [],
                seats: [
                    { no: 0, status: 0, acted: [], slots: [{ id: gameId + 1, cards: [], status: 0 }], bet: 0, insurance: 0, currentSlot: gameId + 1 },
                    { no: 1, status: 0, acted: [], slots: [{ id: gameId + 2, cards: [], status: 0 }], bet: 0, insurance: 0, currentSlot: gameId + 2 },
                    { no: 2, status: 0, acted: [], slots: [{ id: gameId + 3, cards: [], status: 0 }], bet: 0, insurance: 0, currentSlot: gameId + 3 },
                    { no: 3, status: 0, acted: [], slots: [{ id: gameId + 4, cards: [], status: 0 }], bet: 0, insurance: 0, currentSlot: gameId + 4 },
                ],
                currentTurn: { id: 0, acts: [], seat: -1, expireTime: 0, data: null },
                status: 0,
            };
            // create(initData)
            initData['cards'] = gameEngine.shuffle();

            // shuffleProcessor.process(initData);
            // console.log(initData)
            // update(initData)
        }
        initGameProcessor.process(initData);
        setGame(initData)
    }
    const newGame = () => {
        lastSeatRef.current = -1;
        remove();
        initGame();
    }
    const deal = (seatNo: number, chips: number) => {
        if (game) {
            dealProcessor.process(game, seatNo, chips)
            launchProcessor.process(game)
            update(game)
            setGame(JSON.parse(JSON.stringify(game)))
        }

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
            console.log(game)
            update(game)
            setGame(JSON.parse(JSON.stringify(game)))
        }

    }
    const split = (seatNo: number) => {
        if (game) {
            splitProcessor.process(game);
            update(game)
            setGame(JSON.parse(JSON.stringify(game)))
        }
    }
    const switchSlot = (seatNo: number, slot: number) => {
        return;
    }
    const double = () => {
        if (game) {
            doubleProcessor.process(game);
            update(game)
            setGame(JSON.parse(JSON.stringify(game)))
        }

    }
    const insure = () => {
        if (game) {
            insureProcessor.process(game);
            update(game)
            setGame(JSON.parse(JSON.stringify(game)))
        }

    }
    const shuffle = () => {
        if (game)
            game['cards'] = gameEngine.shuffle();
    }
    const stand = (seatNo: number) => {
        if (game) {
            standProcessor.process(game);
            update(game)
            setGame(JSON.parse(JSON.stringify(game)))
        }
    }

    useEffect(() => {

    }, [])
    return { newGame, initGame, shuffle, deal, startGame, hit, split, double, insure, switchSlot, stand }

}
export default useGameService
