import React, { createContext, useContext, useEffect } from "react";
import { CardModel, IGameContext, SeatBetSlot, SeatModel } from "../model";
import useEventSubscriber from "./EventManager";
import useGameService from "./GameService";

const initialState = {
  gameId: 0,
  cards: [],
  seats: [],
  currentTurn: null,
  results: [],
  status: 0,
};

const actions = {
  INIT_GAME: "INIT_GAME",
  HIT_CARD: "HIT_CARD",
  HIT_DEALER: "HIT_DEALER",
  UPDATE_TURN: "UPDATE_TURN",
  SLOT_SPLIT: "SLOT_SPLIT",
  SLOT_OPEN: "SLOT_OPEN",
  SETTLE_GAME: "GAME_SETTLE",
};

const reducer = (state: any, action: any) => {
  let slot: SeatBetSlot;
  let seat: SeatModel;
  let card: CardModel;
  switch (action.type) {
    case actions.INIT_GAME:
      return Object.assign({}, state, action.game);
    case actions.SETTLE_GAME:
      return Object.assign({}, state, { results: action.results });
    case actions.UPDATE_TURN:
      return Object.assign({}, state, { currentTurn: action.data });
    case actions.SLOT_SPLIT:
      const seatNo = action.data.seat;
      slot = action.data.slot;
      seat = state.seats.find((s: SeatModel) => s.no === seatNo);
      const currentSlot = seat.slots.find((s) => s.id === seat.currentSlot);
      if (currentSlot) {
        const cards = currentSlot.cards.filter((c) => c !== slot.cards[0]);
        currentSlot.cards = cards;
        seat.slots.push(slot);
        card = state.cards.find((c: CardModel) => c.no === cards[0]);
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
  startSeat: -1,
  cards: [],
  seats: [],
  status: 0,
  currentTurn: null,
  results: [],
  initGame: () => {},
  hit: (seatNo: number) => null,
  split: (seatNo: number) => null,
  stand: (seatNo: number) => null,
  switchSlot: (seatNo: number) => null,
  insure: () => null,
  double: () => null,
});

export const GameProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const { event, createEvent } = useEventSubscriber(
    ["initGame", "settleGame", "releaseCard", "createNewTurn", "splitSlot", "openSlot"],
    ["model"]
  );
  const { createGame, hit, split, switchSlot, stand } = useGameService();
  useEffect(() => {
    if (event?.name === "initGame") {
      handleInit(event.data);
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
    }
  }, [event]);
  const handleInit = (action: any) => {
    console.log("hanlde initing game");
    dispatch({ type: actions.INIT_GAME, game: action });
    createEvent({ name: "gameStart", topic: "", data: action, delay: 10 });
  };
  const handleSettleGame = (data: any) => {
    dispatch({ type: actions.SETTLE_GAME, results: data });
    createEvent({ name: "gameOver", topic: "", data: data, delay: 3000 });
  };
  const handleCreateNewTurn = (action: any) => {
    dispatch({ type: actions.UPDATE_TURN, data: action });
    // createEvent({ name: "createNewTurn", topic: "", data: action, delay: 0 });
  };
  const handleSplit = (action: any) => {
    dispatch({ type: actions.SLOT_SPLIT, data: action });
    createEvent({ name: "slotSplitted", topic: "", data: { seat: action.seat, slot: action.slot.id }, delay: 300 });
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
    startSeat: state.startSeat,
    cards: state.cards,
    seats: state.seats,
    status: state.status,
    currentTurn: state.currentTurn,
    results: state.results,
    initGame: () => {
      console.log("start New Game");
      createGame();
    },
    hit: (seatNo: number) => {
      createEvent({ name: "turnOver", topic: "", data: { seat: seatNo }, delay: 10 });
      hit(seatNo);
      // if (card) handleHit(seatNo, card);
    },
    stand: (seatNo: number) => {
      createEvent({ name: "turnOver", topic: "", data: { seat: seatNo }, delay: 10 });
      stand(seatNo);
    },
    double: () => {
      console.log("double bet");
      return;
    },
    insure: () => {
      console.log("make insurence");
      return;
    },
    split: (seatNo: number) => {
      createEvent({ name: "turnOver", topic: "", data: { seat: seatNo }, delay: 10 });
      split(seatNo);
    },
    switchSlot: (seatNo: number, slot: number) => {
      switchSlot(seatNo, slot);
    },
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

export const useGameManager = () => {
  return useContext(GameContext);
};
