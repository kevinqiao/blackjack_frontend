import { SeatBetSlot } from "./SeatBetSlot";

export declare type SeatModel = {
  no: number;
  currentSlot: number;
  slots: SeatBetSlot[];
  acted: number[];
  bet: number;
  insurance: number;
  status: number;
};
