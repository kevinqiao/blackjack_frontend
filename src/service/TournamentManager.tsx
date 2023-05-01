import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { TableModel, TableSeat, TournamentModel } from "../model";
import { ITournamentContext } from "../model/types/ITournamentContex";
import TableHome from "../view/component/TableHome";
import useEventSubscriber from "./EventManager";
import useTournamentService from "./TournamentService";
import { useUserManager } from "./UserManager";

const initialState = {
  table: null,
  tournament: null,
  tournaments: [],
};

const actions = {
  SELECT_TOURNAMENT: "SELECT_TOURNAMENT",
  UPDATE_TOURNAMENT: "UPDATE_TOURNAMENT",
  LOAD_TOURNAMENT: "LOAD_TOURNAMENT",
  CLEAR_TOURNAMENT: "CLEAR_TOURNAMENT",
  INIT_TABLE: "INIT_TABLE",
  UPDATE_TABLE: "UPDATE_TABLE",
  CLEAR_TABLE: "CLEAR_TABLE",
  REMOVE_SEAT:"REMOVE_SEAT"
};

const reducer = (state: any, action: any) => {
  switch (action.type) {
    case actions.SELECT_TOURNAMENT:
      return Object.assign({}, state, { tournament: action.data });
    case actions.LOAD_TOURNAMENT:
      return Object.assign({}, state, { tournaments: action.data });
    case actions.UPDATE_TOURNAMENT:
      const tobj = Object.assign({}, state.tournament, action.data);
      return Object.assign({}, state, { tournament: tobj });
    case actions.CLEAR_TOURNAMENT:
      return Object.assign({}, state, { tournament: null });
    case actions.INIT_TABLE:
      return Object.assign({}, state, { table: action.data });
    case actions.UPDATE_TABLE:
      return Object.assign({}, state, { table: Object.assign({}, state.table, action.data) });
    case actions.CLEAR_TABLE:
      return Object.assign({}, state, { table: null });
    case actions.REMOVE_SEAT:
      if(state.table){
           const seatNo = action.data.seatNo;
           const seats =state.table.seats.filter((s:TableSeat)=>s.no!==seatNo);
           console.log(seats)
           return Object.assign({},state,{table:Object.assign({},state.table,{seats:seats})})
      }
      return state;
    default:
      return state;
  }
};

const TournamentContext = createContext<ITournamentContext>({
  table: null,
  tournament: null,
  tournaments: [],
  initTournament: (tournament: TournamentModel) => null,
  initTable: (table: TableModel) => null,
  clearTable: () => null,
  // sitDown: (seatNo: number) => null,
  // join: (tournament: TournamentModel) => null,
  // leave: () => null,
  // standup: () => null,
  //selectTournament: (t: TournamentModel) => null,
});

export const TournamentProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const [seatOffset, setSeatOffset] = useState(0);
  const { event, createEvent } = useEventSubscriber(
    ["initTable", "updateTable","removeSeat", "sitDown", "standUp", "quitMatch", "settleMatch", "finishTournament"],
    ["model"]
  );
  const tournamentService = useTournamentService();
  const { uid} = useUserManager();

  useEffect(() => {
    if (event?.name === "updateTable") {
      dispatch({ type: actions.UPDATE_TABLE, data: event.data });
    } else if (event?.name === "finishTournament") {
      console.log("clear table");
      dispatch({ type: actions.CLEAR_TABLE });
    }else if(event?.name==="removeSeat"){
      console.log("remove seat")
      dispatch({type:actions.REMOVE_SEAT,data:event.data})
    }
  }, [event]);
  useEffect(() => {
    //  tournamentService.initTournaments();
    let tournaments = tournamentService.findAllTournaments();
    dispatch({ type: actions.LOAD_TOURNAMENT, data: tournaments });
  }, []);

  useEffect(() => {
    let offset = 0;
    if (!uid || !state.table) setSeatOffset(0);
    else if (state.table && state.table.seats?.length > 0) {
      const seat = state.table.seats.find((s: TableSeat) => s.uid === uid && s.no < 3);
    
      if (seat) {
        offset = seat.no === 0 ? 0 : 3 - seat.no;
        setSeatOffset(offset);
      }
    }
  }, [uid, state.table]);

  const value = {
    table: state.table,
    tournament: state.tournament,
    tournaments: state.tournaments,
    initTournament: (tournament: TournamentModel) => {
      dispatch({ type: actions.SELECT_TOURNAMENT, data: tournament });
    },
    initTable: (table: TableModel) => {
      dispatch({ type: actions.INIT_TABLE, data: table });
    },
    clearTable: () => {
      dispatch({ type: actions.CLEAR_TABLE });
    },
    // sitDown: (seatNo: number) => {
    //   // let sno = seatNo - seatOffset;
    //   // if (sno < 0) sno = sno + 3;
    //   if (uid) tournamentService.sitDown(state.table.id, uid, seatNo);
    // },
    // join: (tournament: TournamentModel) => {
    //   dispatch({ type: actions.SELECT_TOURNAMENT, data: tournament });
    //   if (tournament != null && uid != null && token != null) {
    //     const table = tournamentService.join(tournament.id, uid, token);
    //     console.log(table);
    //     if (table) {
    //       // if(table.games?.length>0){
    //       //    const game = gameDao.find(table.games[0]);
    //       //    console.log(game)
    //       // }
    //       joinTable(table);
    //       dispatch({ type: actions.INIT_TABLE, data: table });
    //     }
    //   }
    // },
    // leave: useCallback(() => {
    //   if (uid && state.table && state.table.id > 0) tournamentService.leave(uid, state.table.id);
    // }, [uid, state.table]),
    // standup: useCallback(() => {
    //   if (uid && state.table && state.table.id > 0) tournamentService.standup(uid, state.table.id);
    // }, [uid, state.table]),
    // selectTournament: (t: TournamentModel) => {
    //   console.log(t);
    //   dispatch({ type: actions.SELECT_TOURNAMENT, data: t });
    // },
  };

  return <TournamentContext.Provider value={value}>{children}</TournamentContext.Provider>;
};

export const useTournamentManager = () => {
  return useContext(TournamentContext);
};
