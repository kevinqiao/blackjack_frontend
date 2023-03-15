import { useEffect, useRef, useState } from "react";
import { CardModel, GameModel } from "../model";
import useHitProcessor from "../processor/HitProcessor";
import useLaunchProcessor from "../processor/LaunchProcessor";
import useSplitProcessor from "../processor/SplitProcessor";
import useStandProcessor from "../processor/StandProcessor";
import useGameDao from "../respository/RepositoryManager";
import useGameEngine from "./GameEngine";


const useGameService = () => {
    const lastSeatRef = useRef(-1);
    const [game, setGame] = useState<GameModel | null>(null);
    const { create, update } = useGameDao();
    const gameEngine = useGameEngine();
    const hitProcessor = useHitProcessor();
    const standProcessor = useStandProcessor();
    const splitProcessor = useSplitProcessor();
    const launchProcessor = useLaunchProcessor();


    const createGame = () => {
        const startSeat: number = lastSeatRef.current + 1 >= 3 ? 0 : lastSeatRef.current + 1;
        lastSeatRef.current = startSeat;
        const initData: GameModel = {
            gameId: Date.now(),
            startSeat: startSeat,
            round: 1,
            cards: gameEngine.shuffle(),
            seats: [
                { no: 0, status: 0, acted: [], slots: [], currentSlot: 0 },
                { no: 1, status: 0, acted: [], slots: [], currentSlot: 0 },
                { no: 2, status: 0, acted: [], slots: [], currentSlot: 0 },
                { no: 3, status: 0, acted: [], slots: [], currentSlot: 0 },
            ],
            currentTurn: { id: 0, acts: [], seat: -1, expireTime: 0, data: null },
            status: 0,
        };

        launchProcessor.process(initData)

        create(initData)
        setGame(initData)

    }
    const hit = (seatNo: number) => {
        if (game) {
            hitProcessor.process(game);
            // update(game)
            setGame(JSON.parse(JSON.stringify(game)))
            console.log(JSON.parse(JSON.stringify(game)))
        }

    }
    const split = (seatNo: number) => {
        if (game) {
            console.log("split actiing....")
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
    const stand = (seatNo: number) => {
        if (game) {
            standProcessor.process(game);
            setGame(JSON.parse(JSON.stringify(game)))
        }
    }

    useEffect(() => {

    }, [])
    return { createGame, hit, split, double, insure, switchSlot, stand }

}
export default useGameService
