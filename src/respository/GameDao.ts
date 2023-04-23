import { GameModel } from "../model/types/Game";
const useGameDao = () => {

  const updateWithLock = (data: any, ver: number): GameModel | null => {
    let game = null;
    if (typeof window !== "undefined") {
      const gamestr = window.localStorage.getItem("games");
      if (typeof gamestr != "undefined" && gamestr != null) {
        const games = JSON.parse(gamestr);
        if (games?.length > 0) {
          game = games.find((t: GameModel) => t.gameId == data.gameId);
          if (game.ver === ver) {
            Object.assign(game, data, { timestamp: 0 });
            window.localStorage.setItem("games", JSON.stringify(games));
          }
        }
      }
    }
    return game;
  }

  const create = (gameModel: GameModel) => {
    if (typeof window !== "undefined") {
      let games = []
      const gamestr = window.localStorage.getItem("games");
      if (gamestr != null) {
        games = JSON.parse(gamestr);
      }
      games.push(gameModel);
      window.localStorage.setItem("games", JSON.stringify(games));
    }
  }

  const find = (gameId:number): GameModel | null => {

    if (typeof window !== "undefined") {
      const gamestr = window.localStorage.getItem("games");
      if (typeof gamestr != "undefined" && gamestr != null) {
        const games = JSON.parse(gamestr);
        if (games?.length > 0)
          return games.find((t: GameModel) => t.gameId === gameId);
      }
    }
    return null;
  }
  const findWithLock = (id: number): GameModel | null => {

    let game = null;
    if (typeof window !== "undefined") {
      const gamestr = window.localStorage.getItem("games");

      if (typeof gamestr != "undefined" && gamestr != null) {
        const games = JSON.parse(gamestr);

        game = games.find((t: GameModel) => t.gameId === id);

        if (game != null && (game.ver === 0 || Date.now() - game.ver > 400)) {
          game.ver = Date.now();
          window.localStorage.setItem("games", JSON.stringify(games));
          return game
        }
      }
    }
    return null;
  }
  return { find, findWithLock, create, updateWithLock}
}

export default useGameDao
