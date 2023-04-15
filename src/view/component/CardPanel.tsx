import { motion, useAnimationControls } from "framer-motion";
import { useCallback } from "react";
import { CardModel } from "../../model";
import useCoordManager from "../../service/CoordManager";
import { useGameManager } from "../../service/GameManager";
import useBetSlotSplitAnimation from "../animation/BetSlotSplitAnimation";
import useBlankCardAnimation from "../animation/BlankCardAnimation";
import useCardReleaseAnimation from "../animation/CardReleaseAnimation";
import useGameInitAnimation from "../animation/GameInitAnimation";
import PokeCard from "./PokeCard";
import "./styles.css";

export default function CardPanel() {
  const { viewport, cardXY } = useCoordManager();
  const { gameId, seats, cards } = useGameManager();
  const blankControls = useAnimationControls();
  const controls = useAnimationControls();
  const cardControls = useAnimationControls();
  // useBetSlotInitAnimation(controls, cardControls);
  useGameInitAnimation(controls, cardControls);
  useBetSlotSplitAnimation(controls, cardControls);
  // useBetSlotSwitchAnimation(controls, cardControls);
  useBlankCardAnimation(controls, cardControls, blankControls);
  // useCardInitAnimation(controls, cardControls);
  useCardReleaseAnimation(controls, cardControls);
  const canOpen = useCallback(
    (card: CardModel) => {
      let open = 0;
      if (seats?.length > 0) {
        const seat = seats.find((s) => s.no === card["seat"]);
        if (seat?.currentSlot !== card["slot"]) open = 1;
      }
      return open;
    },
    [seats]
  );

  return (
    <div style={{ position: "absolute", zIndex: 1600 }}>
      {viewport &&
        cards.length >= 52 &&
        cards.map((c, index) => (
          <motion.div
            key={gameId + "-" + c["no"] + ""}
            custom={c}
            style={{
              cursor: canOpen(c) === 1 ? "pointer" : "default",
              position: "absolute",
              top: 0,
              left: viewport["width"] - cardXY["width"] / 2,
              width: cardXY["width"],
              height: cardXY["height"],
              transform: "rotate(60deg)",
            }}
            animate={controls}
          >
            <motion.div
              // className={"card"}
              custom={{ cardNo: c["no"], seat: c.seat, slot: c.slot, face: 1 }}
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
              custom={{ cardNo: c["no"], seat: c.seat, slot: c.slot, face: 0 }}
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
      {cards.length >= 52 ? (
        <motion.div
          key={gameId + "-0"}
          animate={blankControls}
          style={{
            cursor: "pointer",
            position: "absolute",
            top: 0,
            left: viewport?.width ? viewport["width"] - cardXY["width"] / 2 : 0,
            width: cardXY?.width ? cardXY["width"] : 0,
            height: cardXY?.height ? cardXY["height"] : 0,
            transform: "rotate(60deg)",
            backgroundImage: `url("/images/faces/back.svg")`,
            backgroundPosition: "center",
            backgroundSize: "cover",
          }}
        ></motion.div>
      ) : null}
    </div>
  );
}
