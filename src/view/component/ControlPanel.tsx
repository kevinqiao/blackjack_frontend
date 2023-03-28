import { motion, useAnimationControls } from "framer-motion";
import { useCallback, useEffect } from "react";
import useEventSubscriber from "../../service/EventManager";
import { useGameManager } from "../../service/GameManager";
import "./styles.css";

export default function ControlPanel() {
  const { event, createEvent } = useEventSubscriber(["dealCompleted", "gameOver"], []);
  const { cards, seats, round, currentTurn, deal, hit, split, stand, double, insure, initGame } = useGameManager();
  const panelControls = useAnimationControls();
  useEffect(() => {
    if (round > 0)
      panelControls.start({
        y: -150,
        transition: {
          duration: 1.5,
          type: "spring",
        },
      });
    // if (currentTurn?.seat === 0) {
    //   panelControls.start({
    //     y: -150,
    //     transition: {
    //       duration: 1.5,
    //       type: "spring",
    //     },
    //   });
    // } else {
    //   panelControls.start({
    //     y: -150,
    //     transition: {
    //       duration: 1.5,
    //       type: "spring",
    //     },
    //   });
    // }
  }, [currentTurn]);

  const standSeat = () => {
    if (currentTurn) stand(currentTurn.seat);
  };
  const hitCard = () => {
    if (currentTurn && currentTurn?.seat >= 0) {
      hit(currentTurn.seat);
    }
  };
  const canInsure = useCallback((): boolean => {
    const dealer = seats.find((s) => s.no === 3);
    if (currentTurn && dealer?.slots.length === 1 && dealer.slots[0].cards?.length === 1) {
      const card = cards.find((c) => c.no === dealer.slots[0]["cards"][0]);
      if (card?.rank === 14) {
        const seat = seats.find((s) => s.no === currentTurn.seat);
        if (seat?.slots.length === 1 && seat.slots[0].cards.length === 2) return true;
      }
    }
    return false;
  }, [currentTurn]);
  const canDouble = (): boolean => {
    if (currentTurn) {
      const seat = seats.find((s) => s.no === currentTurn.seat);
      if (seat?.slots.length === 1 && seat.slots[0].cards.length === 2) {
        const scards = cards.filter((c) => seat.slots[0]["cards"].includes(c.no));
        const aces = scards.filter((c) => c.rank === 14);
        if (aces.length === 0) {
          const score = scards[0]["rank"] + scards[1]["rank"];
          if (score === 11) return true;
        } else if (aces.length === 1) {
          const score = scards[0]["rank"] + scards[1]["rank"];
          if (score - 13 === 11) return true;
        }
      }
    }
    return false;
  };
  const canSplit = (): boolean => {
    if (currentTurn) {
      const seat = seats.find((s) => s.no === currentTurn.seat);
      if (seat?.slots && seat.slots.length <= 2) {
        const currentSlot = seat.slots.find((s) => s.id === seat.currentSlot);
        if (currentSlot?.cards.length === 2) {
          const scards = cards.filter((c) => currentSlot["cards"].includes(c.no));
          if (scards?.length === 2 && scards[0]["rank"] === scards[1]["rank"]) return true;
        }
      }
    }
    return false;
  };
  return (
    <>
      <motion.div
        style={{
          position: "absolute",
          bottom: -100,
          left: 0,
          zIndex: 2500,
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
        }}
        animate={panelControls}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-around",
            alignItems: "center",
            width: "25%",
            height: 100,
          }}
        >
          {canSplit() ? (
            <div
              style={{
                cursor: "pointer",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: 80,
                height: 40,
                borderRadius: 5,
                backgroundColor: "red",
                color: "white",
              }}
              onClick={split}
            >
              Split
            </div>
          ) : null}

          {canDouble() ? (
            <div
              style={{
                cursor: "pointer",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: 80,
                height: 40,
                borderRadius: 5,
                backgroundColor: "red",
                color: "white",
              }}
              onClick={double}
            >
              Double
            </div>
          ) : null}
          {canInsure() ? (
            <div
              style={{
                cursor: "pointer",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: 80,
                height: 40,
                borderRadius: 5,
                backgroundColor: "red",
                color: "white",
              }}
              onClick={insure}
            >
              Insure
            </div>
          ) : null}
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-around",
            alignItems: "center",
            width: "25%",
            height: 100,
          }}
        >
          {/* {currentTurn?.acts?.includes(ActionType.HIT) ? ( */}
          <div
            style={{
              cursor: "pointer",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: 80,
              height: 40,
              borderRadius: 5,
              backgroundColor: "red",
              color: "white",
            }}
            onClick={() => hitCard()}
          >
            Hit
          </div>
          {/* ) : null} */}
          <div style={{ height: 10 }} />
          {/* {currentTurn?.acts?.includes(ActionType.STAND) ? ( */}
          <div
            style={{
              cursor: "pointer",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: 80,
              height: 40,
              backgroundColor: "red",
              borderRadius: 5,
              color: "white",
            }}
            onClick={() => standSeat()}
          >
            Stand
          </div>
          {/* ) : null} */}
        </div>

        {/* <div style={{ height: 10 }} />
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
          onClick={startGame}
        >
          Initialize
        </div> */}
      </motion.div>
    </>
  );
}
