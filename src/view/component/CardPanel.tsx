import { motion, useAnimationControls } from "framer-motion";
import useCoordManager from "../../service/CoordManager";
import useEventSubscriber from "../../service/EventManager";
import { useGameManager } from "../../service/GameManager";
import useBlankCardAnimation from "../animation/BlankCardAnimation";
import useCardInitAnimation from "../animation/CardInitAnimation";
import useCardReleaseAnimation from "../animation/CardReleaseAnimation";
import PokeCard from "./PokeCard";
import "./styles.css";

export default function CardPanel() {
  const { viewport, cardXY } = useCoordManager();
  const { createEvent } = useEventSubscriber([]);
  const { gameId, cards, hit, hitBlank, hitDealer, initGame } = useGameManager();
  const blankControls = useAnimationControls();
  const controls = useAnimationControls();
  const cardControls = useAnimationControls();
  useBlankCardAnimation(controls, cardControls, blankControls);
  useCardInitAnimation(controls, cardControls);
  useCardReleaseAnimation(controls, cardControls);

  return (
    <>
      {viewport &&
        cards &&
        cards.map((c, index) => (
          <motion.div
            key={gameId + "-" + c["no"] + ""}
            custom={c["no"]}
            style={{
              position: "absolute",
              top: 0,
              left: viewport["width"] - 90,
              width: cardXY["width"],
              height: cardXY["height"],
              transform: "rotate(60deg)",
            }}
            animate={controls}
          >
            <motion.div
              // className={"card"}
              custom={c["no"] + "-1"}
              initial={{ opacity: 1, transform: `rotateY(0deg)` }}
              animate={cardControls}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: cardXY["width"],
                height: cardXY["height"],
                backgroundImage: `url("/images/faces/back.svg")`,
                backgroundPosition: "center",
                backgroundSize: "cover",
              }}
            ></motion.div>
            <motion.div
              custom={c["no"] + "-0"}
              initial={{ opacity: 0, transform: `rotateY(180deg)` }}
              animate={cardControls}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: cardXY["height"],
              }}
            >
              <PokeCard height={cardXY["height"]} width={cardXY["width"]} card={c} />
            </motion.div>
          </motion.div>
        ))}
      <motion.div
        key={gameId + "-0"}
        animate={blankControls}
        style={{
          position: "absolute",
          top: 0,
          left: viewport?.width ? viewport["width"] - 90 : 0,
          width: cardXY?.width ? cardXY["width"] : 0,
          height: cardXY?.height ? cardXY["height"] : 0,
          transform: "rotate(60deg)",
          backgroundImage: `url("/images/faces/back.svg")`,
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      ></motion.div>
      <div
        style={{
          cursor: "pointer",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: 120,
          height: 40,
          backgroundColor: "red",
          color: "white",
        }}
        onClick={() => hit(0)}
      >
        Hit(Seat0)
      </div>
      <div style={{ height: 10 }} />
      <div
        style={{
          cursor: "pointer",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: 120,
          height: 40,
          backgroundColor: "red",
          color: "white",
        }}
        onClick={() => hit(1)}
      >
        Hit(Seat1)
      </div>
      <div style={{ height: 10 }} />
      <div
        style={{
          cursor: "pointer",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: 120,
          height: 40,
          backgroundColor: "red",
          color: "white",
        }}
        onClick={() => hit(2)}
      >
        Hit(Seat2)
      </div>
      <div style={{ height: 10 }} />
      <div
        style={{
          cursor: "pointer",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: 120,
          height: 40,
          backgroundColor: "red",
          color: "white",
        }}
        onClick={() => hitBlank()}
      >
        Hit Blank
      </div>
      <div style={{ height: 10 }} />
      <div
        style={{
          cursor: "pointer",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: 120,
          height: 40,
          backgroundColor: "red",
          color: "white",
        }}
        onClick={() => hitDealer()}
      >
        Replace Blank
      </div>
      <div style={{ height: 10 }} />
      <div
        style={{
          cursor: "pointer",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: 120,
          height: 40,
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
