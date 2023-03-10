import { useEffect, useState } from "react";
import ActionType from "../../model/types/ActionType";
import { useGameManager } from "../../service/GameManager";
import "./styles.css";

export default function ControlPanel() {
  const [active, setActive] = useState(false);
  const { currentTurn, hit, split, stand, initGame } = useGameManager();
  // console.log(currentTurn);
  useEffect(() => {
    if (currentTurn?.act === ActionType.ALL) setActive(true);
  }, [currentTurn]);
  const startGame = () => {
    setActive(false);
    initGame();
  };
  const standSeat = () => {
    setActive(false);
    if (currentTurn) stand(currentTurn.seat);
  };
  const hitCard = () => {
    setActive(false);
    console.log(currentTurn);
    if (currentTurn && currentTurn?.seat >= 0) {
      console.log("hit card");
      hit(currentTurn.seat);
    }
  };
  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-around", width: "100%" }}>
        {/* <div
          style={{
            cursor: "pointer",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: 120,
            height: 35,
            backgroundColor: seat === 0 ? "red" : "grey",
            color: "white",
          }}
          onClick={() => setSeat(0)}
        >
          Seat 0
        </div>
        <div style={{ width: 50 }}></div>
        <div
          style={{
            cursor: "pointer",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: 120,
            height: 35,
            backgroundColor: seat === 1 ? "red" : "grey",
            color: "white",
          }}
          onClick={() => setSeat(1)}
        >
          Seat 1
        </div>
        <div style={{ width: 50 }}></div>
        <div
          style={{
            cursor: "pointer",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: 120,
            height: 35,
            backgroundColor: seat === 2 ? "red" : "grey",
            color: "white",
          }}
          onClick={() => setSeat(2)}
        >
          Seat 2
        </div>
        <div style={{ width: 50 }}></div>
        <div
          style={{
            cursor: "pointer",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: 120,
            height: 35,
            backgroundColor: seat === 3 ? "red" : "grey",
            color: "white",
          }}
          onClick={() => setSeat(3)}
        >
          Dealer
        </div>
      </div> */}
        {currentTurn?.act === ActionType.ALL && active ? (
          <>
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
              onClick={() => standSeat()}
            >
              Stand
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
              onClick={() => (currentTurn ? split(currentTurn.seat) : null)}
            >
              Split
            </div>
          </>
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
          onClick={startGame}
        >
          Initialize
        </div>
      </div>
    </>
  );
}
