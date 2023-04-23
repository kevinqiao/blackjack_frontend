import { GameModel } from "../model/types/Game";
import { TournamentModel } from "../model/types/Tournament";

export const useTournamentDao = () => {
  const initTournaments = (): TournamentModel[] => {
    const tournaments: TournamentModel[] = [];
    for (let i = 0; i < 2; i++) {
      const tournament: TournamentModel = {
        id: Date.now() + i * 1000 + i,
        type: 0,//0-free 1-sigo 2-world 3-friend
        buyInAmount: 0,
        rewards: [],
        buyInAsset: 0,
        rewardAsset: 0,
        startingStack: 0,
        minPlayers: 1,
        rounds: 1,
        minBet: (i + 1) * 50,
        maxBet: (i + 1) * 150,
        status: 0,
        ver: 0
      }
      tournaments.push(tournament);
    }
    for (let i = 0; i < 2; i++) {
      const tournament: TournamentModel = {
        id: Date.now() + i * 2000 + (i + 6),
        type: 1,//0-free 1-sigo 2-friend
        buyInAmount: 100,
        rewards: [],
        buyInAsset: 0,
        rewardAsset: 0,
        startingStack: 1200,
        minPlayers: 3,
        rounds: 4,
        minBet: (i + 1) * 50,
        maxBet: (i + 1) * 150,
        status: 0,
        ver: 0
      }
      tournaments.push(tournament);
    }

    window.localStorage.setItem("tournaments", JSON.stringify(tournaments));
    return tournaments;
  }
  const updateTournamentWithLock = (data: any, ver: number): GameModel | null => {

    if (typeof window !== "undefined" && data?.id) {
      const tournamentsts = window.localStorage.getItem("tournaments");

      if (typeof tournamentsts != "undefined" && tournamentsts != null) {
        const tournaments = JSON.parse(tournamentsts);
        const tournament = tournaments.find((t: TournamentModel) => t.id === data.id);
        if (tournament?.ver && tournament.ver === ver) {
          tournament.ver = Date.now();
          window.localStorage.setItem("tournaments", JSON.stringify(tournaments));
          return tournament
        }
      }
    }
    return null;
  }
  const updateTournament = (data: any) => {
    if (typeof window !== "undefined") {
      const tournamentsts = window.localStorage.getItem("tournaments");
      if (typeof tournamentsts != "undefined" && tournamentsts != null) {
        let tournaments = JSON.parse(tournamentsts);
        if (tournaments?.length > 0) {
          const tournament = tournaments.find((t: TournamentModel) => t.id === data.id);
          Object.assign(tournament, data);
          window.localStorage.setItem("tournaments", JSON.stringify(tournaments));
        }
      }
    }
  }
  const createTournament = (data: any) => {
    if (typeof window !== "undefined") {
      const tournamentsts = window.localStorage.getItem("tournaments");
      if (typeof tournamentsts != "undefined" && tournamentsts != null) {
        let tournaments = JSON.parse(tournamentsts);
        if (!tournaments)
          tournaments = [];
        tournaments.push(data);
        window.localStorage.setItem("tournaments", JSON.stringify(tournaments));
      }
    }
  }
  const removeTournament = (id: number) => {
    if (typeof window !== "undefined") {
      const tournamentsts = window.localStorage.getItem("tournaments");
      if (typeof tournamentsts != "undefined" && tournamentsts != null) {
        let tournaments = JSON.parse(tournamentsts);
        if (tournaments?.length > 0) {
          tournaments = tournaments.filter((t: TournamentModel) => t.id === id);
          window.localStorage.setItem("tournaments", JSON.stringify(tournaments));
        }
      }
    }
  }
  const findTournament = (id: number) => {
    if (typeof window !== "undefined") {
      const tournamentsts = window.localStorage.getItem("tournaments");
 
      if (typeof tournamentsts != "undefined" && tournamentsts != null) {
        const tournaments = JSON.parse(tournamentsts);
        if (tournaments?.length > 0)
          return tournaments.find((t: TournamentModel) => t.id === id);
      }
    }
    return null;
  }
  const findTournamentWithLock = (id: number): TournamentModel | null => {

    if (typeof window !== "undefined") {
      const tournamentsts = window.localStorage.getItem("tournaments");

      if (typeof tournamentsts != "undefined" && tournamentsts != null) {
        const tournaments = JSON.parse(tournamentsts);
        const tournament = tournaments.find((t: TournamentModel) => t.id === id);
        if (tournament != null && (tournament.ver === 0 || Date.now() - tournament.ver > 400)) {
          tournament.ver = Date.now();
          window.localStorage.setItem("tournament", JSON.stringify(tournament));
          return tournament
        }
      }
    }
    return null;
  }
  const findTournamentsByType = (type: number): TournamentModel[] | null => {
    let tournaments = null;
    if (typeof window !== "undefined") {
      const tournamentsts = window.localStorage.getItem("tournaments");
      if (typeof tournamentsts != "undefined" && tournamentsts != null) {
        tournaments = JSON.parse(tournamentsts);
      }
    }
    if (tournaments?.length > 0)
      tournaments = tournaments.filter((t: TournamentModel) => t.type === type);
    return tournaments;
  }
  const findAllTournaments = (): TournamentModel[] | null => {

    if (typeof window !== "undefined") {
      const tournamentsts = window.localStorage.getItem("tournaments");
      if (typeof tournamentsts != "undefined" && tournamentsts != null) {
        return JSON.parse(tournamentsts);
      }
    }
    return null;
  }
  return { findTournament, initTournaments, findTournamentWithLock, findTournamentsByType, findAllTournaments, createTournament, updateTournament, updateTournamentWithLock, removeTournament }
}