import { ActionTurn } from "./ActionTurn";
import { CardModel } from "./Card";
import { SeatModel } from "./Seat";
import { SlotBattleResult } from "./SlotBattleResult";
export interface IGameContext {
  gameId: number,
  round: number,
  startSeat: number,
  cards: CardModel[];
  seats: SeatModel[];
  currentTurn: ActionTurn | null;
  status: number;
  results: SlotBattleResult[];
  initGame: () => void;
  deal: (seatNo: number, chips: number) => void;
  shuffle: () => void;
  hit: (seatNo: number) => void;
  stand: (seatNo: number) => void;
  split: () => void;
  double: () => void;
  insure: () => void;
  switchSlot: (seatNo: number, slot: number) => void;
}
