import { useEffect } from "react";
import { GameModel, SeatModel, TableModel, TableSeat, TournamentModel } from "../model";
import useDealProcessor from "../processor/DealProcessor";
import useDoubleProcessor from "../processor/DoubleProcessor";
import useHitProcessor from "../processor/HitProcessor";
import useInitGameProcessor from "../processor/InitGameProcessor";
import useInsureProcessor from "../processor/InsureProcessor";
import useLaunchProcessor from "../processor/LaunchProcessor";
import useSettleProcessor from "../processor/SettleGameProcessor";
import useSettleTournamentProcessor from "../processor/SettleTournamentProcessor";
import useSplitProcessor from "../processor/SplitProcessor";
import useStandProcessor from "../processor/StandProcessor";
import useGameDao from "../respository/GameDao";
import useTableDao from "../respository/TableDao";
import { useTournamentDao } from "../respository/TournamentDao";
import useInterval from "../util/useInterval";
import useEventSubscriber from "./EventManager";


const useGameService = () => {

    const { find, findWithLock, create, updateWithLock } = useGameDao();
    const { findTableWithLock, updateTableWithLock } = useTableDao();
    const { findTournament } = useTournamentDao();
    const { createEvent } = useEventSubscriber([], []);
    const settleTournamentProcessor = useSettleTournamentProcessor();
    const dealProcessor = useDealProcessor();
    const hitProcessor = useHitProcessor();
    const standProcessor = useStandProcessor();
    const splitProcessor = useSplitProcessor();
    const launchProcessor = useLaunchProcessor();
    const initGameProcessor = useInitGameProcessor();
    const insureProcessor = useInsureProcessor();
    const doubleProcessor = useDoubleProcessor();
    const settleProcessor = useSettleProcessor();

    useInterval(() => {

        // if (game?.round === 1) {
        //     const battle = findWithLock(game?.gameId);
        //     const turn = battle?.currentTurn;
        //     const seat = turn?.seat ? turn.seat : 0;
        //     const interval = turn?.expireTime ? Date.now() - turn.expireTime : 0;

        //     if (battle != null && seat < 3 && interval > 0) {
        //         const ver = battle.ver;
        //         standProcessor.process(battle);
        //         const updatedInstance = updateWithLock(battle, ver);
        //         if (updatedInstance != null)
        //             setGame(updatedInstance)
        //     }
        // }

    }, 2500)
    const getInitGame = (table: TableModel): GameModel => {
        table.lastStartSeat = table.lastStartSeat < 0 ? 0 : table.lastStartSeat + 1;
        for (let i = 0; i < 3; i++) {
            table.lastStartSeat = table.lastStartSeat + i > 2 ? 0 : table.lastStartSeat + i;
            const seat = table.seats.find((s: TableSeat) => s.no === table.lastStartSeat);
            if (seat)
                break;
        }

        const initData: GameModel = {
            gameId: Date.now(),
            ver: 0,
            tournamentId: 0,
            tableId: 0,
            startSeat: table.lastStartSeat,
            round: 0,
            cards: [],
            seats: [],
            currentTurn: { id: 0, round: 0, acts: [], seat: -1, expireTime: 0, data: null },
            status: 0,
        };
        let currentSlotId = Date.now();
        for (let tableSeat of table.seats) {
            if (tableSeat.uid) {
                const seat: SeatModel = {
                    no: tableSeat.no,
                    uid: tableSeat.uid,
                    status: 0,
                    acted: [],
                    bet: 0,
                    insurance: 0,
                    currentSlot: currentSlotId++,
                    slots: []
                }
                const slot = { id: seat.currentSlot, cards: [], status: 0, score: 0 };
                seat.slots.push(slot)
                initData.seats.push(seat)
            }
        }
        currentSlotId++;
        const dealer: SeatModel = { no: 3, uid: null, status: 0, acted: [], bet: 0, insurance: 0, currentSlot: currentSlotId, slots: [{ id: currentSlotId, cards: [], status: 0, score: 0 }] }
        initData.seats.push(dealer)
        return initData;

    }
    const createGame = (table: TableModel): GameModel => {
        const gameData: GameModel = getInitGame(table);
        gameData.tournamentId = table.tournamentId;
        gameData.tableId = table.id;
        initGameProcessor.process(gameData);
        create(gameData);
        return gameData
    }

    const deal = (gameId: number, seatNo: number, chips: number) => {

        const gameObj: GameModel | null = findWithLock(gameId);
        if (gameObj) {
            const ver = gameObj.ver;
            dealProcessor.process(gameObj, seatNo, chips);
            launchProcessor.process(gameObj)
            updateWithLock(gameObj, ver);
        }

    }

    const hit = (gameId: number) => {
        const gameObj: GameModel | null = findWithLock(gameId);

        if (gameObj) {
            const ver = gameObj.ver;
            hitProcessor.process(gameObj);

            if (gameObj.status === 1) {
                console.log("game over")
                setTimeout(() => settle(gameObj), 4000)
            }
            updateWithLock(gameObj, ver);
        }

    }
    const split = (gameId: number) => {
        const gameObj: GameModel | null = findWithLock(gameId);
        if (gameObj) {
            const ver = gameObj.ver;
            splitProcessor.process(gameObj);
            updateWithLock(gameObj, ver);
        }
    }

    const double = () => {
        const gameObj: GameModel | null = findWithLock(0);
        if (gameObj) {
            const ver = gameObj.ver;
            doubleProcessor.process(gameObj);
            updateWithLock(gameObj, ver);
        }

    }
    const insure = () => {

        const gameObj: GameModel | null = findWithLock(0);
        if (gameObj) {
            const ver = gameObj.ver;
            insureProcessor.process(gameObj);
            updateWithLock(gameObj, ver);

        }

    }

    const stand = (gameId: number) => {
        const gameObj: GameModel | null = findWithLock(gameId);
        console.log(gameObj)
        if (gameObj) {
            const ver = gameObj.ver;
            standProcessor.process(gameObj);

            if (gameObj.status === 1) {
                console.log("game over")
                setTimeout(() => settle(gameObj), 4000)
            }
            updateWithLock(gameObj, ver);
        }
    }

    const settle = (gameObj: GameModel) => {
        settleProcessor.process(gameObj);
        const table = findTableWithLock(gameObj.tableId);
        if (table) {
            const tournament: TournamentModel = findTournament(table.tournamentId);
            if (tournament) {
                if ((tournament.type === 0 && table.seats.filter((s) => s.no < 3).length > 0) || (tournament.type === 1 && table.games.length < tournament.rounds)) {
                    const newGame: GameModel = createGame(table);
                    if (tournament.type === 0)
                        table.games = [newGame.gameId]
                    else
                        table.games.push(newGame.gameId)
                    updateTableWithLock(table, table.ver);
                } else {
                    settleTournamentProcessor.process(tournament, table)
                    //create  event "tournament over"
                }
            }
        }
    }
    useEffect(() => {

    }, [])
    return { createGame, deal, hit, split, double, insure, stand }

}
export default useGameService
