import { motion, useAnimationControls } from "framer-motion";
import { useEffect, useState } from "react";
import useCoordManager from "../../service/CoordManager";
import useEventSubscriber from "../../service/EventManager";
import useGameEngine from "../../service/GameEngine";
import { useGameManager } from "../../service/GameManager";
import "./score.css";

export default function BlackJack() {
  const [code, setCode] = useState(0);
  const { event } = useEventSubscriber(["hitCreated"], []);
  const gameEngine = useGameEngine();
  const { viewport, cardXY, seatCoords } = useCoordManager();
  const { cards, seats } = useGameManager();
  const controls = useAnimationControls();
  useEffect(() => {
    if (event?.name === "hitCreated") {
      const seatNo = event.data.seatNo;
      const cardNo = event.data.cardNo;
      const seat = seats.find((s) => s.no === seatNo);
      if (seat?.currentSlot) {
        const currentSlot = seat.slots.find((s) => s.id === seat.currentSlot);
        const slotCards = cards.filter((c) => currentSlot?.cards.includes(c.no));
        if (slotCards?.length >= 2) {
          const scores = gameEngine.getHandScore(slotCards);
          if (scores.length === 0) {
            console.log("Bust happened");
            setCode(1);
            controls.start({
              opacity: [1, 1, 0],
              transition: {
                duration: 2,
                times: [0, 0.8, 1],
              },
            });
          } else if (scores.includes(21)) {
            console.log("blackjack happened");
            setCode(2);
            controls.start({
              opacity: [1, 1, 0],
              transition: {
                duration: 2,
                times: [0, 0.8, 1],
              },
            });
          }
        }
      }
    }
  }, [event]);

  return (
    <>
      {viewport ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={controls}
          style={{
            position: "absolute",
            top: viewport["height"] / 2,
            left: viewport["width"] / 2,
            backgroundColor: "red",
            width: 100,
            height: 30,
            color: "white",
          }}
        >
          {code === 1 ? <span>Bust</span> : null}
          {code === 2 ? <span>BlackJack</span> : null}
        </motion.div>
      ) : null}
    </>
  );
}
