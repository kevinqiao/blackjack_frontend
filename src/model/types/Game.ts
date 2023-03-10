import { ActionTurn } from "./ActionTurn";
import { CardModel } from "./Card";
import { SeatModel } from "./Seat";

export declare type GameModel = {
  gameId: number;
  round: number;
  cards: CardModel[];
  seats: SeatModel[];
  currentTurn: ActionTurn;
  status: number;
};
