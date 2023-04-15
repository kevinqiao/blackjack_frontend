import { useEffect } from "react";
import useCoordManager from "../../service/CoordManager";
import { useTournamentManager } from "../../service/TournamentManager";

function Loading() {
  const { viewport } = useCoordManager();
  const { tournament } = useTournamentManager();

  useEffect(() => {}, []);
  console.log(tournament);
  return (
    <>
      {tournament && !tournament.table && !tournament.match ? (
        <div
          style={{
            position: "absolute",
            zIndex: 4000,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: viewport ? viewport["height"] : 0,
            backgroundColor: "grey",
            color: "white",
            fontSize: 30,
          }}
        >
          {tournament.type === 0 && !tournament.table ? <span>Loading Table</span> : null}
          {tournament.type === 1 && !tournament.match ? <span>Loading Match</span> : null}
        </div>
      ) : null}
    </>
  );
}

export default Loading;
