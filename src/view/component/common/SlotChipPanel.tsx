import { motion, useAnimationControls } from "framer-motion";
import { useCallback, useEffect } from "react";
import { SeatModel } from "../../../model";
import BattleResultType from "../../../model/types/BatterResultType";
import { SlotBattleResult } from "../../../model/types/SlotBattleResult";
import useCoordManager from "../../../service/CoordManager";
import useEventSubscriber from "../../../service/EventManager";
import { useGameManager } from "../../../service/GameManager";
import "../chip.css";
import "../score.css";

export default function SlotChipPanel() {
  const { event, createEvent } = useEventSubscriber(
    ["slotSplitted", "slotActivated", "dealCompleted", "betPlaced", "gameStart", "gameOver"],
    []
  );
  const { viewport, myChipXY, cardXY, seatCoords } = useCoordManager();
  const { round, cards, seats, results } = useGameManager();
  const controls = useAnimationControls();

  const getCurrentY = (seat: SeatModel, slotId: number) => {
    const seatCoord = seatCoords.find((s: any) => s.no === seat.no);
    let y = seat.no === 3 ? seatCoord["y"] + cardXY["height"] + 20 : seatCoord["y"] - 40;
    if (seat.slots.length > 1) {
      // y = seatCoord["y"] - (cardXY["height"] + 95) * 0.6 - 40;
      if (seat?.currentSlot !== slotId) {
        const slots = seat?.slots.filter((s) => s.id !== seat.currentSlot);
        if (slots) {
          let index = slots?.map((s) => s.id).findIndex((s) => s === slotId);
          if (index >= 0) y = seatCoord["y"] - (cardXY["height"] + 65) * 0.6 - 40;
        }
      }
    }
    return y;
  };

  const getCurrentX = (seat: SeatModel, slotId: number) => {
    const seatCoord = seatCoords.find((s: any) => s.no === seat.no);
    let x = seat.no === 2 ? seatCoord["x"] - cardXY["width"] * 0.8 : seatCoord["x"] + cardXY["width"] / 2;
    if (seat?.currentSlot !== slotId) {
      const slots = seat?.slots.filter((s) => s.id !== seat.currentSlot).sort((a, b) => b.id - a.id);
      if (slots) {
        let index = slots.findIndex((s) => s.id === slotId);
        if (index >= 0)
          x =
            seat.no === 2
              ? seatCoord["x"] - (0.8 + index - slots.length / 2) * (cardXY["width"] + 95) * 0.6
              : seatCoord["x"] - (0.25 + index - slots.length / 2) * (cardXY["width"] + 95) * 0.6;
      }
    }
    return x;
  };
  const seatBet = useCallback(
    (seatNo: number) => {
      let chips = 0;
      if (seatNo === 3) {
        if (results?.length > 0) {
          chips = results
            .map((r) => {
              if (r.win === BattleResultType.WIN) return 0 - r.chips;
              else if (r.win === BattleResultType.FAIL) return r.chips;
              else return 0;
            })
            .reduce((total, c) => total + c, 0);
        } else chips = seats.map((s) => s.bet).reduce((total, b) => total + b, 0);
      } else {
        const seat = seats.find((s) => s.no === seatNo);
        if (seat) chips = results.length > 0 ? 0 : seat.bet;
      }
      return chips;
    },
    [seats]
  );

  useEffect(() => {
    if (event?.name === "betPlaced") {
      controls.start((o) => {
        const animationProps: any = {};
        if (o.seatNo === 0) {
          const x = viewport["width"] / 2 - left(0);
          const y = myChipXY["y"] - top(0) - 200;
          animationProps["x"] = [x, x, 0];
          animationProps["y"] = [y, y, 0];
          animationProps["opacity"] = [0, 0, 1];
          animationProps["transition"] = {
            default: { ease: "linear" },
            duration: 1.5,
            times: [0, 0.2, 1],
          };
        } else {
          const seat = seats.find((s) => s.no === o.seatNo);
          if (seat) {
            const cx = getCurrentX(seat, o.slot.id);
            const cy = getCurrentY(seat, o.slot.id);
            animationProps["x"] = cx - left(seat.no);
            animationProps["y"] = cy - top(seat.no);
            animationProps["opacity"] = 1;
            animationProps["transition"] = {
              duration: 0.1,
              default: { ease: "linear" },
            };
          }
        }

        return animationProps;
      });
    }
  }, [event]);

  useEffect(() => {
    if (event?.name === "gameOver") {
      const battleResult: SlotBattleResult[] = event.data;
      if (battleResult?.length > 0) {
        controls.start((o) => {
          const animationProps: any = {};
          const res = battleResult.find((b) => b.slot === o.slot.id);
          if (res?.win === BattleResultType.FAIL) {
            if (o.seatNo < 3) {
              const seat = seats.find((s) => s.no === o.seatNo);
              if (seat) {
                animationProps["x"] = left(3) - left(seat.no);
                animationProps["y"] = top(3) - top(seat.no);
                animationProps["transition"] = {
                  duration: 1,
                  default: { ease: "linear" },
                };
              }
            }
          } else if (res?.win === BattleResultType.WIN) {
            if (o.seatNo === 3) {
              const seat = seats.find((s) => s.no === res.seat);
              if (seat) {
                const cx = getCurrentX(seat, o.slot.id);
                const cy = getCurrentY(seat, o.slot.id);
                const x0 = cx - left(3);
                const y0 = cy - top(3);
                animationProps["x"] = x0;
                animationProps["y"] = y0;
                animationProps["opacity"] = 1;
                animationProps["transition"] = {
                  duration: 0.2,
                  default: { ease: "linear" },
                };
              }
            }
          }
          return animationProps;
        });
      }
    } else if (event?.name === "slotSplitted" || event?.name === "slotActivated") {
      const data = event?.data;
      const seatNo = data.seat;
      controls.start((o) => {
        const animationProps: any = {};
        if (o.seatNo === seatNo && seatNo < 3) {
          const seat = seats.find((s) => s.no === o.seatNo);
          if (seat) {
            const cx = getCurrentX(seat, o.slot.id);
            const cy = getCurrentY(seat, o.slot.id);
            animationProps["x"] = cx - left(seat.no);
            animationProps["y"] = cy - top(seat.no);
            animationProps["opacity"] = 1;
            animationProps["transition"] = {
              duration: 0.1,
              default: { ease: "linear" },
            };
          }
        }
        return animationProps;
      });
    }
  }, [event]);

  const top = (seatNo: number): number => {
    if (!seatCoords) return 0;
    const seatCoord = seatCoords.find((s: any) => s.no === seatNo);
    if (seatNo === 3) return seatCoord["y"] + cardXY["height"] + 20;
    else return seatCoord["y"] - 40;
  };

  const left = (seatNo: number): number => {
    if (!seatCoords) return 0;
    const seatCoord = seatCoords.find((s: any) => s.no === seatNo);
    if (seatNo === 2) return seatCoord["x"] - cardXY["width"] / 2;
    else return seatCoord["x"] + cardXY["width"] / 2;
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
                  zIndex: 1700,
                  top: top(seat.no),
                  left: left(seat.no),
                }}
              >
                <div key={slot["id"] + ""} className="betchip bred"></div>

                {seatBet(seat.no) > 0 ? (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      alignItems: "center",
                      position: "absolute",
                      zIndex: -10,
                      top: 5,
                      left: 15,
                      width: 25,
                      height: 20,
                      fontSize: 10,
                      backgroundColor: "grey",
                      borderRadius: 4,
                      paddingRight: 5,
                      color: "white",
                    }}
                  >
                    <span>{seatBet(seat.no)}</span>
                  </div>
                ) : null}
              </motion.div>
              <motion.div
                key={"3-" + slot.id}
                custom={{ seatNo: 3, slot: slot }}
                initial={{ opacity: 0 }}
                animate={controls}
                style={{
                  position: "absolute",
                  zIndex: 1700,
                  top: top(3),
                  left: left(3),
                }}
              >
                <div key={slot["id"] + ""} className="betchip bred"></div>
                {/* <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    position: "relative",
                    width: 25,
                    height: 20,
                    fontSize: 10,
                    backgroundColor: "grey",
                    borderRadius: 4,
                    paddingRight: 5,
                    color: "white",
                  }}
                >
                  <span></span>
                </div> */}
              </motion.div>
            </div>
          ))
        )}
      {seatBet(3) > 0 ? (
        <div
          style={{
            position: "absolute",
            top: top(3) + 5,
            left: left(3) + 15,
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            width: 30,
            height: 20,
            fontSize: 10,
            backgroundColor: "grey",
            borderRadius: 4,
            paddingRight: 5,
            color: "white",
          }}
        >
          <span>{seatBet(3)}</span>
        </div>
      ) : null}
    </>
  );
}
