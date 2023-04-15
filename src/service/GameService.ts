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
import useGameDao from "../respository/GameDao";
import useInterval from "../util/useInterval";
import useGameEngine from "./GameEngine";


const useGameService = () => {
    const lastSeatRef = useRef(-1);
    const [game, setGame] = useState<GameModel | null>(null);
    const { find, findWithLock, create, update, updateWithLock, remove } = useGameDao();
    const gameEngine = useGameEngine();
    const dealProcessor = useDealProcessor();
    const hitProcessor = useHitProcessor();
    const standProcessor = useStandProcessor();
    const splitProcessor = useSplitProcessor();
    const launchProcessor = useLaunchProcessor();
    const initGameProcessor = useInitGameProcessor();
    const insureProcessor = useInsureProcessor();
    const doubleProcessor = useDoubleProcessor();

    useInterval(() => {

        if (game?.round === 1) {
            const battle = findWithLock(game?.gameId);
            const turn = battle?.currentTurn;
            const seat = turn?.seat ? turn.seat : 0;
            const interval = turn?.expireTime ? Date.now() - turn.expireTime : 0;

            if (battle != null && seat < 3 && interval > 0) {
                const ver = battle.ver;
                standProcessor.process(battle);
                const updatedInstance = updateWithLock(battle, ver);
                if (updatedInstance != null)
                    setGame(updatedInstance)
            }
        }

    }, 2500)

    const initGame = (gameData: GameModel) => {
        // let initData: GameModel | null = find();
        // if (!initData) {
        //     const startSeat: number = lastSeatRef.current + 1 >= 3 ? 0 : lastSeatRef.current + 1;
        //     lastSeatRef.current = startSeat;
        //     const gameId = Date.now();
        //     initData = {
        //         gameId: gameId,
        //         ver: 0,
        //         table: null,
        //         tournament: null,
        //         match: null,
        //         startSeat: startSeat,
        //         round: 0,
        //         cards: [],
        //         seats: [
        //             { no: 0, uid: "1", status: 0, acted: [], slots: [{ id: gameId + 1, cards: [], status: 0 }], bet: 0, insurance: 0, currentSlot: gameId + 1 },
        //             { no: 1, uid: "2", status: 0, acted: [], slots: [{ id: gameId + 2, cards: [], status: 0 }], bet: 0, insurance: 0, currentSlot: gameId + 2 },
        //             { no: 2, uid: "3", status: 0, acted: [], slots: [{ id: gameId + 3, cards: [], status: 0 }], bet: 0, insurance: 0, currentSlot: gameId + 3 },
        //             { no: 3, uid: null, status: 0, acted: [], slots: [{ id: gameId + 4, cards: [], status: 0 }], bet: 0, insurance: 0, currentSlot: gameId + 4 },
        //         ],
        //         currentTurn: { id: 0, acts: [], seat: -1, expireTime: 0, data: null },
        //         status: 0,
        //     };
        //     // create(initData)
        //     initData['cards'] = gameEngine.shuffle();
        // }
        create(gameData);
        initGameProcessor.process(gameData);
        setGame(gameData)
    }
    const newGame = () => {
        lastSeatRef.current = -1;
        remove();
        // initGame();
    }
    const deal = (seatNo: number, chips: number) => {
        const gameObj: GameModel | null = findWithLock(0);
        if (gameObj) {
            const ver = gameObj.ver;
            dealProcessor.process(gameObj, seatNo, chips)
            launchProcessor.process(gameObj)
            const updatedInstance = updateWithLock(gameObj, ver);
            if (updatedInstance != null)
                setGame(updatedInstance)
        }

    }
    const startGame = () => {
        if (game) {
            game.round = 1;
            launchProcessor.process(game)
        }
    }
    const hit = (seatNo: number) => {
        const gameObj: GameModel | null = findWithLock(0);
        if (gameObj) {
            const ver = gameObj.ver;
            hitProcessor.process(gameObj);
            const updatedInstance = updateWithLock(gameObj, ver);
            if (updatedInstance != null)
                setGame(updatedInstance)
        }

    }
    const split = (seatNo: number) => {
        const gameObj: GameModel | null = findWithLock(0);
        if (gameObj) {
            const ver = gameObj.ver;
            splitProcessor.process(gameObj);
            const updatedInstance = updateWithLock(gameObj, ver);
            console.log(updatedInstance)
            if (updatedInstance != null)
                setGame(updatedInstance)
        }
    }

    const double = () => {
        const gameObj: GameModel | null = findWithLock(0);
        if (gameObj) {
            const ver = gameObj.ver;
            doubleProcessor.process(gameObj);
            const updatedInstance = updateWithLock(gameObj, ver);
            if (updatedInstance != null)
                setGame(updatedInstance)
        }

    }
    const insure = () => {

        const gameObj: GameModel | null = findWithLock(0);
        if (gameObj) {
            const ver = gameObj.ver;
            insureProcessor.process(gameObj);
            const updatedInstance = updateWithLock(gameObj, ver);
            if (updatedInstance != null)
                setGame(updatedInstance)
        }

    }
    const shuffle = () => {
        if (game)
            game['cards'] = gameEngine.shuffle();
    }
    const stand = (seatNo: number) => {

        const gameObj: GameModel | null = findWithLock(0);
        if (gameObj) {
            const ver = gameObj.ver;
            standProcessor.process(gameObj);
            const updatedInstance = updateWithLock(gameObj, ver);
            if (updatedInstance != null)
                setGame(updatedInstance)
        }
    }

    useEffect(() => {

    }, [])
    return { newGame, initGame, shuffle, deal, startGame, hit, split, double, insure, stand }

}
export default useGameService
