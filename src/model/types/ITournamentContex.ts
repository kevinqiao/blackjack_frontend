import { TableSeat } from "./TableSeat";
import { TournamentModel } from "./Tournament";
export interface ITournamentContext {
  seatOffset: number;
  seats: TableSeat[] | null;
  tournament: TournamentModel | null;
  tournaments: TournamentModel[];
  sitDown: (seatNo: number) => void;
  join: (tournament: TournamentModel) => void;
  leave: () => void;
  standup: () => void;
  selectTournament: (t: TournamentModel) => void;
}
