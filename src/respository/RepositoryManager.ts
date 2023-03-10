import { useEffect, useState } from "react";
import { GameModel } from "../model/types/Game";

const useGameDao = () => {
  const [game, setGame] = useState<GameModel | null>(null);
  useEffect(() => {
    if (typeof window !== "undefined") {
      const gamestr = window.localStorage.getItem("game");
      if (gamestr)
        setGame(JSON.parse(gamestr));
    }
  }, [])
  const update = (data: any) => {
    window.localStorage.setItem("game", JSON.stringify(data));
    setGame(data)

  }
  const create = (gameModel: GameModel) => {
    window.localStorage.setItem("game", JSON.stringify(gameModel))
    setGame(gameModel)
  }
  return { game, create, update }
}
export default useGameDao
