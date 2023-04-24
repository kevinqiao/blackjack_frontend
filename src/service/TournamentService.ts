import { useEffect } from "react";
import { GameModel, TableModel, TournamentModel } from "../model";
import { MatchModel } from "../model/types/Match";
import useTableDao from "../respository/TableDao";
import { useTournamentDao } from "../respository/TournamentDao";
import useUserDao from "../respository/UserDao";
import useInterval from "../util/useInterval";
import useEventSubscriber from "./EventManager";
import useGameService from "./GameService";
import { useTournamentManager } from "./TournamentManager";




const useTournamentService = () => {
    const gameService = useGameService();
    const { findUserWithLock,updateUserWithLock } = useUserDao();
    const { findTable, findTournamentTables, findTableWithLock, createTable, updateTableWithLock } = useTableDao();
    const { findTournament, findAllTournaments, findTournamentsByType, findTournamentWithLock, initTournaments } = useTournamentDao();
    const { createEvent } = useEventSubscriber([], [])
   
   
    useInterval(() => {
    

    }, 2500)


    const join = (tournamentId: number, uid: string, token: string): TableModel | null => {
        let table = null;
        const tournament = findTournament(tournamentId);
        if (tournament?.type===0) {
            let tables: TableModel[] | null = findTournamentTables(tournamentId);
            if (!tables || tables.length === 0) {
                table = {
                    id: Date.now(),
                    tournamentId: tournamentId,
                    tournamentType:0,
                    size: 3,
                    lastStartSeat:-1,
                    sits:0,
                    seats: [],
                    games: [],
                    status: 0,
                    ver: Date.now()
                }
                tables = [table]
                createTable(table);
            }
            tables = tables.filter((t) =>t.sits<3&&t.status===0).sort((a, b) => a.sits - b.sits);
            if (tables.length > 0)
                table = tables[0]

        }else if(tournament?.type===1){
            table = {
                id: Date.now(),
                tournamentId: tournamentId,
                tournamentType:0,
                size: 3,
                lastStartSeat:-1,
                sits:0,
                seats: [],
                games: [],
                status: 0,
                ver: 0
            }
            createTable(table);
        }
        return table

    }
    const sitDown = (tableId: number, uid: string, seatNo: number) => {
        console.log("sit on seat:"+seatNo)
        const table = findTableWithLock(tableId);

        if (table) {
            let seat = table.seats.find((s) => s.no === seatNo);
            if (!seat) {
                seat = { no: seatNo, uid: uid, chips: 0, status: 0 };
                table.seats.push(seat)
            } else if (!seat.uid) {
                seat.uid = uid
            }
            if(!table.games)
                table.games=[];
            if(table.seats.length===1){          
                const game = gameService.createGame(table);
                table.games=[game.gameId]                 
            }
            const updatedTable = updateTableWithLock(table, table.ver);
            createEvent({ name: "updateTable", topic: "model", data: updatedTable, delay: 0 });
            const user =findUserWithLock(uid);

            updateUserWithLock({ uid: uid, tableId: tableId },user.ver)
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
            const user =findUserWithLock(uid);
            updateUserWithLock({ uid: uid, tableId: 0 },user.ver)
            createEvent({ name: "updateUser", topic: "model", data: { tableId: 0 }, delay: 50 })

        }
    }
    const standup = (uid: string, tableId: number) => {
        const table = findTableWithLock(tableId);
        console.log(table)
        if (table) {
            const seats = table.seats.filter((s) => s.uid !== uid);
            table.seats = seats;
            updateTableWithLock(table, table.ver)

            createEvent({ name: "updateTable", topic: "model", data: table, delay: 0 })
            // const user =findUserWithLock(uid);
            // updateUserWithLock({ uid: uid, tableId: 0 },user.ver)
            // createEvent({ name: "updateUser", topic: "model", data: { tableId: 0 }, delay: 50 })

        }
    }
    // const handleGameOver = (game: GameModel) => {
    //     const table = findTableWithLock(game.tableId);
    //     console.log(table)
    //     if (table){   
    //         const tournament:TournamentModel = findTournament(table.tournamentId); 
    //         console.log(tournament)
    //         if(tournament?.type===0||(tournament?.type===1&&table.games.length<tournament.rounds)) {               
    //             // gameService.createGame(table);  
    //             const updatedTable = updateTableWithLock(table, table.ver);
    //             createEvent({ name: "updateTable", topic: "model", data: updatedTable, delay: 0 });
    //         }
    //     }
    // }


    return { join, sitDown, standup,leave, findAllTournaments, findTournament, findTable, initTournaments}

}
export default useTournamentService;
