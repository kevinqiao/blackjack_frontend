import { ActionTurn } from "../model/types/ActionTurn";

export const useTurnDao = () => {

  const updateGameTurn= (data: any) => {
    // console.log(data)
    if (typeof window !== "undefined") {
      const str = window.localStorage.getItem("turns");
      if(!str){
        window.localStorage.setItem("turns", JSON.stringify([data]));
      }else{
        let turns = JSON.parse(str);
       
        const turn  = turns.find((t: ActionTurn) => t.gameId === data.gameId);
        if(turn)
            Object.assign(turn, data);
        else
            turns.push(data)
        window.localStorage.setItem("turns", JSON.stringify(turns));
      }
      
    }
  }
  const removeGameTurn=(gameId:number)=>{
    if (typeof window !== "undefined") {
      const str = window.localStorage.getItem("turns");
      if (typeof str != "undefined" && str != null) {
        let turns = JSON.parse(str);
        if (turns?.length > 0) {
          turns  = turns.filter((t: ActionTurn) => t.gameId !== gameId);
          window.localStorage.setItem("turns", JSON.stringify(turns));
        }
      }
    }
  }
  const findGameTurn = (gameId: number) => {
    if (typeof window !== "undefined") {
      const sts = window.localStorage.getItem("turns");
      if (typeof sts != "undefined" && sts != null) {
        const turns = JSON.parse(sts);
        if (turns?.length > 0)
          return turns.find((t: ActionTurn) => t.gameId === gameId);
      }
    }
    return null;
  }
  const findAll = () => {
    if (typeof window !== "undefined") {
      const sts = window.localStorage.getItem("turns");
      if (typeof sts != "undefined" && sts != null) {
        const turns = JSON.parse(sts);
        return turns;
      }
    }
    return null;
  }
  return { findGameTurn,findAll,updateGameTurn,removeGameTurn }
}

export default useTurnDao
