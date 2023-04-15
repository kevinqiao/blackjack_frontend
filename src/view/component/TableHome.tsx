import { useEffect, useState } from "react";
import { TableModel, TournamentModel } from "../../model";
import useCoordManager from "../../service/CoordManager";

function TableHome({ tournament }: { tournament: TournamentModel | null }) {
  const [table, setTable] = useState<TableModel | null>(null);
  const { viewport } = useCoordManager();

  useEffect(() => {}, []);
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: viewport ? viewport["height"] : 0,
      }}
    >
      {table &&
        table.seats.map((s) => (
          <div key={"seat-" + s.no}>
            <div>SeatNo:{s.no}</div>
          </div>
        ))}
    </div>
  );
}

export default TableHome;
