import { MatchModel } from "./Match";
import { TableModel } from "./Table";

export declare type TournamentModel = {
  id: number;
  type: number;//0-free 1-buyin 2-friends
  table: TableModel | null;
  match: MatchModel | null;
  buyInAmount: number;
  rewards: [];
  buyInAsset: number;
  rewardAsset: number;
  startingStack: number;
  minPlayers: number;
  rounds: number;
  minBet: number;
  maxBet: number;
  status: number;//0-open 1-in work
  toMatch: any[];
  ver: number;
};
