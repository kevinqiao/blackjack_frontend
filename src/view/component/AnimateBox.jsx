import React, { useEffect, useMemo, useState } from "react";
import { animated, useSpring, useSprings } from "@react-spring/web";
import useCoordManager from "../../service/CoordManager";
import "../../styles.css";
import useEventSubscriber from "../../service/EventManager";
import { useGameManager } from "../../service/GameManager";

const AnimateBox = () => {
  const [total, setTotal] = useState(4);
  const { myChipXY, betChipXY, dealerPos, chipWidth } = useCoordManager();
  const { betChips, addChip, removeChip } = useGameManager();
  const { event, createEvent } = useEventSubscriber(["addChip", "moveChip", "gameOver", "dealCompleted"]);
  useEffect(() => {
    betChips.map((b, index) => {
      const dis = (chipWidth + 5) * (index - betChips.length / 2);
      const x = betChipXY["x"] + dis - myChipXY["x"] - (b.id - 1) * chipWidth - b.id * 10;
      const y = betChipXY["y"] - myChipXY["y"];
      let api;
      switch (b.id) {
        case 1:
          api = apis;
          break;
        case 2:
          api = apis2;
          break;
        case 3:
          api = apis3;
          break;
        default:
          break;
      }
      api.start((i) => {
        if (b.items.includes(i))
          return {
            x: x,
            y: y,
          };
      });
    });
  }, [betChips]);
  useEffect(() => {
    console.log(event);
    if (event?.name === "addChip") {
      add(event.id);
    } else if (event?.name === "moveChip") {
      const betChip = betChips.find((c) => c.id === 1);
      apis.start((i) => {
        if (betChip.items.includes(i)) {
          const x = betChipXY["x"] - myChipXY["x"] - chipWidth - 5;
          const y = betChipXY["y"] - myChipXY["y"];
          console.log(x + ":" + y);
          return {
            x: x,
            y: y,
          };
        }
      });
    } else if (event?.name === "gameOver") {
      apis.start((i) => {
        return {
          to: [
            { x: 0 - myChipXY["x"], y: 0 - myChipXY["y"] },
            { x: 0, y: 0, opacity: 0, display: "none", duration: 1000 },
          ],
        };
      });
    } else if (event?.name === "dealCompleted") {
      deal();
    }
  }, [event]);

  const [springs, apis] = useSprings(total, (i) => {
    return {
      display: "none",
      opacity: 0,
      x: 0,
      y: 0,
      scale: 1,
      zIndex: 100 - i,
    };
  });

  const [springs2, apis2] = useSprings(total, (i) => {
    return {
      display: "none",
      opacity: 0,
      x: 0,
      y: 0,
      scale: 1,
      zIndex: 100 - i,
    };
  });
  const [springs3, apis3] = useSprings(total, (i) => {
    return {
      display: "none",
      opacity: 0,
      x: 0,
      y: 0,
      scale: 1,
      zIndex: 100 - i,
    };
  });
  const add = (id) => {
    let index = total - 1;
    let dis = 0;
    let chipIndex = betChips.length - 1;
    const betChip = betChips.find((b) => b.id === id);
    if (betChip) {
      index = betChip.items[0] - 1;
      chipIndex = betChips.findIndex((b) => b.id === id);
      dis = (chipWidth + 5) * (chipIndex - betChips.length / 2);
    } else {
      dis = ((chipWidth + 5) * (betChips.length - 1)) / 2;
    }

    let api;
    const x = betChipXY["x"] + dis - (myChipXY["x"] + (id - 1) * chipWidth + 10 * id);
    if (id === 1) {
      api = apis;
    }
    if (id === 2) {
      api = apis2;
    }
    if (id === 3) {
      api = apis3;
    }
    const y = betChipXY["y"] - myChipXY["y"];
    api.start((i) => {
      if (i === index) {
        return {
          to: { display: "block", opacity: 1, x: x, y: y, zIndex: chipIndex },
          onStart: () => {
            addChip({ id: id, index: index });
          },
        };
      }
    });
  };
  const remove = (id, index) => {
    let api;
    if (id === 1) api = apis;
    if (id === 2) api = apis2;
    if (id === 3) api = apis3;
    api.start((i) => {
      if (i === index) {
        return {
          to: [{ opacity: 0, x: 0, y: 0 }, { display: "none" }],
        };
      }
    });
    removeChip({ id: id, index: index });
  };
  const deal = () => {
    let api;
    for (let i = 1; i <= 3; i++) {
      if (i === 1) api = apis;
      if (i === 2) api = apis2;
      if (i === 3) api = apis3;
      api.start((j) => {
        const x = dealerPos["x"] - myChipXY["x"] - (i - 0.5) * chipWidth - i * 10;
        const y = dealerPos["y"] - myChipXY["y"];
        return {
          x: x,
          y: y,
          scale: 0.5,
        };
      });
    }
  };
  return (
    <>
      {springs.map((props, index) => (
        <animated.div
          key={index + "'"}
          style={{
            cursor: "pointer",
            position: "absolute",
            top: myChipXY["y"],
            left: myChipXY["x"] + 10,
            ...props,
          }}
          onClick={() => remove(1, index)}
        >
          <div className="pokerchip blue"></div>
        </animated.div>
      ))}
      {springs2.map((props, index) => (
        <animated.div
          key={index + "'"}
          style={{
            cursor: "pointer",
            position: "absolute",
            top: myChipXY["y"],
            left: myChipXY["x"] + chipWidth + 20,
            ...props,
          }}
          onClick={() => remove(2, index)}
        >
          <div className="pokerchip red"></div>
        </animated.div>
      ))}
      {springs3.map((props, index) => (
        <animated.div
          key={index + "'"}
          style={{
            cursor: "pointer",
            position: "absolute",
            top: myChipXY["y"],
            left: myChipXY["x"] + chipWidth * 2 + 30,
            ...props,
          }}
          onClick={() => remove(3, index)}
        >
          <div className="pokerchip green"></div>
        </animated.div>
      ))}
    </>
  );
};
export default AnimateBox;
