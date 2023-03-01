import { motion, useAnimationControls } from "framer-motion";
import { useEffect } from "react";
import { CardModel } from "../../model";
import useCoordManager from "../../service/CoordManager";
import useEventSubscriber from "../../service/EventManager";
import { useGameManager } from "../../service/GameManager";
import PokeCard from "../component/PokeCard";
import "./styles.css";

export default function Framer() {
  const { gameId, cards, seats, hit, initGame } = useGameManager();
  const { viewport } = useCoordManager();
  const { event, createEvent } = useEventSubscriber(["hitCreated", "gameOver"]);
  const controls = useAnimationControls();
  const cardControls = useAnimationControls();

  useEffect(() => {
    if (gameId > 0 && controls) setTimeout(() => handleInit().then(() => console.log("completed init")), 100);
  }, [gameId, controls]);
  useEffect(() => {
    if (event?.name === "hitCreated") {
      const card = event.data;
      release(card).then(() => console.log("released card"));
      setTimeout(() => flip().then(() => console.log("completed flip")), 50);
    } else if (event?.name === "gameOver") {
      handleGameOver().then(() => console.log("game over"));
    }
  }, [event]);
  const flip = async () => {
    // await controls.start((id) => {
    //   const index = seats[0]["cards"].findIndex((c) => c === id);
    //   if (index >= 0) {
    //     const x = -600 + (index - 1) * 30;
    //     const r = (index - seats[0]["cards"].length / 2) * 8;
    //     return {
    //       x: x,
    //       transition: {
    //         duration: 1.7,
    //         default: { ease: "linear" },
    //       },
    //     };
    //   } else return {};
    // });
    // cardControls.start((id) => {
    //   const ids = id.split("-");
    //   if (seats[0]["cards"].includes(+ids[0]))
    //     return {
    //       opacity: 1 - Number(ids[1]),
    //       transform: `rotateY(${Number(ids[1]) === 1 ? "180deg" : "360deg"})`,
    //       transition: { duration: 0.8, default: { ease: "linear" } },
    //     };

    //   return {};
    // });
    cardControls.start((id) => {
      const ids = id.split("-");
      if (seats[0]["cards"].includes(+ids[0])) {
        const rotate = `rotateY(${Number(ids[1]) === 1 ? "180deg" : "360deg"})`;
        return {
          opacity: [0, 0, 0, 0, 1 - Number(ids[1])],
          transform: [rotate, rotate, rotate, rotate, rotate],
          transition: {
            duration: 1,
            default: { ease: "linear" },
            times: [0, 0.4, 0.5, 0.8, 1],
          },
        };
      } else return {};
    });
  };

  const release = async (card: CardModel) => {
    await controls.start((i) => {
      if (i === card["no"]) {
        const size = seats[0].cards.length;
        const x = -600 + (size - 1) * 30;
        // const r = (size / 2) * 8;
        // console.log("r:" + r);
        return {
          x: [null, x, x, x],
          y: [null, 600, 600, 600],
          rotate: [60, 55, 35, 0],
          zIndex: [0, seats[0]["cards"].length + 1, seats[0]["cards"].length + 1],
          transition: {
            duration: 1.8,
            default: { ease: "linear" },
            times: [0, 0.3, 0.6, 1.8],
          },
        };
      }
      return {};
    });
  };
  // const hitCard = async () => {
  //   const card = hit();
  //   if (card) createEvent({ name: "hitCreated", data: card });
  // };

  const handleGameOver = async () => {
    await controls.start((i) => {
      return {
        x: 0 - viewport["width"] - 100,
        y: -350,
        transition: {
          duration: 0.7,
          default: { ease: "linear" },
        },
      };
    });
  };
  const handleInit = async () => {
    controls.start((i) => {
      const index = seats[0]["cards"].findIndex((c) => c === i);
      if (index >= 0) {
        const size = seats[0].cards.length;
        const x = -600 + index * 30;
        return {
          opacity: [0, 0, 0, 0, 1],
          x: [0, x, x, x, x],
          y: [0, 600, 600, 600, 600],
          rotate: [60, 0, 0, 0, 0],
          zIndex: [0, index, index, index, index],
          transition: {
            duration: 1,
            default: { ease: "linear" },
            times: [0, 0.4, 0.5, 0.8, 1],
          },
        };
      } else return {};
    });

    return cardControls.start((id) => {
      const ids = id.split("-");
      if (seats[0]["cards"].includes(+ids[0])) {
        const rotate = `rotateY(${Number(ids[1]) === 1 ? "180deg" : "360deg"})`;
        return {
          opacity: [0, 0, 0, 0, 1 - Number(ids[1])],
          transform: [rotate, rotate, rotate, rotate, rotate],
          transition: {
            duration: 1,
            default: { ease: "linear" },
            times: [0, 0.4, 0.5, 0.8, 1],
          },
        };
      } else return {};
    });
  };

  return (
    <>
      {viewport ? (
        <>
          {cards &&
            cards.map((c, index) => (
              <motion.div
                key={gameId + "-" + c["no"] + ""}
                custom={c["no"]}
                style={{
                  position: "absolute",
                  top: 0,
                  left: viewport["width"] - 90,
                  width: 130,
                  height: 180,
                  transform: "rotate(60deg)",
                }}
                animate={controls}
              >
                <motion.div
                  custom={c["no"] + "-1"}
                  initial={{ opacity: 1, transform: `rotateY(0deg)` }}
                  animate={cardControls}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: 130,
                    height: 180,
                    backgroundImage: `url("/images/back.png")`,
                    backgroundPosition: "center",
                    backgroundSize: "cover",
                  }}
                ></motion.div>
                <motion.div
                  custom={c["no"] + "-0"}
                  initial={{ opacity: 0, transform: `rotateY(180deg)` }}
                  animate={cardControls}
                  style={{ position: "absolute", top: 0, left: 0, width: 180, height: 130 }}
                >
                  <PokeCard height={180} width={130} card={c} />
                </motion.div>
              </motion.div>
            ))}
        </>
      ) : null}
      <div style={{ height: 300 }} />
      <div
        style={{
          cursor: "pointer",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: 220,
          height: 40,
          backgroundColor: "red",
          color: "white",
        }}
        onClick={() => hit(0)}
      >
        Hit(Seat 0)
      </div>
      <div style={{ height: 10 }} />
      <div
        style={{
          cursor: "pointer",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: 220,
          height: 40,
          backgroundColor: "red",
          color: "white",
        }}
        onClick={() => createEvent({ name: "gameOver", data: null })}
      >
        Finish
      </div>
      <div style={{ height: 10 }} />
      <div
        style={{
          cursor: "pointer",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: 220,
          height: 40,
          backgroundColor: "red",
          color: "white",
        }}
        onClick={initGame}
      >
        Initialize
      </div>
      <div style={{ height: 10 }} />
      <div
        style={{
          cursor: "pointer",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: 220,
          height: 40,
          backgroundColor: "red",
          color: "white",
        }}
        onClick={() => createEvent({ name: "newGame", data: null })}
      >
        New
      </div>
    </>
  );
}
