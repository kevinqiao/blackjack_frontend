import { GameModel } from "../model/types/Game";
const useGameDao = () => {

  const updateWithLock = (data: any, ver: number): GameModel | null => {
    let gameObj = null;
    if (typeof window !== "undefined") {
      const gamestr = window.localStorage.getItem("game");
      if (typeof gamestr != "undefined" && gamestr != null) {
        gameObj = JSON.parse(gamestr);
        if (gameObj.ver === ver) {
          Object.assign(gameObj, data, { timestamp: 0 });
          window.localStorage.setItem("game", JSON.stringify(gameObj));
        }
      }
    }
    return gameObj;
  }
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
  const findWithLock = (id: number): GameModel | null => {

    if (typeof window !== "undefined") {
      const gamestr = window.localStorage.getItem("game");

      if (typeof gamestr != "undefined" && gamestr != null) {
        const game = JSON.parse(gamestr);
        if (game != null && (game.ver === 0 || Date.now() - game.ver > 400)) {
          game.ver = Date.now();
          window.localStorage.setItem("game", JSON.stringify(game));
          return game
        }
      }
    }
    return null;
  }
  return { find, findWithLock, create, update, updateWithLock, remove }
}

export default useGameDao
