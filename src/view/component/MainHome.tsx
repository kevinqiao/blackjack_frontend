import Login from "./Login";

import { useGameManager } from "../../service/GameManager";
import Loading from "./Loading";
import LobbyHome from "./LobbyHome";
import PlayHome from "./PlayHome";
import { useTournamentManager } from "../../service/TournamentManager";

function MainHome() {

  const {table} = useTournamentManager();

  return (
    <>
      {/* <Loading /> */}
      <Login />
      <LobbyHome />
      {table?<PlayHome />:null}
    </>
  );
}

export default MainHome;
