import React, { createContext, useContext, useEffect } from "react";
import { CardModel, IGameContext, SeatModel } from "../model";
import useEventSubscriber from "./EventManager";

const make_deck = () => {
  const cards: CardModel[] = [];
  let no = 0;
  let j = 0;
  let v = "";
  for (let i = 2; i <= 14; i++) {
    v = i + "";
    switch (i) {
      case 14:
        v = "A";
        break;
      case 11:
        v = "J";
        break;
      case 12:
        v = "Q";
        break;
      case 13:
        v = "K";
        break;
      default:
        break;
    }
    cards[j++] = { no: ++no, value: v, rank: i, suit: "h" };
    cards[j++] = { no: ++no, value: v, rank: i, suit: "d" };
    cards[j++] = { no: ++no, value: v, rank: i, suit: "c" };
    cards[j++] = { no: ++no, value: v, rank: i, suit: "s" };
  }
  console.log(cards);
  return cards;
};
const initialState = {
  gameId: Date.now(),
  cards: make_deck(),
  seats: [
    { no: 0, cards: [4], status: 1 },
    { no: 1, cards: [], status: 1 },
    { no: 2, cards: [], status: 1 },
    { no: 3, cards: [6], status: 1 },
  ],
  status: 0,
};

const actions = {
  INIT_GAME: "INIT_GAME",
  HIT_CARD: "HIT_CARD",
  HIT_BLANK: "HIT_BLANK",
  HIT_DEALER: "HIT_DEALER",
};

const reducer = (state: any, action: any) => {
  switch (action.type) {
    case actions.INIT_GAME:
      return Object.assign({}, state, action.game);
    case actions.HIT_CARD:
      const seat = state.seats.find((s: SeatModel) => s.no === action.data.seatNo);
      seat.cards.push(action.data.cardNo);
      return Object.assign({}, state, { seats: [...state.seats] });
    case actions.HIT_BLANK:
      const dealer = state.seats.find((s: SeatModel) => s.no === 3);
      if (dealer) {
        dealer.cards.push(0);
        return Object.assign({}, state, { seats: [...state.seats] });
      }
      return state;
    case actions.HIT_DEALER:
      const dealerSeat = state.seats.find((s: SeatModel) => s.no === 3);
      if (dealerSeat) {
        const cards = dealerSeat.cards.filter((c: number) => c !== 0);
        cards.push(action.data.cardNo);
        dealerSeat["cards"] = cards;
        return Object.assign({}, state, { seats: [...state.seats] });
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
});

export const GameProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const { event, createEvent } = useEventSubscriber(["resetGame"]);
  useEffect(() => {}, [event]);

  const value = {
    gameId: state.gameId,
    cards: state.cards,
    seats: state.seats,
    status: state.status,
    initGame: () => {
      console.log("initing game...");
      const game = {
        gameId: Date.now(),
        cards: make_deck(),
        seats: [
          { no: 0, cards: [], status: 1 },
          { no: 1, cards: [], status: 1 },
          { no: 2, cards: [], status: 1 },
          { no: 3, cards: [2], status: 1 },
        ],
        status: 0,
      };
      dispatch({ type: actions.INIT_GAME, game: game });
    },
    hit: (seatNo: number) => {
      const releaseds = state.seats.map((s: any) => s["cards"]).flat();
      const toReleases = state.cards.filter((c: CardModel) => !releaseds.includes(c.no));
      const no = Math.floor(Math.random() * toReleases.length);
      const card = toReleases[no];
      if (card) {
        dispatch({ type: actions.HIT_CARD, data: { seatNo, cardNo: card.no } });
        createEvent({ name: "hitCreated", data: { seatNo: seatNo, cardNo: card["no"] } });
      }
    },
    hitDealer: () => {
      const dealer = state.seats.find((s: SeatModel) => s.no === 3);
      if (dealer?.cards.includes(0)) {
        const releaseds = state.seats.map((s: any) => s["cards"]).flat();
        const toReleases = state.cards.filter((c: CardModel) => !releaseds.includes(c.no));
        const no = Math.floor(Math.random() * toReleases.length);
        const card = toReleases[no];
        if (card) {
          dispatch({ type: actions.HIT_DEALER, data: { seatNo: 3, cardNo: card.no } });
          createEvent({ name: "blankReplaced", data: { seatNo: 3, cardNo: card["no"] } });
        }
      }
    },
    hitBlank: () => {
      const dealer = state.seats.find((s: SeatModel) => s.no === 3);
      if (dealer?.cards.length === 1) {
        dispatch({ type: actions.HIT_CARD, data: { seatNo: 3, cardNo: 0 } });
        createEvent({ name: "blankReleased", data: null });
      }
    },
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};
export const useGameManager = () => {
  return useContext(GameContext);
};
