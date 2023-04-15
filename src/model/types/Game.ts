import { ActionTurn } from "./ActionTurn";
import { CardModel } from "./Card";
import { SeatModel } from "./Seat";
import { SlotBattleResult } from "./SlotBattleResult";

export declare type GameModel = {
  gameId: number;
  ver: number;
  tournamentId: number;
  tableId: number;
  startSeat: number;
  round: number;//0-place bet 1-in play 2-settled
  cards: CardModel[];
  seats: SeatModel[];
  currentTurn: ActionTurn;
  status: number;
  results?: SlotBattleResult[];
};
