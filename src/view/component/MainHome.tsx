import Login from "./Login";

import { useGameManager } from "../../service/GameManager";
import Loading from "./Loading";
import LobbyHome from "./LobbyHome";
import PlayHome from "./PlayHome";

function MainHome() {
  const { gameId } = useGameManager();
  return (
    <>
      <Loading />
      <Login />
      <LobbyHome />
      <PlayHome />
    </>
  );
}

export default MainHome;
