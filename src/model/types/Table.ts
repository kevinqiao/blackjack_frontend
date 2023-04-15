import { TableSeat } from "./TableSeat";

export declare type TableModel = {
  id: number;
  size: number;
  seats: TableSeat[];
  tournamentId: number;
  games: number[];
  status: number;
  ver: number
};
