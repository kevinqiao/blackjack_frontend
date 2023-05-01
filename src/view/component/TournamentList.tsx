import { TournamentModel } from "../../model";
import useCoordManager from "../../service/CoordManager";
import { useTournamentManager } from "../../service/TournamentManager";
import useTournamentService from "../../service/TournamentService";
import { useUserManager } from "../../service/UserManager";

const TournamentList = () => {
  const { viewport } = useCoordManager();
  const { tournaments} = useTournamentManager();
  const tournamentService = useTournamentService();
 
  const join=(t:TournamentModel)=>{
    if(tournamentService){
        tournamentService.join(t);
    }
  }
  return (
    <div
      style={{
        position:"absolute",
        zIndex:100,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: viewport ? viewport["height"] : 0,
      }}
    >
      {tournaments.map((t) => (
        <div
          key={t.id}
          style={{ display: "flex", flexDirection: "column", justifyContent: "space-around", width: 400 }}
        >
          <div
            style={{
              cursor: "pointer",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: 230,
              height: 40,
              borderRadius: 5,
              backgroundColor: "red",
              color: "white",
            }}
            onClick={() => join(t)}
          >
            T({t.id})[{t.type}]
          </div>
        </div>
      ))}
    </div>
  );
};
export default TournamentList;
