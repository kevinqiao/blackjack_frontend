import { ActionTurn } from "./ActionTurn";
import { CardModel } from "./Card";
import { SeatModel } from "./Seat";
import { SlotBattleResult } from "./SlotBattleResult";

export declare type GameModel = {
  gameId: number;
  startSeat: number;
  round: number;
  cards: CardModel[];
  seats: SeatModel[];
  currentTurn: ActionTurn;
  status: number;
  results?: SlotBattleResult[];
};
