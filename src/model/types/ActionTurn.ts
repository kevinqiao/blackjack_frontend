export declare type ActionTurn = {
  id: number;
  gameId:number;
  round: number;
  expireTime: number;
  acts: number[];
  seat: number;
  data: any | null;
};
