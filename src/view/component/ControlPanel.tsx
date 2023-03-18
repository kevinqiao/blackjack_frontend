import ActionType from "../../model/types/ActionType";
import useEventSubscriber from "../../service/EventManager";
import { useGameManager } from "../../service/GameManager";
import "./styles.css";

export default function ControlPanel() {
  const { event, createEvent } = useEventSubscriber(["createBust"], []);
  const { currentTurn, hit, split, stand, double, insure, initGame } = useGameManager();

  const startGame = () => {
    initGame();
  };
  const standSeat = () => {
    if (currentTurn) stand(currentTurn.seat);
  };
  const hitCard = () => {
    if (currentTurn && currentTurn?.seat >= 0) {
      hit(currentTurn.seat);
    }
  };
  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-around", width: "100%" }}>
        {currentTurn?.acts?.includes(ActionType.HIT) ? (
          <div
            style={{
              cursor: "pointer",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: 120,
              height: 30,
              backgroundColor: "red",
              color: "white",
            }}
            onClick={() => hitCard()}
          >
            Hit
          </div>
        ) : null}
        <div style={{ height: 10 }} />
        {currentTurn?.acts?.includes(ActionType.STAND) ? (
          <div
            style={{
              cursor: "pointer",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: 120,
              height: 30,
              backgroundColor: "red",
              color: "white",
            }}
            onClick={() => standSeat()}
          >
            Stand
          </div>
        ) : null}
        <div style={{ height: 10 }} />
        {currentTurn?.acts?.includes(ActionType.SPLIT) ? (
          <div
            style={{
              cursor: "pointer",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: 120,
              height: 30,
              backgroundColor: "red",
              color: "white",
            }}
            onClick={() => (currentTurn ? split(currentTurn.seat) : null)}
          >
            Split
          </div>
        ) : null}

        <div style={{ height: 10 }} />
        {currentTurn?.acts?.includes(ActionType.DOUBLE) ? (
          <div
            style={{
              cursor: "pointer",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: 120,
              height: 30,
              backgroundColor: "red",
              color: "white",
            }}
            onClick={() => (currentTurn ? double() : null)}
          >
            Double
          </div>
        ) : null}
        <div style={{ height: 10 }} />

        <div
          style={{
            cursor: "pointer",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: 120,
            height: 30,
            backgroundColor: "red",
            color: "white",
          }}
          onClick={() => createEvent({ name: "gameOver", topic: "", data: null, delay: 0 })}
        >
          Game Over
        </div>

        <div style={{ height: 10 }} />
        <div
          style={{
            cursor: "pointer",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: 120,
            height: 30,
            backgroundColor: "red",
            color: "white",
          }}
          onClick={startGame}
        >
          Initialize
        </div>
      </div>
    </>
  );
}
