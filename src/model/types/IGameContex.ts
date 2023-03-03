import { CardModel } from "./Card";
import { SeatModel } from "./Seat";
export interface IGameContext {
  gameId: number,
  cards: CardModel[];
  seats: SeatModel[];
  status: number;
  initGame: () => void;
  hit: (seatNo: number) => void;
  hitBlank: () => void;
  hitDealer: () => void;
  split: (seatNo: number) => void;
  switchSlot: (seatNo: number, slot: number) => void;
}
