import React, { createContext, useContext, useEffect, useReducer, useRef, useState } from "react";
import { CardModel, IGameContext, SeatBetSlot, SeatModel, TableSeat } from "../model";
import ActionType from "../model/types/ActionType";
import useGameDao from "../respository/GameDao";
import useInterval from "../util/useInterval";
import useEventSubscriber from "./EventManager";
import useGameService from "./GameService";
import { useTournamentManager } from "./TournamentManager";
import useTournamentService from "./TournamentService";
import { useUserManager } from "./UserManager";

const initialState = {
  gameId: 0,
  round: -1,
  cards: [],
  seats: [],
  currentTurn: null,
  results: [],
  status: 0,
};

const actions = {
  INIT_GAME: "INIT_GAME",
  PLACE_BET: "PLACE_BET",
  INSURE_BET: "INSURE_BET",
  DOUBLE_BET: "DOUBLE_BET",
  HIT_CARD: "HIT_CARD",
  HIT_DEALER: "HIT_DEALER",
  UPDATE_TURN: "UPDATE_TURN",
  SLOT_SPLIT: "SLOT_SPLIT",
  SLOT_OPEN: "SLOT_OPEN",
  SETTLE_GAME: "GAME_SETTLE",
  CLEAR_GAME: "CLEAR_GAME",
};

const reducer = (state: any, action: any) => {
  let slot: SeatBetSlot;
  let seat: SeatModel;
  let card: CardModel;
  switch (action.type) {
    case actions.CLEAR_GAME:
      return initialState;
    case actions.INIT_GAME:
      return action.game;
    case actions.PLACE_BET:
      if (action.data.seatNo >= 0) {
        seat = state.seats.find((s: SeatModel) => s.no === action.data.seatNo);
        seat.bet = action.data.chips;
        return Object.assign({}, state, { seats: state.seats });
      }
      return state;
    case actions.INSURE_BET:
      if (action.data.seatNo >= 0) {
        seat = state.seats.find((s: SeatModel) => s.no === action.data.seatNo);
        seat.acted.push(ActionType.INSURE);
        return Object.assign({}, state, { seats: state.seats });
      }
      return state;
    case actions.DOUBLE_BET:
      if (action.data.seatNo >= 0) {
        seat = state.seats.find((s: SeatModel) => s.no === action.data.seatNo);
        seat.acted.push(ActionType.DOUBLE);
        return Object.assign({}, state, { seats: state.seats });
      }
      return state;
    case actions.SETTLE_GAME:
      return Object.assign({}, state, { results: action.results });
    case actions.UPDATE_TURN:
      const expire = action.data.expireTime + Date.now();
      let round = 0;
      // console.log(action.data)
      if(action.data.round>=0)
         round=action.data.round;
      return Object.assign({}, state, { currentTurn: { ...action.data, expireTime: expire } }, { round: round });
    case actions.SLOT_SPLIT:
      const seatNo = action.data.seat;
      slot = action.data.slot;
      seat = state.seats.find((s: SeatModel) => s.no === seatNo);
      const currentSlot = seat.slots.find((s) => s.id === seat.currentSlot);
      if (currentSlot) {
        const cards = currentSlot.cards.filter((c) => c !== slot.cards[0]);
        currentSlot.cards = cards;
        seat.slots.push(slot);
        card = state.cards.find((c: CardModel) => c.no === slot.cards[0]);
        card.seat = seatNo;
        card.slot = slot.id;
        return Object.assign({}, state, { seats: [...state.seats], cards: [...state.cards] });
      } else return state;
    case actions.SLOT_OPEN:
      seat = state.seats.find((s: SeatModel) => s.no === action.data.seat);
      if (!seat) return state;
      seat.currentSlot = action.data.slot;
      return Object.assign({}, state, { seats: [...state.seats] });
    case actions.HIT_CARD:
      seat = state.seats.find((s: SeatModel) => s.no === action.data.seatNo);
      if (!seat) return state;
      const cslot = seat.slots.find((s: SeatBetSlot) => seat.currentSlot === s.id);
      if (cslot) cslot.cards.push(action.data.cardNo);
      card = state.cards.find((c: CardModel) => c.no === action.data.cardNo);
      if (card) {
        card["seat"] = action.data.seatNo;
        card["slot"] = seat.currentSlot;
      }
      return Object.assign(state, { seats: [...state.seats], cards: [...state.cards] });

    default:
      return state;
  }
};

const GameContext = createContext<IGameContext>({
  gameId: 0,
  seatOffset: 0,
  round: 0,
  startSeat: -1,
  cards: [],
  seats: [],
  status: 0,
  currentTurn: null,
  results: [],
  getCardIndex:()=>0
});

