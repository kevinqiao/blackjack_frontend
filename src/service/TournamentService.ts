import { TableModel, TournamentModel } from "../model";
import useTableDao from "../respository/TableDao";
import { useTournamentDao } from "../respository/TournamentDao";
import useUserDao from "../respository/UserDao";
import useEventSubscriber from "./EventManager";
import useGameService from "./GameService";
import { useTournamentManager } from "./TournamentManager";
import { useUserManager } from "./UserManager";
import useTournamentAPI from "../api/TournamentAPI";
import DEPLOY_ENV from "../Config";
import useTableAPI from "../api/TableAPI";



const useTournamentService = () => {
    const { initTable,initTournament } = useTournamentManager();
    const {uid,token,updateUser} = useUserManager();

    const gameService = useGameService();
    const { findUserWithLock, updateUserWithLock } = useUserDao();
    const { findTable, findTournamentTables, findTableWithLock, createTable, updateTableWithLock } = useTableDao();
    // const { findTournament, findAllTournaments, initTournaments } = useTournamentDao();
    const tournamentDao =useTournamentDao();
    const tournamentAPI = useTournamentAPI();
    const tableAPI = useTableAPI();
    const { createEvent } = useEventSubscriber([], [])


    const join = async (tournament: TournamentModel) => {
        let table = null;
        if(DEPLOY_ENV.BACKBONE===0&&uid){
           table = await tournamentAPI.join(tournament.id,uid)
        }else{
            if (tournament?.type === 0) {
                    let tables: TableModel[] | null = findTournamentTables(tournament.id);
                    console.log("tournament type is 0,tables:")
                    console.log(tables)
                    if (!tables || tables.length === 0) {
                        table = {
                            id: Date.now(),
                            tournamentId: tournament.id,
                            tournamentType: 0,
                            size: 3,
                            lastStartSeat: -1,
                            sits: 0,
                            seats: [],
                            games: [],
                            status: 0,
                            ver: 0
                        }
                        tables = [table]
                        createTable(table);
                    }
                    tables = tables.filter((t) => t.sits < 3 && t.status === 0).sort((a, b) => a.sits - b.sits);
                    if (tables.length > 0)
                        table = tables[0]

                } else if (tournament?.type === 1) {
                    table = {
                        id: Date.now(),
                        tournamentId: tournament.id,
                        tournamentType: 0,
                        size: 3,
                        lastStartSeat: -1,
                        sits: 0,
                        seats: [],
                        games: [],
                        status: 0,
                        ver: 0
                    }
                    createTable(table);
                }
        }
        if(table){
            console.log(table)
            initTable(table);
            initTournament(tournament);
            updateUser({tableId:table.id})
        }

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
            if (!table.games)
                table.games = [];

            if (table.seats.length===1) {
                console.log(table)
                const game = gameService.createGame(table,0);
                table.games = [game.gameId]
            }
 
            const updatedTable = updateTableWithLock(table, table.ver);
            createEvent({ name: "updateTable", topic: "model", data: updatedTable, delay: 0 });
            const user = findUserWithLock(uid);

            updateUserWithLock({ uid: uid, tableId: tableId }, user.ver)
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
            const user = findUserWithLock(uid);
            updateUserWithLock({ uid: uid, tableId: 0 }, user.ver)
            createEvent({ name: "updateUser", topic: "model", data: { tableId: 0 }, delay: 50 })

        }
    }
    const standup = (uid: string, tableId: number) => {
        const table = findTableWithLock(tableId);
     
        if (table) {
            const seats = table.seats.filter((s) => s.uid !== uid);
            table.seats = seats;
            updateTableWithLock(table, table.ver)
            createEvent({ name: "updateTable", topic: "model", data: table, delay: 0 })
        }
    }
    const findAllTournaments=async ():Promise<TournamentModel[]|null>=>{
       console.log(DEPLOY_ENV)
       console.log("env:"+DEPLOY_ENV.BACKBONE)
        if(DEPLOY_ENV.BACKBONE===0){
           return await tournamentAPI.findAll()
        }else
           return tournamentDao.findAllTournaments();
    }
    const findTournament=async (id:number):Promise<TournamentModel|null>=>{
    
        if(DEPLOY_ENV.BACKBONE===1){
            const tour= tournamentDao.findTournament(id);
            console.log(tour)
            return tour
        }else{
            return await tournamentAPI.findOne(id)
        }
    }
    const findTournamentTable=async (id:number):Promise<TableModel|null>=>{
        if(DEPLOY_ENV.BACKBONE===1){
            return findTable(id);
        }else{
            return await tableAPI.findOne(id)
        }
       
    }
    return { join, sitDown, standup, leave, findAllTournaments,findTournament
         ,findTournamentTable}

}
export default useTournamentService;
