import { useCallback, useMemo } from "react";
import useCoordManager from "../../../service/CoordManager";
import { useGameManager } from "../../../service/GameManager";
import { useTournamentManager } from "../../../service/TournamentManager";
import { useUserManager } from "../../../service/UserManager";

export default function SeatAvatar() {
  const { table, sitDown } = useTournamentManager();
  const { cardXY, seatCoords } = useCoordManager();
  const { uid } = useUserManager();
  const { seats } = useGameManager();
  const { seatOffset } = useGameManager();

  // useEffect(()=>{
  //  console.log("offset:"+seatOffset)
  // },[seatOffset])
  const top = useCallback(
    (seatNo) => {
      if (seatCoords && cardXY) {
        const seatCoord = seatCoords.find((s: any) => s.no === seatNo);
        if (seatCoord) return seatCoord["y"] - 25;
      }
      return 0;
    },
    [uid, seatOffset, seatCoords]
  );

  const left = useCallback(
    (seatNo) => {
      if (seatCoords && cardXY) {
        const seatCoord = seatCoords.find((s: any) => s.no === seatNo);
        if (seatCoord) return seatCoord["x"] - 5;
      }
      return 0;
    },
    [uid, seatOffset, seatCoords]
  );

  const inSeat = useMemo(() => {
    let ok = false;
    if (uid && table?.seats && seats) {
      if (seats.find((s) => s.uid === uid) || table.seats.find((s) => s.uid === uid)) ok = true;
    }
    return ok;
  }, [uid, table, seats]);
  return (
    <>
      {seats &&
        table?.seats &&
        [0, 1, 2].map((sno) => {
          let seatNo: number = sno - seatOffset;
          if (seatNo < 0) seatNo = seatNo + 3;
          const tableSeat = table.seats.find((s) => s.no === seatNo);
          const gameSeat = seats.find((s) => s.no === seatNo);
          if (!inSeat && !tableSeat && !gameSeat)
            return (
              <div
                key={sno}
                style={{
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  position: "absolute",
                  zIndex: 1900,
                  width: 100,
                  height: 25,
                  top: top(sno),
                  left: left(sno),
                  backgroundColor: "grey",
                  color: "white",
                }}
                onClick={() => sitDown(seatNo)}
              >
                <span>Sit({seatNo})</span>
              </div>
            );
          if (gameSeat || tableSeat) {
            let suid = gameSeat ? gameSeat.uid : null;
            if (!suid && tableSeat) suid = tableSeat.uid;
            return (
              <div
                key={sno}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  position: "absolute",
                  zIndex: 1900,
                  width: 100,
                  height: 25,
                  top: top(sno),
                  left: left(sno),
                  backgroundColor: gameSeat ? "blue" : "grey",
                  color: "white",
                }}
              >
                <span>uid:{suid}</span>
              </div>
            );
          }
          return null;
        })}
    </>
  );
}
