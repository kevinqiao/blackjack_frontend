import { GameModel } from "../model/types/Game";

const useGameDao = () => {


  const update = (data: any) => {
    window.localStorage.setItem("game", JSON.stringify(data));
  }
  const create = (gameModel: GameModel) => {
    window.localStorage.setItem("game", JSON.stringify(gameModel))
  }
  const remove = () => {
    window.localStorage.removeItem("game")
  }
  const find = (): GameModel | null => {

    if (typeof window !== "undefined") {
      const gamestr = window.localStorage.getItem("game");
      if (typeof gamestr != "undefined" && gamestr != null)
        return JSON.parse(gamestr);
    }
    return null;
  }
  return { find, create, update, remove }
}
export default useGameDao
