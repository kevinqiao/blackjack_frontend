import { motion, useAnimationControls } from "framer-motion";
import { useCallback, useEffect } from "react";
import { SeatModel } from "../../model";
import useCoordManager from "../../service/CoordManager";
import useEventSubscriber from "../../service/EventManager";
import { useGameManager } from "../../service/GameManager";
import PokeCard from "./PokeCard";
import "./styles.css";

export default function CardBox() {
  const { gameId, cards, seats, hit, initGame } = useGameManager();
  const { viewport, cardXY, seatCoords } = useCoordManager();
  const { event, createEvent } = useEventSubscriber(["hitCreated", "gameOver"]);
  const controls = useAnimationControls();
  const cardControls = useAnimationControls();
  useEffect(() => {
    if (gameId > 0 && controls && viewport?.width > 0)
      setTimeout(() => handleInit().then(() => console.log("completed init")), 100);
  }, [gameId, controls, viewport]);
  useEffect(() => {
    if (event?.name === "hitCreated") {
      // const cardNo = event.data.cardNo;
      handleHit(event.data.seatNo, event.data.cardNo);
      // release(cardNo).then(() => console.log("released card"));
      // setTimeout(() => flip().then(() => console.log("completed flip")), 50);
    } else if (event?.name === "gameOver") {
      handleGameOver().then(() => console.log("game over"));
    }
  }, [event]);

  const getTargetPos = useCallback(
    (seatNo: number, cardNo: number, type: number) => {
      const pos: { x: any; y: any; zIndex: any; rotate: any; times: any } = {
        x: 0,
        y: 0,
        zIndex: 0,
        rotate: 0,
        times: [],
      };
      if (seatCoords && seats) {
        const seatCoord = seatCoords.find(
          (s: { no: number; direction: number; x: number; y: number }) => s.no === seatNo
        );
        const seat = seats.find((s: SeatModel) => s.no === seatNo);
        if (seat) {
          console.log(seatCoord);
          const index = seat.cards.findIndex((c) => c === cardNo);
          let x = 0;
          let y = 0;
          let dx = 0;
          let dy = 0;
          let r: any[] = [];
          if (seatCoord.direction === 1) {
            //left
            const dif = cardXY["height"] * 0.2;
            y = seatCoord["y"] - dif * ((seat.cards.length - 1) / 2 - index) - 150;
            x = cardXY["height"] - viewport["width"] - 30;
            console.log("x:" + x + " y:" + y);
            r = [60, 60, 90, 90];
            dy = 80;
          } else if (seatCoord.direction === 0) {
            //bottom
            const dif = cardXY["width"] * 0.3;
            x = dif * (index - (seat.cards.length - 1) / 2) - seatCoord["x"];
            y = seatCoord["y"] - 20;
            r = [60, 60, 0, 0];
            dx = 80;
          }
          if (type === 0) {
            //init
            pos["x"] = [0, x, x, x, x];
            pos["y"] = [0, y, y, y, y];
            pos["zIndex"] = [0, index + 1, index + 1, index + 1];
            pos["times"] = [0, 0.4, 0.5, 0.8, 1];
          } else if (type === 1) {
            //hit
            pos["x"] = [null, x + dx, x + dx, x];
            pos["y"] = [null, y + dy, y + dy, y];
            pos["zIndex"] = [0, index + 1, index + 1, index + 1];
            pos["rotate"] = r;
            pos["times"] = [0, 0.3, 0.7, 1];
          }
        }
      }
      return pos;
    },
    [viewport, cardXY, seatCoords, seats]
  );

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
  const handleHit = async (seatNo: number, cardNo: number) => {
    console.log("handle hit:" + cardNo);
    controls.start((i) => {
      const seat = seats.find((s) => s.no === seatNo);
      if (seat) {
        const index = seat["cards"].findIndex((c) => c === i);
        if (index >= 0) {
          // const x = -600 + index * 30;
          const { x, y, zIndex, rotate, times } = getTargetPos(seatNo, i, 1);
          if (i === cardNo) {
            return {
              x: x,
              y: y,
              rotate: rotate,
              zIndex: zIndex,
              transition: {
                duration: 1,
                default: { ease: "linear" },
                times: times,
              },
            };
          } else
            return {
              x: x[x.length - 1],
              y: y[y.length - 1],
              transition: {
                duration: 1,
                default: { ease: "linear" },
              },
            };
        }
      }
      return {};
    });

    setTimeout(
      () =>
        cardControls.start((id) => {
          const ids = id.split("-");
          if (cardNo === Number(ids[0])) {
            const rotate = `rotateY(${Number(ids[1]) === 1 ? "180deg" : "360deg"})`;
            return {
              opacity: 1 - Number(ids[1]),
              transform: rotate,
              transition: {
                type: "spring",
                duration: 1.5,
              },
            };
          } else return {};
        }),
      400
    );
  };
  const handleInit = async () => {
    controls.start((i) => {
      for (const seat of seats) {
        const index = seat["cards"].findIndex((c) => c === i);
        if (index >= 0) {
          const { x, y, zIndex, times } = getTargetPos(seat["no"], i, 0);
          return {
            opacity: [0, 0, 0, 0, 1],
            x: x,
            y: y,
            zIndex: zIndex,
            transition: {
              duration: 1,
              default: { ease: "linear" },
              times: times,
            },
          };
        }
      }
      return {};
    });

    return cardControls.start((id) => {
      const ids = id.split("-");
      for (const seat of seats) {
        if (seat["cards"].includes(+ids[0])) {
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
        }
      }
      return {};
    });
  };

  return (
    <>
      {viewport && cardXY ? (
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
        </>
      ) : null}

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
