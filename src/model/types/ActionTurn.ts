export declare type ActionTurn = {
  id: number;
  round: number;
  expireTime: number | undefined;
  acts: number[];
  seat: number;
  data: any | null;
};
