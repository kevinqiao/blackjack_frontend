import { motion, useAnimationControls } from "framer-motion";
import { useCallback, useEffect } from "react";
import { SeatModel } from "../../../model";
import BattleResultType from "../../../model/types/BatterResultType";
import { SlotBattleResult } from "../../../model/types/SlotBattleResult";
import useCoordManager from "../../../service/CoordManager";
import useEventSubscriber from "../../../service/EventManager";
import { useGameManager } from "../../../service/GameManager";
import { useUserManager } from "../../../service/UserManager";
import "../chip.css";
import "../score.css";

export default function SlotChipPanel() {
  const { event, createEvent } = useEventSubscriber(
    ["slotSplitted", "slotActivated", "dealCompleted", "betPlaced", "gameStart", "gameOver"],
    []
  );
  const { viewport, myChipXY, cardXY, seatCoords } = useCoordManager();
  const { gameId, seatOffset, round, cards, seats, results } = useGameManager();
  const { uid } = useUserManager();
  const controls = useAnimationControls();

  const getCurrentY = (seat: SeatModel, slotId: number) => {
    let seatNo = seat.no;
    if (seatNo < 3) {
      seatNo = seatOffset + seat.no;
      if (seatNo > 2) seatNo = seatNo - 3;
    }
    const seatCoord = seatCoords.find((s: any) => s.no === seatNo);
    let y = seat.no === 3 ? seatCoord["y"] + cardXY["height"] + 20 : seatCoord["y"] - 40;
    if (seat?.currentSlot !== slotId) {
      const slots = seat?.slots.filter((s) => s.id !== seat.currentSlot);
      if (slots) {
        let index = slots?.map((s) => s.id).findIndex((s) => s === slotId);
        if (index >= 0) y = seatCoord["y"] - (cardXY["height"] + 65) * 0.6 - 40;
      }
    }
    // }
    return y;
  };

  const getCurrentX = (seat: SeatModel, slotId: number) => {
    let seatNo = seat.no;
    if (seatNo < 3) {
      seatNo = seatOffset + seat.no;
      if (seatNo > 2) seatNo = seatNo - 3;
    }
    const seatCoord = seatCoords.find((s: any) => s.no === seatNo);
    let x = seatNo === 2 ? seatCoord["x"] - cardXY["width"] / 2 : seatCoord["x"] + cardXY["width"] / 2;
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
    (seatNo: number, slotId: number) => {
      let chips = 0;
      if (seatNo === 3) {
        chips = seats.map((s) => s.bet * s.slots.length).reduce((total, b) => total + b, 0);
        if (results?.length > 0) {
          chips =
            chips +
            results
              .map((r) => {
                const seat = seats.find((s) => s.no === r.seat);
                if (seat && r.win === BattleResultType.WIN) return 0 - seat.bet;
                else if (seat && r.win === BattleResultType.FAIL) return seat.bet;
                else return 0;
              })
              .reduce((total, c) => total + c, 0);
        }
      } else {
        const seat = seats.find((s) => s.no === seatNo);
        if (seat) {
          chips = seat.bet;
          if (results?.length > 0) {
            const res = results.find((r) => r.slot === slotId);
            if (res?.win === BattleResultType.WIN) chips = seat.bet * 2;
            else if (res?.win === BattleResultType.FAIL) chips = 0;
          }
        }
      }
      return chips;
    },
    [seats, results]
  );
  useEffect(() => {
    if (gameId > 0 && results?.length > 0) {
      controls.start((o) => {
        const animationProps: any = {};
        const res = results.find((b) => b.slot === o.slot.id);
        if (res?.win === BattleResultType.FAIL) {
          if (o.seatNo < 3) {
            const seat = seats.find((s) => s.no === o.seatNo);
            if (seat) {
              const x = left(3) - left(seat.no);
              const y = top(3) - top(seat.no);
              animationProps["x"] = [x, x, x];
              animationProps["y"] = [y, y, y];
              animationProps["opacity"] = [0, 0, 1];
              animationProps["transition"] = {
                duration: 0.5,
                default: { ease: "linear" },
                times: [0, 0.4, 1],
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
              animationProps["x"] = [x0, x0, x0];
              animationProps["y"] = [y0, y0, y0];
              animationProps["opacity"] = [0, 0, 1];
              animationProps["transition"] = {
                duration: 0.5,
                default: { ease: "linear" },
                times: [0, 0.4, 1],
              };
            }
          }
        }
        return animationProps;
      });
    }
  }, [gameId, seatCoords]);
  useEffect(() => {
    controls.start((o) => {
      const animationProps: any = {};
      const seat = seats.find((s) => s.no === o.seatNo);
      if (seat) {
        const cx = getCurrentX(seat, o.slot.id);
        const cy = getCurrentY(seat, o.slot.id);
        const x = cx - left(seat.no);
        const y = cy - top(seat.no);
        animationProps["x"] = [x, x, x];
        animationProps["y"] = [y, y, y];
        if (seatBet(seat.no, o.slot.id) > 0) animationProps["opacity"] = [0, 0, 1];
        else animationProps["opacity"] = [0, 0, 0];
        animationProps["transition"] = {
          duration: 0.5,
          default: { ease: "linear" },
          times: [0, 0.2, 1],
        };
      }
      return animationProps;
    });
  }, [gameId]);
  useEffect(() => {
    if (event?.name === "betPlaced") {
      controls.start((o) => {
        const animationProps: any = {};
        const seat = seats.find((s) => s.no === o.seatNo);
        if (seat?.uid === uid) {
          const x = viewport["width"] / 2 - left(o.seatNo);
          const y = myChipXY["y"] - top(o.seatNo) - 200;
          animationProps["x"] = [x, x, 0];
          animationProps["y"] = [y, y, 0];
          animationProps["opacity"] = [0, 0, 1];
          animationProps["transition"] = {
            default: { ease: "linear" },
            duration: 1.5,
            times: [0, 0.2, 1],
          };
        } else if (seat) {
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
      let seatNo = data.seat;
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
    if (seatNo < 3) {
      seatNo = seatOffset + seatNo;
      if (seatNo > 2) seatNo = seatNo - 3;
    }
    if (!seatCoords) return 0;
    const seatCoord = seatCoords.find((s: any) => s.no === seatNo);
    if (seatNo === 3) return seatCoord["y"] + cardXY["height"] + 20;
    else return seatCoord["y"] - 40;
  };

  const left = (seatNo: number): number => {
    if (!seatCoords) return 0;
    if (seatNo < 3) {
      seatNo = seatOffset + seatNo;
      if (seatNo > 2) seatNo = seatNo - 3;
    }
    const seatCoord = seatCoords.find((s: any) => s.no === seatNo);
    if (seatNo === 2) return seatCoord["x"] - cardXY["width"] / 2;
    else return seatCoord["x"] + cardXY["width"] / 2;
  };
  return (
    <>
      {round > 0 &&
        seats
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

                  {seatBet(seat.no, slot["id"]) > 0 ? (
                    <div
                      // custom={{ seatNo: seat.no, slot: slot }}
                      // initial={{ opacity: 1 }}
                      // animate={betControls}
                      style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        alignItems: "center",
                        position: "absolute",
                        zIndex: -10,
                        top: 5,
                        left: 20,
                        width: 25,
                        height: 20,
                        fontSize: 10,
                        backgroundColor: "grey",
                        borderRadius: 4,
                        paddingRight: 5,
                        color: "white",
                      }}
                    >
                      <span>{seatBet(seat.no, slot["id"])}</span>
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
                </motion.div>
              </div>
            ))
          )}
      {seatBet(3, 0) > 0 ? (
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
          <span>{seatBet(3, 0)}</span>
        </div>
      ) : null}
    </>
  );
}
