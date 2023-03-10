import { useMemo } from "react";
import useEventSubscriber from "../../service/EventManager";
import "../../styles.css";

const PokeCard = ({ height, width, card }: any) => {
  const { event, createEvent } = useEventSubscriber(["cardReleased", "gameOver"], []);
  const faceImg = useMemo(() => {
    let url = "";
    switch (card["suit"]) {
      case "h":
        url = card["value"].toUpperCase() + "H.gif";
        break;
      case "s":
        url = card["value"].toUpperCase() + "S.gif";
        break;
      case "d":
        url = card["value"].toUpperCase() + "D.gif";
        break;
      case "c":
        url = card["value"].toUpperCase() + "C.gif";
        break;
      default:
        break;
    }
    return `url("/images/faces/${url}")`;
  }, [card]);
  return (
    <div
      style={{
        position: "relative",
        top: 0,
        left: 0,
        width: width,
        height: height,
        border: "none",
      }}
    >
      <div
        className="grid-card"
        style={{
          width: width,
          height: height,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundImage: card["rank"] > 10 ? faceImg : "none",
          backgroundSize: "contain",
        }}
      >
        <div className="card-top-left">
          {card["value"]}
          <br />
          {card["suit"] === "h" ? <div style={{ color: "red" }}>{"♥"}</div> : null}
          {card["suit"] === "d" ? <div style={{ color: "red" }}>{"♦"}</div> : null}
          {card["suit"] === "s" ? <div style={{ color: "black" }}>{"♠"}</div> : null}
          {card["suit"] === "c" ? <div style={{ color: "black" }}>{"♣"}</div> : null}
        </div>
        <div></div>
        <div></div>
        <div></div>
        <div className="suit">
          {card["rank"] <= 10 ? (
            <>
              {card["suit"] === "h" ? <div style={{ color: "red" }}>{"♥"}</div> : null}
              {card["suit"] === "d" ? <div style={{ color: "red" }}>{"♦"}</div> : null}
              {card["suit"] === "s" ? <div style={{ color: "black" }}>{"♠"}</div> : null}
              {card["suit"] === "c" ? <div style={{ color: "black" }}>{"♣"}</div> : null}
            </>
          ) : null}
        </div>
        <div></div>
        <div></div>
        <div></div>

        <div className="card-bottom-right">
          {card["value"]}
          <br />
          {card["suit"] === "h" ? <div style={{ color: "red" }}>{"♥"}</div> : null}
          {card["suit"] === "d" ? <div style={{ color: "red" }}>{"♦"}</div> : null}
          {card["suit"] === "s" ? <div style={{ color: "black" }}>{"♠"}</div> : null}
          {card["suit"] === "c" ? <div style={{ color: "black" }}>{"♣"}</div> : null}
        </div>
      </div>
    </div>
  );
};
export default PokeCard;
