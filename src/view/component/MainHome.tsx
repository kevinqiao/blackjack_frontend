import Login from "./Login";

import { useEffect } from "react";
import { useTournamentManager } from "../../service/TournamentManager";
import LobbyHome from "./LobbyHome";
import PlayHome from "./PlayHome";
import { useUserManager } from "../../service/UserManager";

function MainHome() {
  const { table } = useTournamentManager();
  useEffect(() => {
    // window.localStorage.removeItem("users");
    // window.localStorage.removeItem("user");
    // window.localStorage.removeItem("tables");
    // window.localStorage.removeItem("games");
    // window.localStorage.removeItem("turns")
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
