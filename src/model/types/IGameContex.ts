import { ActionTurn } from "./ActionTurn";
import { CardModel } from "./Card";
import { SeatModel } from "./Seat";
export interface IGameContext {
  gameId: number,
  startSeat: number,
  cards: CardModel[];
  seats: SeatModel[];
  currentTurn: ActionTurn | null;
  status: number;
  initGame: () => void;
  hit: (seatNo: number) => void;
  stand: (seatNo: number) => void;
  split: (seatNo: number) => void;
  double: () => void;
  insure: () => void;
  switchSlot: (seatNo: number, slot: number) => void;
}
