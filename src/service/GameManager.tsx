import React, { createContext, useContext, useEffect, useMemo } from "react";
import { CardModel, IGameContext, SeatBetSlot, SeatModel } from "../model";
import ActionType from "../model/types/ActionType";
import useGameDao from "../respository/GameDao";
import useEventSubscriber from "./EventManager";
import useGameService from "./GameService";
import { useTournamentManager } from "./TournamentManager";
import useTournamentService from "./TournamentService";
import { useUserManager } from "./UserManager";

const initialState = {
  gameId: 0,
  round: 0,
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
  START_GAME: "START_GAME",
  HIT_CARD: "HIT_CARD",
  HIT_DEALER: "HIT_DEALER",
  UPDATE_TURN: "UPDATE_TURN",
  SLOT_SPLIT: "SLOT_SPLIT",
  SLOT_OPEN: "SLOT_OPEN",
  SETTLE_GAME: "GAME_SETTLE",
  CLEAR_GAME:"CLEAR_GAME"
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
        return Object.assign({}, state, { round: 1, seats: state.seats });
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
    case actions.START_GAME:
      return Object.assign({}, state, action.data);
    case actions.SETTLE_GAME:
      return Object.assign({}, state, { results: action.results });
    case actions.UPDATE_TURN:
      const expire = action.data.expireTime + Date.now();
      return Object.assign({}, state, { currentTurn: { ...action.data, expireTime: expire } });
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
  round: 0,
  startSeat: -1,
  cards: [],
  seats: [],
  status: 0,
  currentTurn: null,
  results: [],
  deal: () => null,
  shuffle: () => null,
  hit: (seatNo: number) => null,
  split: () => null,
  stand: (seatNo: number) => null,
  insure: () => null,
  double: () => null,
});

export const GameProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const { event, createEvent } = useEventSubscriber(
    ["initGame", "placeBet", "startGame", "settleGame", "releaseCard", "createNewTurn", "splitSlot", "openSlot","finishTournament"],
    ["model"]
  );

  const tournamentService = useTournamentService();
  const {tournament,initTournament,initTable} = useTournamentManager();
  const gameService = useGameService();
  const gameDao = useGameDao();
  const { uid,tableId} = useUserManager();
  useEffect(()=>{

    if(gameService &&tableId>0){
      const tableObj = tournamentService.findTable(tableId);
   
      if(tableObj?.status===0){
             const tournamentObj = tournamentService.findTournament(tableObj.tournamentId);
             initTournament(tournamentObj);
             setTimeout(()=>initTable(tableObj),50);
             if(tableObj.games?.length>0){
                const game = gameDao.find(tableObj.games[tableObj.games.length-1])
                if(game)
                   setTimeout(()=>  dispatch({ type: actions.INIT_GAME, game: game }),80)
             }
      } 
    }
  },[tableId])
  useEffect(()=>{
        // window.localStorage.removeItem("games")
  },[])
  useEffect(() => {
    if (event?.name === "initGame") {
      handleInit(event.data);
    } else if (event?.name === "placeBet") {
      handlePlaceBet(event.data);
    } else if (event?.name === "insureBet") {
      handlePlaceBet(event.data);
    } else if (event?.name === "doubleBet") {
      handlePlaceBet(event.data);
    } else if (event?.name === "startGame") {
      handleStartGame(event.data);
    } else if (event?.name === "releaseCard") {
      handleRelease(event.data);
    } else if (event?.name === "createNewTurn") {
      handleCreateNewTurn(event.data);
    } else if (event?.name === "splitSlot") {
      handleSplit(event.data);
    } else if (event?.name === "openSlot") {
      handleSlotOpen(event.data);
    } else if (event?.name === "settleGame") {
      console.log(event);
      handleSettleGame(event.data);
    }else if(event?.name==="finishTournament"){
      console.log("clear game");
      dispatch({type:actions.CLEAR_GAME,data:{}})
    }
  }, [event]);
  const handleInit = (gameObj: any) => {
   
    if(!tournament||tournament.id!=gameObj.tournamentId){
            const tournamentObj = tournamentService.findTournament(gameObj.tournamentId);
            const tableObj= tournamentService.findTable(gameObj.tableId);
            if(tournamentObj)initTournament(tournamentObj);
            if(tableObj)setTimeout(()=>initTable(tableObj),100)         
    }
    dispatch({ type: actions.INIT_GAME, game: gameObj });
    createEvent({ name: "gameInit", topic: "", data: gameObj, delay: 10 });
  };
  const handlePlaceBet = (data: any) => {
    dispatch({ type: actions.PLACE_BET, data: data });
    createEvent({ name: "betPlaced", topic: "", data: data, delay: 10 });
  };
  const handleStartGame = (data: any) => {
    dispatch({ type: actions.START_GAME, data: data });
    createEvent({ name: "gameStart", topic: "", data: data, delay: 10 });
  };
  const handleSettleGame = (data: any) => {
    dispatch({ type: actions.SETTLE_GAME, results: data });
    createEvent({ name: "gameOver", topic: "", data: data, delay: 3000 });
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
  const seatOffset = useMemo(() => {
    let offset = 0;
    if (Boolean(uid) && state.seats?.length > 0) {
      const seat = state.seats.find((s: SeatModel) => s.uid === uid);
      if(seat)
        offset = 3 - seat.no < 3 ? 3 - seat.no : 0;
    }
    return offset;
  }, [uid, state.seats]);

  const value = {
    gameId: state.gameId,
    round: state.round,
    startSeat: state.startSeat,
    cards: state.cards,
    seats: state.seats,
    status: state.status,
    currentTurn: state.currentTurn,
    results: state.results,

    shuffle: () => {

    },
    deal: ( chips: number) => {
      const seat =state.seats.find((s:SeatModel)=>s.uid);
      if(seat)
        gameService.deal(state.gameId,seat.no, chips);
      // gameService.startGame();
    },
    hit: (seatNo: number) => {
      console.log("hit on game:"+state.gameId)
      createEvent({ name: "turnOver", topic: "", data: { seat: seatNo }, delay: 10 });
      gameService.hit(state.gameId);
 
    },
    stand: (seatNo: number) => {
      createEvent({ name: "turnOver", topic: "", data: { seat: seatNo }, delay: 10 });
      gameService.stand(state.gameId);
    },
    double: () => {
      console.log("double bet");
      gameService.double();
    },
    insure: () => {
      gameService.insure();
      dispatch({ type: actions.INSURE_BET, data: { seatNo: state.currentTurn.seat } });
    },
    split: () => {
      createEvent({ name: "turnOver", topic: "", data: { seat: state.currentTurn.seat }, delay: 10 });
      gameService.split(state.gameId);
    },
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

export const useGameManager = () => {
  return useContext(GameContext);
};
