import { motion, useAnimationControls } from "framer-motion";
import { useEffect } from "react";
import { SeatModel } from "../../../model";
import useCoordManager from "../../../service/CoordManager";
import useEventSubscriber from "../../../service/EventManager";
import { useGameManager } from "../../../service/GameManager";
import "../score.css";

export default function SlotChipPanel() {
  const { event, createEvent } = useEventSubscriber(["slotSplitted", "gameStart"], []);
  const { viewport, cardXY, seatCoords } = useCoordManager();
  const { cards, seats } = useGameManager();
  const controls = useAnimationControls();

  useEffect(() => {
    if (seatCoords && event?.name === "gameStart") {
      controls.start((o) => {
        if (o?.seatNo < 3) {
          return {
            opacity: 1,
            transition: {
              duration: 1,
              default: { ease: "linear" },
            },
          };
        } else return {};
      });
    } else if (seatCoords && event?.name === "slotSplitted") {
      const data = event?.data;
      const seatNo = data.seat;
      controls.start((o) => {
        if (o.seatNo === seatNo && seatNo < 3) {
          const seat = seats.find((s: SeatModel) => s.no === seatNo);
          const seatCoord = seatCoords.find((s: any) => s.no === seatNo);
          console.log(seatCoord);
          if (seat?.slots.length === 2)
            return {
              x: 0,
              y: 0 - (cardXY["height"] + 75) * 0.8,
              transition: {
                duration: 1,
                default: { ease: "linear" },
              },
            };
        }
        return {};
      });
    }
  }, [event, seatCoords]);

  const top = (seatNo: number): number => {
    const seatCoord = seatCoords.find((s: any) => s.no === seatNo);
    if (seatNo === 3) return seatCoord["y"] + cardXY["height"] + 30;
    else return seatCoord["y"] - 60;
  };

  const left = (seatNo: number): number => {
    const seatCoord = seatCoords.find((s: any) => s.no === seatNo);
    return seatCoord["x"];
  };
  return (
    <>
      {seats
        .filter((s) => s.no < 3)
        .map((seat) =>
          seat.slots.map((slot) => (
            <div key={seat.no + "-" + slot.id}>
              <motion.div
                key={seat.no + "-" + slot.id}
                custom={{ seatNo: seat.no, slot: slot }}
                initial={{ opacity: 0 }}
                animate={controls}
                style={{
                  position: "absolute",
                  top: top(seat.no),
                  left: left(seat.no),
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    position: "relative",
                    width: 30,
                    height: 20,
                    fontSize: 10,
                    backgroundColor: "grey",
                    borderRadius: 4,
                    paddingRight: 5,
                    color: "white",
                  }}
                >
                  <span>110</span>
                </div>
                <div
                  style={{
                    position: "relative",
                    top: -30,
                    left: -30,
                    color: "white",
                  }}
                >
                  <div key={slot["id"] + ""} className="pokerchip red"></div>
                </div>
              </motion.div>
              <motion.div
                key={"3-" + slot.id}
                custom={{ seatNo: 3, slot: slot }}
                initial={{ opacity: 0 }}
                animate={controls}
                style={{
                  position: "absolute",
                  top: top(3),
                  left: left(3),
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    position: "relative",
                    width: 30,
                    height: 20,
                    fontSize: 10,
                    backgroundColor: "grey",
                    borderRadius: 4,
                    paddingRight: 5,
                    color: "white",
                  }}
                >
                  <span>100</span>
                </div>
                <div
                  style={{
                    position: "relative",
                    top: -30,
                    left: -30,
                    color: "white",
                  }}
                >
                  <div key={slot["id"] + ""} className="pokerchip red"></div>
                </div>
              </motion.div>
            </div>
          ))
        )}
    </>
  );
}
