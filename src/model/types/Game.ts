import { CardModel } from "./Card";
import { GameAction } from "./GameAction";
import { SeatModel } from "./Seat";

export declare type GameModel = {
  gameId: number;
  round: number;
  cards: CardModel[];
  seats: SeatModel[];
  currentAction: GameAction | null;
  status: number;
};
