import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { TableSeat, TournamentModel } from "../model";
import { ITournamentContext } from "../model/types/ITournamentContex";
import useEventSubscriber from "./EventManager";
import useTournamentService from "./TournamentService";
import { useUserManager } from "./UserManager";

const initialState = {
  tournament: null,
  tournaments: [],
};

const actions = {
  SELECT_TOURNAMENT: "SELECT_TOURNAMENT",
  UPDATE_TOURNAMENT: "UPDATE_TOURNAMENT",
  LOAD_TOURNAMENT: "LOAD_TOURNAMENT",
  CLEAR_TOURNAMENT: "CLEAR_TOURNAMENT",
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
    default:
      return state;
  }
};

const TournamentContext = createContext<ITournamentContext>({
  seats: [],
  seatOffset: 0,
  tournament: null,
  tournaments: [],
  sitDown: (seatNo: number) => null,
  join: (tournament: TournamentModel) => null,
  leave: () => null,
  standup: () => null,
  selectTournament: (t: TournamentModel) => null,
});

export const TournamentProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const [seatOffset, setSeatOffset] = useState(0);
  const { event, createEvent } = useEventSubscriber(
    ["initTable", "updateTable", "sitDown", "standUp", "quitMatch", "settleMatch"],
    ["model"]
  );
  const tournamentService = useTournamentService();
  const { uid, token, tableId } = useUserManager();
  useEffect(() => {
    if (tableId > 0) {
      const table = tournamentService.findTable(tableId);
      if (table) {
        const tournament = tournamentService.findTournament(table.tournamentId);
        tournament.table = table;
        if (tournament) dispatch({ type: actions.SELECT_TOURNAMENT, data: tournament });
      }
    }
  }, [tableId]);

  useEffect(() => {
    if (event?.name === "initTable") {
      handleInitTable(event.data);
    } else if (event?.name === "updateTable") {
      handleUpdateTable(event.data);
    }
  }, [event]);
  useEffect(() => {
    // window.localStorage.removeItem("tables");
    // tournamentService.initTournaments();
    let tournaments = tournamentService.findAllTournaments();
    if (tournaments == null) tournaments = tournamentService.initTournaments();
    dispatch({ type: actions.LOAD_TOURNAMENT, data: tournaments });
  }, []);

  useEffect(() => {
    let offset = 0;
    if (uid && state.tournament && (state.tournament.table || state.tournament.match)) {
      let seats: TableSeat[] =
        state.tournament.type === 0 ? state.tournament.table.seats : state.tournament.match.seats;
      if (Boolean(uid) && seats?.length > 0) {
        const seat = seats.find((s: TableSeat) => s.uid === uid);
        if (seat) offset = 3 - seat.no < 3 ? 3 - seat.no : 0;
        if (offset > 0) setSeatOffset(offset);
      }
    }
  }, [uid, state.tournament]);
  const handleInitTable = (data: any) => {
    console.log(data);
    dispatch({ type: actions.UPDATE_TOURNAMENT, data: { table: data } });
  };
  const handleUpdateTable = (data: any) => {
    console.log(data);
    dispatch({ type: actions.UPDATE_TOURNAMENT, data: { table: data } });
  };
  const seats = useMemo(() => {
    if (!state.tournament || (!state.tournament.table && !state.tournament.match)) return null;
    if (state.tournament.type === 0) return state.tournament.table.seats;
    else if (state.tournament.type === 1) return state.tournament.match.seats;
  }, [state.tournament]);

  // const seatOffset = useMemo(() => {
  //   let offset = 0;
  //   if (tableId > 0 && state.tournament && (state.tournament.table || state.tournament.match)) {
  //     let seats: TableSeat[] =
  //       state.tournament.type === 0 ? state.tournament.table.seats : state.tournament.match.seats;
  //     if (Boolean(uid) && seats?.length > 0) {
  //       const seat = seats.find((s: TableSeat) => s.uid === uid);
  //       if (seat) offset = 3 - seat.no < 3 ? 3 - seat.no : 0;
  //     }
  //   }
  //   return offset;
  // }, [uid, tableId, state.tournament]);
  const value = {
    seats: seats,
    seatOffset: seatOffset,
    tournament: state.tournament,
    tournaments: state.tournaments,
    sitDown: (seatNo: number) => {
      console.log("sit down at table:" + state.tournament.table.id + " seat:" + seatNo);
      let sno = seatNo + seatOffset;
      if (sno > 2) sno = sno - 3;
      console.log("sit down at table:" + state.tournament.table.id + " seat:" + sno);
      if (uid) tournamentService.sitDown(state.tournament.table.id, uid, sno);
    },
    join: (tournament: TournamentModel) => {
      dispatch({ type: actions.SELECT_TOURNAMENT, data: tournament });
      if (tournament != null && uid != null && token != null) {
        const table = tournamentService.join(tournament.id, uid, token);
        console.log(table);
        if (table) dispatch({ type: actions.UPDATE_TOURNAMENT, data: { table: table } });
      }
      // setTimeout(() => {
      //   dispatch({ type: actions.UPDATE_TOURNAMENT, data: { table: { id: 1, size: 3, gameId: Date.now() } } });
      // }, 2000);
    },
    leave: useCallback(() => {
      if (state.tournament?.table) {
        console.log("leaving....");
        setSeatOffset(0);
        const tableId = state.tournament.table.id;
        if (uid && tableId) tournamentService.leave(uid, tableId);
      }
    }, [uid, state.tournament]),
    standup: useCallback(() => {
      if (state.tournament?.table) {
        console.log("standup....");
        const tableId = state.tournament.table.id;
        if (uid && tableId) tournamentService.leave(uid, tableId);
      }
    }, [uid, state.tournament]),
    selectTournament: (t: TournamentModel) => {
      console.log(t);
      dispatch({ type: actions.SELECT_TOURNAMENT, data: t });
    },
  };

  return <TournamentContext.Provider value={value}>{children}</TournamentContext.Provider>;
};

export const useTournamentManager = () => {
  return useContext(TournamentContext);
};
