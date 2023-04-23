import useCoordManager from "../../service/CoordManager";
import useEventSubscriber from "../../service/EventManager";
import { useTournamentManager } from "../../service/TournamentManager";
import "./table.css";

const PlayTable = () => {
  const { viewport } = useCoordManager();
  const { table} = useTournamentManager();
  const { event, createEvent } = useEventSubscriber([""], []);

  return (
    <>
      {table ? (
        <div
          style={{
            position: "absolute",
            zIndex:500,
            top: 0,
            left: 0,
            width: "100%",
            height: viewport ? viewport["height"] : 0,
            margin: "0px 0px 0px 0px",
            padding: "0px 0px 0px 0px",
            border: "none",
            overflow: "hidden",
          }}
        >
          <div
            className="table"
            style={{
              width: "100%",
              padding: 0,
              margin: 0,
              height: viewport ? viewport["height"] - 200 : 0,
              overflow: "hidden",
            }}
          ></div>
          <div
            style={{
              backgroundImage: `url("/images/table.jpg")`,
              width: "100%",
              height: 200,
            }}
          ></div>
        </div>
      ) : null}
    </>
  );
};
export default PlayTable;
