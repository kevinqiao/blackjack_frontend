import { useEffect } from "react";
import useCoordManager from "../../service/CoordManager";
import { useTournamentManager } from "../../service/TournamentManager";

function Loading() {
  const { viewport } = useCoordManager();
  const { table,tournament } = useTournamentManager();

  useEffect(() => {}, []);

  return (
    <>
      {tournament &&table? (
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
          {tournament.type === 0 ? <span>Loading Table</span> : null}
          {tournament.type === 1 ? <span>Loading Match</span> : null}
        </div>
      ) : null}
    </>
  );
}

export default Loading;
