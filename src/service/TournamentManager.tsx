import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { TableModel, TableSeat, TournamentModel } from "../model";
import { ITournamentContext } from "../model/types/ITournamentContex";
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
  ADD_SEAT:"ADD_SEAT",
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
    case actions.ADD_SEAT:
      if(state.table){
        const seats = [...state.table.seats,action.data]
        const table = Object.assign({},state.table,{seats:seats})
        return Object.assign({},state,{table:table})
      } 
    case actions.REMOVE_SEAT:
      if(state.table){
           const seatNo = action.data.no;
           const seats =state.table.seats.filter((s:TableSeat)=>s.no!==seatNo);
           const table = Object.assign({},state.table,{seats:seats})
           console.log(table)
           return Object.assign({},state,{table:table})
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
});

export const TournamentProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const { event, createEvent } = useEventSubscriber(
    ["initTable", "updateTable","removeSeat", "sitDown", "standup", "quitMatch", "settleMatch", "finishTournament"],
    ["model"]
  );
  const tournamentService = useTournamentService();
  const {uid,tableId} = useUserManager();

  useEffect(() => {
    if (event?.name === "sitDown") {
      dispatch({ type: actions.ADD_SEAT, data: event.data });
    } else if (event?.name === "finishTournament"&&state.tournament.type===1) {
      dispatch({ type: actions.CLEAR_TABLE });
    }else if(event?.name==="standup"){
      dispatch({type:actions.REMOVE_SEAT,data:event.data})
    }
  }, [event]);
  useEffect(() => {
    //  tournamentService.initTournaments();
    tournamentService.findAllTournaments().then((tournaments)=>{
        dispatch({ type: actions.LOAD_TOURNAMENT, data: tournaments });
    })
  }, []);
  useEffect(() => {
    if (tableId === 0) {
      dispatch({ type: actions.CLEAR_TABLE });
    } else {
     tournamentService.findTournamentTable(tableId).then((tableObj)=>{
        if(tableObj&&(!state.tournament||state.tournament.id !==tableObj.tournamentId)) {
            tournamentService.findTournament(tableObj.tournamentId).then((tournamentObj)=>{
                if(tournamentObj){               
                    dispatch({ type: actions.SELECT_TOURNAMENT, data: tournamentObj });
                    setTimeout(() => dispatch({ type: actions.UPDATE_TABLE, data: tableObj }), 50);
                }
            })
        }
     })
    }
  }, [tableId]);


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

  };

  return <TournamentContext.Provider value={value}>{children}</TournamentContext.Provider>;
};

export const useTournamentManager = () => {
  return useContext(TournamentContext);
};
