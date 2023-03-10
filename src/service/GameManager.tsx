import React, { createContext, useContext, useEffect } from "react";
import { CardModel, GameAction, IGameContext, SeatBetSlot, SeatModel } from "../model";
import useEventSubscriber from "./EventManager";
import useGameService from "./GameService";

const initialState = {
  gameId: 0,
  cards: [],
  seats: [],
  currentTurn: null,
  status: 0,
};

const actions = {
  INIT_GAME: "INIT_GAME",
  HIT_CARD: "HIT_CARD",
  HIT_DEALER: "HIT_DEALER",
  UPDATE_TURN: "UPDATE_TURN",
  SLOT_SPLIT: "SLOT_SPLIT",
  OPEN_SLOT: "SLOT_OPEN",
};

const reducer = (state: any, action: any) => {
  let slot: SeatBetSlot;
  let seat: SeatModel;
  let card: CardModel;
  switch (action.type) {
    case actions.INIT_GAME:
      return Object.assign({}, state, action.game);
    case actions.UPDATE_TURN:
      return Object.assign({}, state, { currentTurn: action.data });
    case actions.SLOT_SPLIT:
      seat = state.seats.find((s: SeatModel) => s.no === action.data.seatNo);
      if (!seat) return state;
      const currentSlot = seat.slots.find((s) => s.id === seat.currentSlot);
      if (!currentSlot || currentSlot.cards.length !== 2) return state;
      slot = { id: Date.now(), cards: [currentSlot.cards[1]] };
      seat.slots.push(slot);
      currentSlot.cards.splice(1, 1);
      card = state.cards.find((c: CardModel) => c.no === slot["cards"][0]);
      card["slot"] = slot["id"];
      return Object.assign({}, state, { seats: [...state.seats] });
    case actions.OPEN_SLOT:
      seat = state.seats.find((s: SeatModel) => s.no === action.data.seatNo);
      if (!seat) return state;
      seat.currentSlot = action.data.slot;
      return Object.assign({}, state, { seats: [...state.seats], cards: [...state.cards] });
    case actions.HIT_CARD:
      seat = state.seats.find((s: SeatModel) => s.no === action.data.seatNo);
      if (!seat) return state;
      if (!seat.slots || seat.slots.length === 0) {
        slot = { id: Date.now(), cards: [action.data.cardNo] };
        seat.slots = [slot];
        seat.currentSlot = slot["id"];
      } else {
        const cslot = seat.slots.find((s: SeatBetSlot) => seat.currentSlot === s.id);
        if (cslot) cslot.cards.push(action.data.cardNo);
      }
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
  cards: [],
  seats: [],
  status: 0,
  currentTurn: null,
  initGame: () => {},
  hit: (seatNo: number) => null,
  split: (seatNo: number) => null,
  stand: (seatNo: number) => null,
  switchSlot: (seatNo: number) => null,
});

export const GameProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const { createEvent } = useEventSubscriber(["resetGame"]);
  const { action, createGame, hit, split, switchSlot, stand } = useGameService();
  useEffect(() => {
    if (action?.name === "initGame") {
      handleInit(action);
    } else if (action?.name === "releaseCard") {
      setTimeout(() => handleRelease(action), 20);
    } else if (action?.name === "createNewTurn") {
      handleCreateNewTurn(action);
    }
  }, [action]);
  const handleInit = (action: GameAction) => {
    dispatch({ type: actions.INIT_GAME, game: action.data });
  };
  const handleCreateNewTurn = (action: GameAction) => {
    dispatch({ type: actions.UPDATE_TURN, data: action.data });
    createEvent({ name: "createNewTurn", data: action.data });
  };
  const handleRelease = (action: GameAction) => {
    const data = { seatNo: action.data.seat, cardNo: action.data.no };
    dispatch({ type: actions.HIT_CARD, data });
    setTimeout(() => createEvent({ name: "hitCreated", data }), 20);
    if (action.data.seat === 3) {
      const dealerSeat = state.seats.find((s: SeatModel) => s.no === 3);
      if (dealerSeat?.slots?.length === 1)
        setTimeout(() => createEvent({ name: "blankReplaced", data: action.data }), 20);
      else if (dealerSeat?.slots?.length === 0)
        setTimeout(() => createEvent({ name: "blankReleased", data: null }), 400);
    }
  };

  const value = {
    gameId: state.gameId,
    cards: state.cards,
    seats: state.seats,
    status: state.status,
    currentTurn: state.currentTurn,
    initGame: () => {
      console.log("start New Game");
      createGame();
    },
    hit: (seatNo: number) => {
      setTimeout(() => createEvent({ name: "turnOver", data: { seat: seatNo } }), 10);
      hit(seatNo);
      // if (card) handleHit(seatNo, card);
    },
    stand: (seatNo: number) => {
      setTimeout(() => createEvent({ name: "turnOver", data: { seat: seatNo } }), 10);
      stand(seatNo);
    },
    split: (seatNo: number) => {
      split(seatNo);
      // dispatch({ type: actions.SLOT_SPLIT, data: { seatNo: seatNo } });
      // createEvent({ name: "betSplited", data: { seatNo: seatNo } });
    },
    switchSlot: (seatNo: number, slot: number) => {
      switchSlot(seatNo, slot);
      // console.log(seatNo + ":" + slot);
      // dispatch({ type: actions.OPEN_SLOT, data: { seatNo, slot } });
      // createEvent({ name: "betSwitched", data: { seatNo, slot } });
    },
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

export const useGameManager = () => {
  return useContext(GameContext);
};
