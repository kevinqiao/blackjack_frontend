import { useEffect } from "react";
import { GameModel, TableModel, TournamentModel } from "../model";
import { MatchModel } from "../model/types/Match";
import useTableDao from "../respository/TableDao";
import { useTournamentDao } from "../respository/TournamentDao";
import useUserDao from "../respository/UserDao";
import useInterval from "../util/useInterval";
import useEventSubscriber from "./EventManager";
import useGameService from "./GameService";




const useTournamentService = () => {
    const { updateUser } = useUserDao();
    const { findTable, findTournamentTables, findTableWithLock, createTable, updateTableWithLock } = useTableDao();
    const { findTournament, findAllTournaments, findTournamentsByType, findTournamentWithLock, initTournaments } = useTournamentDao();
    const { initGame } = useGameService();
    const { createEvent } = useEventSubscriber([], [])

    useInterval(() => {
        // let tournaments = findAllTournaments();
        // if (tournaments == null)
        //     tournaments = initTournaments();

        // const tables = findAllTable();
        // if (tables && tables.length > 0) {
        //     const toLaunchTables = tables.filter((t) => t.seats.length > 0 && (t.gameId === 0 || t.status === 0));
        //     for (let table of toLaunchTables) {
        //         const tournament = findTournament(table.tournamentId);
        //         if (tournament) {
        //             createTableGame(tournament, table)
        //         }
        //     }
        // }
        // tournaments = tournaments.filter((t) => t.type === 1 && t.toMatch.length > 0);
        // for (let tournament of tournaments) {
        //     const match: MatchModel = {
        //         id: Date.now(),
        //         tournamentId: tournament.id,
        //         games: [],
        //         seats: [],
        //         status: 1
        //     }
        //     for (let i = 0; i < tournament.toMatch.length; i++) {
        //         const m = tournament.toMatch[i];
        //         const seat: TableSeat = {
        //             no: i,
        //             uid: m.uid,
        //             status: 0,
        //             chips: 0
        //         }
        //         match.seats.push(seat);
        //     }
        //     createMatch(match);
        //     createMatchGame(tournament, match)
        // }

    }, 2500)

    const getInitGame = () => {
        const gameId = Date.now();
        const initData = {
            gameId: gameId,
            ver: 0,
            table: null,
            tournament: null,
            match: null,
            startSeat: 0,
            round: 0,
            cards: [],
            seats: [
                { no: 0, uid: "1", status: 0, acted: [], slots: [], bet: 0, insurance: 0, currentSlot: 0 },
                { no: 1, uid: "2", status: 0, acted: [], slots: [], bet: 0, insurance: 0, currentSlot: 0 },
                { no: 2, uid: "3", status: 0, acted: [], slots: [], bet: 0, insurance: 0, currentSlot: 0 },
                { no: 3, uid: null, status: 0, acted: [], slots: [], bet: 0, insurance: 0, currentSlot: 0 },
            ],
            currentTurn: { id: 0, acts: [], seat: -1, expireTime: 0, data: null },
            status: 0,
        };
        return initData;

    }
    const createMatchGame = (tournament: TournamentModel, match: MatchModel) => {

    }
    const createTableGame = (tournament: TournamentModel, table: TableModel) => {
        const initData = {
            gameId: Date.now(),
            ver: 0,
            table: null,
            tournament: null,
            match: null,
            startSeat: 0,
            round: 0,
            cards: [],
            currentTurn: { id: 0, acts: [], seat: -1, expireTime: 0, data: null },
            status: 0,

        }
    }
    const join = (tournamentId: number, uid: string, token: string): TableModel | MatchModel | null => {
        let table = null;
        const tournament = findTournament(tournamentId);
        if (tournament) {
            let tables: TableModel[] | null = findTournamentTables(tournamentId);
            if (!tables || tables.length === 0) {
                table = {
                    id: Date.now(),
                    tournamentId: tournamentId,
                    size: 3,
                    seats: [],
                    games: [],
                    status: 0,
                    ver: Date.now()
                }
                tables = [table]
                createTable(table);
            }
            tables = tables.filter((t) => !t.seats || t.seats.length < 3).sort((a, b) => a.seats.length - b.seats.length);
            if (tables.length > 0)
                table = tables[0]

        }
        return table

    }
    const sitDown = (tableId: number, uid: string, seatNo: number) => {

        const table = findTableWithLock(tableId);

        if (table) {
            let seat = table.seats.find((s) => s.no === seatNo);
            if (!seat) {
                seat = { no: seatNo, uid: uid, chips: 0, status: 0 };
                table.seats.push(seat)
            } else if (!seat.uid) {
                seat.uid = uid
            }
            const updatedTable = updateTableWithLock(table, table.ver);
            createEvent({ name: "updateTable", topic: "model", data: updatedTable, delay: 0 })
            updateUser({ uid: uid, tableId: tableId })
            createEvent({ name: "updateUser", topic: "model", data: { tableId: tableId }, delay: 50 })
        }

    }
    const leave = (uid: string, tableId: number) => {
        const table = findTableWithLock(tableId);
        if (table) {
            const seats = table.seats.filter((s) => s.uid !== uid);
            table.seats = seats;
            updateTableWithLock(table, table.ver)
            createEvent({ name: "updateTable", topic: "model", data: table, delay: 0 })
            updateUser({ uid: uid, tableId: 0 })
            createEvent({ name: "updateUser", topic: "model", data: { tableId: 0 }, delay: 50 })

        }
    }
    const handleGameOver = (game: GameModel) => {

    }


    useEffect(() => {

    }, [])
    return { join, sitDown, leave, findAllTournaments, findTournament, findTable, initTournaments, handleGameOver }

}
export default useTournamentService
