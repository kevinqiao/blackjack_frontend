import { TableModel } from "./Table";
import { TableSeat } from "./TableSeat";
import { TournamentModel } from "./Tournament";
export interface ITournamentContext {
  
  table: TableModel|null;
  tournament: TournamentModel | null;
  tournaments: TournamentModel[];
  initTournament:(tournament:TournamentModel)=>void;
  initTable:(table:TableModel)=>void;
  clearTable:()=>void;
  // sitDown: (seatNo: number) => void;
  // join: (tournament: TournamentModel) => void;
  // leave: () => void;
  // standup: () => void;
 // selectTournament: (t: TournamentModel) => void;
}
