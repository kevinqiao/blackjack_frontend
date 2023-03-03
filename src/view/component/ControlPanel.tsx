import { useState } from "react";
import { useGameManager } from "../../service/GameManager";

import "./styles.css";

export default function ControlPanel() {
  const [seat, setSeat] = useState(0);
  const { hit, split, hitBlank, hitDealer, initGame } = useGameManager();
  const hitSeat = () => {
    if (seat === 3) hitDealer();
    else hit(seat);
  };

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-around", width: "100%" }}>
        <div
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
      </div>
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
        onClick={() => hitSeat()}
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
        onClick={() => (seat < 3 ? split(seat) : null)}
      >
        Split
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
        onClick={() => hitDealer()}
      >
        Hit Dealer
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
        onClick={initGame}
      >
        Initialize
      </div>
    </>
  );
}
