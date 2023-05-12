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
        if(uid)
           table = await tournamentAPI.join(tournament.id,uid)
      
            
        if(table){
            initTable(table);
            initTournament(tournament);
            updateUser({tableId:table.id})
        }

    }
    const sitDown = (tableId: number, uid: string, seatNo: number) => {
 
       tableAPI.sitDown(tableId,uid,seatNo).then(()=>console.log("sit down...."))

    }
    const leave = (tableId: number) => {
        tableAPI.leave(tableId).then(()=>console.log("leave table"))
    }
    const standup = (tableId: number) => {
        tableAPI.standup(tableId).then(()=>console.log("stand up"))
    }
    const findAllTournaments=async ():Promise<TournamentModel[]|null>=>{
       
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
        if(id)
        return await tableAPI.findOne(id)
        else
         return null
        
    }
    return { join, sitDown, standup, leave, findAllTournaments,findTournament
         ,findTournamentTable}

}
export default useTournamentService;
