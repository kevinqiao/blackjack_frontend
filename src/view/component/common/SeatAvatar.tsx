import { useCallback } from "react";
import useCoordManager from "../../../service/CoordManager";
import { useTournamentManager } from "../../../service/TournamentManager";
import { useUserManager } from "../../../service/UserManager";

export default function SeatAvatar() {
  const { seatOffset, seats, sitDown } = useTournamentManager();
  const { cardXY, seatCoords } = useCoordManager();
  const { uid, tableId } = useUserManager();

  console.log("seatOffset:" + seatOffset);
  const top = useCallback(
    (seatNo) => {
      if (seatCoords && cardXY) {
        const seatCoord = seatCoords.find((s: any) => s.no === seatNo);
        if (seatCoord) return seatCoord["y"] - 5;
      }
      return 0;
    },
    [uid, seatOffset, seatCoords, seats]
  );

  const left = useCallback(
    (seatNo) => {
      if (seatCoords && cardXY) {
        const seatCoord = seatCoords.find((s: any) => s.no === seatNo);
        if (seatCoord) return seatCoord["x"] - 5;
      }
      return 0;
    },
    [uid, seatOffset, seatCoords, seats]
  );

  return (
    <>
      {seats &&
        [0, 1, 2].map((sno) => {
          const seat = seats.find((s) => {
            let seatNo: number = seatOffset + s.no;
            if (seatNo > 2) seatNo = seatNo - 3;
            if (sno === seatNo) return s;
          });
          const canSit = uid && seats.map((s) => s.uid).includes(uid) ? false : true;
          if (uid && canSit && !seat)
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
                onClick={() => sitDown(sno)}
              >
                <span>Sit</span>
              </div>
            );
          if (uid && seat)
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
                  backgroundColor: "grey",
                  color: "white",
                }}
              >
                <span>uid:{seat.uid}</span>
              </div>
            );
          return null;
        })}
    </>
  );
}
