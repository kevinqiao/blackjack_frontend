import Login from "./Login";

import { useEffect } from "react";
import { useTournamentManager } from "../../service/TournamentManager";
import LobbyHome from "./LobbyHome";
import PlayHome from "./PlayHome";

function MainHome() {
  const { table } = useTournamentManager();
  useEffect(() => {
    // window.localStorage.removeItem("users");
    // window.localStorage.removeItem("user");
    // window.localStorage.removeItem("tables");
    // window.localStorage.removeItem("games");
  }, []);

  return (
    <>
      {/* <Loading /> */}
      <Login />
      <LobbyHome />
      {table ? <PlayHome /> : null}
    </>
  );
}

export default MainHome;
