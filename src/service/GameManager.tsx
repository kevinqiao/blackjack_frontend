import React, { createContext, useEffect } from "react";
import { CardModel, GameAction, IGameContext, SeatBetSlot, SeatModel } from "../model";
import useEventSubscriber from "./EventManager";
import useGameService from "./GameService";

const initialState = {
  gameId: 0,
  cards: [],
  seats: [],
  status: 0,
};

const actions = {
  INIT_GAME: "INIT_GAME",
  HIT_CARD: "HIT_CARD",
  HIT_BLANK: "HIT_BLANK",
  HIT_DEALER: "HIT_DEALER",
  SLOT_SPLIT: "SLOT_SPLIT",
  OPEN_SLOT: "SLOT_OPEN",
};

const reducer = (state: any, action: any) => {
  let dealer: SeatModel;
  let slot: SeatBetSlot;
  let seat: SeatModel;
  let card: CardModel;
  switch (action.type) {
    case actions.INIT_GAME:
      return Object.assign({}, state, action.game);
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
      return Object.assign({}, state, { seats: [...state.seats], cards: [...state.cards] });
    case actions.HIT_BLANK:
      dealer = state.seats.find((s: SeatModel) => s.no === 3);
      if (dealer) {
        if (!dealer.slots || dealer.slots.length === 0) dealer.slots = [{ id: Date.now(), cards: [] }];
        dealer.slots[0].cards.push(0);
        return Object.assign({}, state, { seats: [...state.seats] });
      }
      return state;
    case actions.HIT_DEALER:
      dealer = state.seats.find((s: SeatModel) => s.no === 3);
      if (dealer) {
        if (!dealer.slots || dealer.slots.length === 0) dealer.slots = [{ id: Date.now(), cards: [] }];
        dealer.currentSlot = dealer.slots[0].id;
        if (dealer.slots[0]["cards"].length === 0) {
          dealer.slots[0]["cards"].push(...[action.data.cardNo, 0]);
        } else {
          const cards = dealer.slots[0].cards.filter((c: number) => c !== 0);
          cards.push(action.data.cardNo);
          dealer.slots[0]["cards"] = cards;
          const card = state.cards.find((c: CardModel) => c.no === action.data.cardNo);
          card["seat"] = 3;
          card["slot"] = dealer.slots[0].id;
        }
        return Object.assign({}, state, { seats: [...state.seats], cards: [...state.cards] });
      } else return state;
    default:
      return state;
  }
};

const GameContext = createContext<IGameContext>({
  gameId: 0,
  cards: [],
  seats: [],
  status: 0,
  initGame: () => {},
  hit: (seatNo: number) => null,
  hitBlank: () => null,
  hitDealer: () => null,
  split: (seatNo: number) => null,
  switchSlot: (seatNo: number) => null,
});

export const GameProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const { createEvent } = useEventSubscriber(["resetGame"]);
  const { action, createGame, hit, split, stand } = useGameService();
  useEffect(() => {
    if (action?.name === "initGame") {
      handleInit(action);
    } else if (action?.name === "releaseCard") {
      handleRelease(action);
    }
  }, [action]);
  const handleInit = (action: GameAction) => {
    dispatch({ type: actions.INIT_GAME, game: action.data });
  };

  const handleRelease = (action: GameAction) => {
    console.log(action);
    const data = { seatNo: action.seat, cardNo: action.data.no };
    dispatch({ type: actions.HIT_CARD, data });
    createEvent({ name: "hitCreated", data });
    // if (action.seat === 3) {
    //   const dealerSeat = state.seats.find((s: SeatModel) => s.no === 3);
    //   if (dealerSeat.slots?.length > 0 && dealerSeat.slots[0].includes(0))
    //     createEvent({ name: "blankReplaced", data: action.data });
    //   else setTimeout(() => createEvent({ name: "blankReleased", data: null }), 400);
    // }
  };
  const handleHit = (seatNo: number, card: CardModel) => {
    if (card) {
      dispatch({ type: actions.HIT_CARD, data: { seatNo, cardNo: card.no } });
      createEvent({ name: "hitCreated", data: { seatNo: seatNo, cardNo: card["no"] } });
    }
  };

  const value = {
    gameId: state.gameId,
    cards: state.cards,
    seats: state.seats,
    status: state.status,
    initGame: () => {
      console.log("start New Game");
      createGame();
    },
    hit: (seatNo: number) => {
      // const releaseds = state.seats.map((s: any) => s["slots"].map((c: SeatBetSlot) => c["cards"])).flat(2);
      // const toReleases = state.cards.filter((c: CardModel) => !releaseds.includes(c.no));
      // const no = Math.floor(Math.random() * toReleases.length);
      // const card = toReleases[no];
      const card = hit(seatNo);
      if (card) handleHit(seatNo, card);
    },
    hitDealer: () => {
      const releaseds = state.seats.map((s: any) => s["slots"].map((c: SeatBetSlot) => c["cards"])).flat(2);
      const toReleases = state.cards.filter((c: CardModel) => !releaseds.includes(c.no));
      const no = Math.floor(Math.random() * toReleases.length);
      const card = toReleases[no];
      if (card) {
        const dealer = state.seats.find((s: SeatModel) => s.no === 3);
        let phase = !dealer.slots || dealer.slots.length === 0 ? 0 : 1;
        if (phase === 1 && dealer.slots[0]["cards"].includes(0)) phase = 2;
        dispatch({ type: actions.HIT_DEALER, data: { seatNo: 3, cardNo: card.no } });
        if (phase === 0) {
          createEvent({ name: "hitCreated", data: { seatNo: 3, cardNo: card["no"] } });
          setTimeout(() => createEvent({ name: "blankReleased", data: null }), 800);
        } else if (phase === 2) {
          createEvent({ name: "blankReplaced", data: { seatNo: 3, cardNo: card["no"] } });
        } else createEvent({ name: "hitCreated", data: { seatNo: 3, cardNo: card["no"] } });
      }
    },
    hitBlank: () => {
      dispatch({ type: actions.HIT_CARD, data: { seatNo: 3, cardNo: 0 } });
      createEvent({ name: "blankReleased", data: null });
    },
    split: (seatNo: number) => {
      dispatch({ type: actions.SLOT_SPLIT, data: { seatNo: seatNo } });
      createEvent({ name: "betSplited", data: { seatNo: seatNo } });
    },
    switchSlot: (seatNo: number, slot: number) => {
      console.log(seatNo + ":" + slot);
      dispatch({ type: actions.OPEN_SLOT, data: { seatNo, slot } });
      createEvent({ name: "betSwitched", data: { seatNo, slot } });
    },
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};