export const GameProvider = ({ children }: { children: React.ReactNode }) => {
  const cardIndex=useRef(-1);
  const [seatOffset, setSeatOffset] = useState(0);
  const [state, dispatch] = useReducer(reducer, initialState);
  const { event, createEvent } = useEventSubscriber(
    [
      "initGame",
      "placeBet",
      "startGame",
      "settleGame",
      "releaseCard",
      "createNewTurn",
      "splitSlot",
      "openSlot",
      "finishTournament",
      "clearGame"
    ],
    ["model"]
  );

  const tournamentService = useTournamentService();
  const { tournament, table, initTournament, initTable } = useTournamentManager();
  const gameService = useGameService();
  const gameDao = useGameDao();
  const { uid, tableId } = useUserManager();
  useInterval(()=>{
     gameService.autoAct();
  },5000)
  useEffect(() => {
    let seat;
    if (table) seat = table.seats.find((s: TableSeat) => s.uid === uid && s.no < 3);
    if (!seat) seat = state.seats.find((s: SeatModel) => s.uid === uid && s.no < 3);
    if (seat) {
      const offset = seat.no === 0 ? 0 : 3 - seat.no;
      setSeatOffset(offset);
    }
  }, [uid, table, state.seats]);
  // console.log("seatoffsett:" + seatOffset);
  useEffect(() => {
    
      if (table&&table.games?.length > 0&&state.gameId!==table.games[table.games.length-1]) {
          const game = gameDao.findGame(table.games[table.games.length - 1]);
          if (game) setTimeout(() => dispatch({ type: actions.INIT_GAME, game: game }), 80);
      }
       
  }, [table]);

  useEffect(() => {
    if (event?.name === "initGame") {
      handleInit(event.data).then(()=>console.log("handle init game"))
    } else if (event?.name === "placeBet") {
      handlePlaceBet(event.data);
    } else if (event?.name === "insureBet") {
      handlePlaceBet(event.data);
    } else if (event?.name === "doubleBet") {
      handlePlaceBet(event.data);
    } else if (event?.name === "releaseCard") {
      handleRelease(event.data);
    } else if (event?.name === "createNewTurn") {
      handleCreateNewTurn(event.data);
    } else if (event?.name === "splitSlot") {
      handleSplit(event.data);
    } else if (event?.name === "openSlot") {
      handleSlotOpen(event.data);
    } else if (event?.name === "settleGame") {
      handleSettleGame(event.data);
    } else if (event?.name === "finishTournament"||event?.name==="clearGame") {
      console.log("clear game");
      dispatch({ type: actions.CLEAR_GAME, data: {} });
    }
  }, [event]);
  const handleInit = async (gameObj: any) => {
    cardIndex.current=-1;
    if (!tournament || tournament.id != gameObj.tournamentId) {
      const tournamentObj = await tournamentService.findTournament(gameObj.tournamentId);
      if (tournamentObj) initTournament(tournamentObj);
      if(!table||table.id!==gameObj.tableId){
          const tableObj = await tournamentService.findTournamentTable(gameObj.tableId);
          if (tableObj) setTimeout(() => initTable(tableObj), 100);
      }
    }
    dispatch({ type: actions.INIT_GAME, game: gameObj });
    createEvent({ name: "gameInit", topic: "", data: gameObj, delay: 10 });
  };
  const handlePlaceBet = (data: any) => {
    dispatch({ type: actions.PLACE_BET, data: data });
    createEvent({ name: "betPlaced", topic: "", data: data, delay: 10 });
  };
  const handleSettleGame = (data: any) => {
    dispatch({ type: actions.SETTLE_GAME, results: data });
    // createEvent({ name: "gameOver", topic: "", data: data, delay: 3000 });
  };
  const handleCreateNewTurn = (data: any) => {
    dispatch({ type: actions.UPDATE_TURN, data: data });
    // createEvent({ name: "createNewTurn", topic: "", data: action, delay: 0 });
  };
  const handleSplit = (action: any) => {
    dispatch({ type: actions.SLOT_SPLIT, data: action });
    createEvent({ name: "slotSplitted", topic: "", data: { seat: action.seat, slot: action.slot.id }, delay: 500 });
  };
  const handleSlotOpen = (action: any) => {
    dispatch({ type: actions.SLOT_OPEN, data: action });
    createEvent({ name: "slotActivated", topic: "", data: action, delay: 100 });
  };
  const handleRelease = (action: any) => {
    const data = { seatNo: action.seat, cardNo: action.no };
    if (action.seat === 3) {
      const dealerSeat = state.seats.find((s: SeatModel) => s.no === 3);
      if (dealerSeat?.slots[0].cards.length === 0) {
        createEvent({ name: "blankReleased", topic: "", data: null, delay: 400 });
      } else if (dealerSeat?.slots[0].cards.length === 1) {
        createEvent({ name: "blankReplaced", topic: "", data: action, delay: 100 });
        dispatch({ type: actions.HIT_CARD, data });
        return;
      }
    }
    dispatch({ type: actions.HIT_CARD, data });
    createEvent({ name: "cardReleased", topic: "", data, delay: 0 });
  };

  const value = {
    gameId: state.gameId,
    seatOffset: seatOffset,
    round: state.round,
    startSeat: state.startSeat,
    cards: state.cards,
    seats: state.seats,
    status: state.status,
    currentTurn: state.currentTurn,
    results: state.results,
    getCardIndex:()=>{
      return cardIndex.current++;
    }
    // shuffle: () => {},
    // deal: (chips: number) => {
    //   const seat = state.seats.find((s: SeatModel) => s.uid);
    //   if (seat) gameService.deal(state.gameId, seat.no, chips);
    //   // gameService.startGame();
    // },
    // hit: (seatNo: number) => {
    //   console.log("hit on game:" + state.gameId);
    //   createEvent({ name: "turnOver", topic: "", data: { seat: seatNo }, delay: 10 });
    //   gameService.hit(state.gameId);
    // },
    // stand: (seatNo: number) => {
    //   createEvent({ name: "turnOver", topic: "", data: { seat: seatNo }, delay: 10 });
    //   gameService.stand(state.gameId);
    // },
    // double: () => {
    //   console.log("double bet");
    //   gameService.double();
    // },
    // insure: () => {
    //   gameService.insure();
    //   dispatch({ type: actions.INSURE_BET, data: { seatNo: state.currentTurn.seat } });
    // },
    // split: () => {
    //   createEvent({ name: "turnOver", topic: "", data: { seat: state.currentTurn.seat }, delay: 10 });
    //   gameService.split(state.gameId);
    // },
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

export const useGameManager = () => {
  return useContext(GameContext);
};
