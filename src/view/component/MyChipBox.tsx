import { motion, useAnimationControls } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { ChipModel } from "../../model";
import useCoordManager from "../../service/CoordManager";
import useEventSubscriber from "../../service/EventManager";
import { useGameManager } from "../../service/GameManager";
import "./chip.css";
const CHIP_SIZE = 3;
const chip_btns = [
  { id: 1, amount: 1 },
  { id: 2, amount: 2 },
  { id: 3, amount: 3 },
];
const MyChipBox = () => {
  const { createEvent } = useEventSubscriber([], []);
  const [betChips, setBetChips] = useState<ChipModel[]>([]);

  const { myChipXY, chipScale, viewport, betChipXY, chipWidth, seatCoords } = useCoordManager();
  const { round, gameId, deal, initGame } = useGameManager();
  const btnControls = useAnimationControls();
  const chipControls = useAnimationControls();
  // const betChipControls = useAnimationControls();
  const dealControls = useAnimationControls();
  useEffect(() => {
    initGame();
  }, []);
  useEffect(() => {
    if (gameId > 0) setBetChips([]);
  }, [gameId]);
  useEffect(() => {
    if (round === 0 && gameId > 0) {
      console.log("place bet");
      btnControls.start({
        opacity: 1,
        y: 0,
        transition: {
          type: "spring",
          duration: 1.5,
        },
      });
      dealControls.start({
        opacity: 1,
        transition: {
          duration: 1.5,
          type: "spring",
        },
      });
    } else if (round > 0 || gameId <= 0) {
      btnControls.start({
        y: 0,
        transition: {
          type: "spring",
          duration: 0.1,
        },
      });
      dealControls.start({
        opacity: 0,
        transition: {
          duration: 0.1,
          type: "spring",
        },
      });
    }
  }, [round, gameId]);
  const total = useMemo(() => {
    const t = betChips.map((c) => c.amount).reduce((sub, c) => sub + c, 0);
    return t;
  }, [betChips]);
  const top = (chipId: number) => {
    return myChipXY["y"];
  };
  const left = (chipId: number) => {
    const x =
      myChipXY["x"] +
      (chipId - Math.ceil(CHIP_SIZE / 2)) * (myChipXY["width"] + myChipXY["scale"] * 15) -
      (myChipXY["width"] + myChipXY["scale"] * 15) / 2;
    return x;
  };

  const getColor = (chipId: number) => {
    switch (chipId) {
      case 1:
        return "white";
      case 2:
        return "blue";
      case 3:
        return "red";
      default:
        return "";
    }
  };
  const putChip = (chipId: number) => {
    const isIndex = betChips.findIndex((c) => c.id === chipId);
    betChips.sort((a, b) => a.no - b.no);
    const chip = {
      no: betChips.length === 0 ? 1 : betChips[betChips.length - 1]["no"] + 1,
      id: chipId,
      status: 0,
      amount: chipId,
      slot: 0,
    };
    betChips.push(chip);
    setBetChips(JSON.parse(JSON.stringify(betChips)));

    const firstIndexs = chip_btns
      .map((p) => {
        const cindex = betChips.findIndex((c) => c.id === p.id);
        return { id: p.id, index: cindex };
      })
      .filter((c) => c.index >= 0)
      .sort((a, b) => a.index - b.index);

    const centerX = viewport["width"] / 2;

    setTimeout(
      () =>
        chipControls.start((o) => {
          if (isIndex < 0 || o.id === chipId) {
            let index = firstIndexs.findIndex((c) => c.id === o.id);
            const x =
              centerX +
              (index - (firstIndexs.length - 1) / 2) * (myChipXY["width"] + myChipXY["scale"] * 15) -
              (myChipXY["width"] + myChipXY["scale"] * 15) / 2;

            return {
              x: x - left(o.id),
              y: -200,
              zIndex: 3000 + o.no,
              transition: {
                duration: 1.5,
                default: { ease: "linear" },
              },
            };
          }
          return {};
        }),
      100
    );
  };
  const retreatChip = async (c: ChipModel) => {
    console.log("retreating chip no:" + c.no);
    const bchips = betChips.filter((b) => b.no !== c.no);
    const isIndex = bchips.findIndex((b) => b.id === c.id);
    chipControls.start((o) => {
      if (o.no === c.no) {
        return {
          x: 0,
          y: 0,
          opacity: 0,
          zIndex: 300,
          transition: {
            duration: 1,
            default: { ease: "linear" },
          },
          transitionEnd: { display: "none" },
        };
      } else if (isIndex < 0) {
        const centerX = viewport["width"] / 2;
        const firstIndexs = chip_btns
          .map((p) => {
            const cindex = bchips.findIndex((c) => c.id === p.id);
            return { id: p.id, index: cindex };
          })
          .filter((c) => c.index >= 0)
          .sort((a, b) => a.index - b.index);
        let index = firstIndexs.findIndex((c) => c.id === o.id);
        const x =
          centerX +
          (index - (firstIndexs.length - 1) / 2) * (myChipXY["width"] + myChipXY["scale"] * 15) -
          (myChipXY["width"] + myChipXY["scale"] * 15) / 2;

        return {
          x: x - left(o.id),
          y: -200,
          zIndex: 100 + o.no,
          transition: {
            duration: 1.5,
            default: { ease: "linear" },
          },
        };
      } else return {};
    });
    setTimeout(() => setBetChips(bchips), 200);
  };
  const checkChip = (chipId: number) => {
    if (chipId !== 4) return true;
    else return false;
  };
  const completeDeal = () => {
    if (betChips?.length > 0) {
      createEvent({ name: "dealCompleted", topic: "", data: null, delay: 10 });
      const firstIndexs = chip_btns
        .map((p) => {
          const cindex = betChips.findIndex((c) => c.id === p.id);
          return { id: p.id, index: cindex };
        })
        .filter((c) => c.index >= 0);
      chipControls.start((o) => {
        const findex = firstIndexs.find((c) => c.id === o.id);

        const scale = 0.2 / chipScale;
        const x = viewport["width"] / 2 - left(o.id) - chipWidth * scale + 3;
        // const y = -chipWidth * scale + 3;
        return {
          opacity: 0,
          x: x - 10,
          y: -200,
          scale: [scale, scale, scale],
          zIndex: (findex ? findex["index"] : 0) + 500,
          transition: {
            duration: 1.5,
            default: { ease: "linear" },
          },
        };
      });
      // betChipControls.start({ opacity: 1, transition: { duration: 1.5 } });
      btnControls.start({
        y: 200,
        transition: {
          type: "spring",
          duration: 1.5,
        },
      });
      dealControls.start({
        opacity: 0,
        transition: {
          duration: 1.5,
          type: "spring",
        },
      });
      deal(0, total);
    }
  };
  return (
    <>
      {round === 0 ? (
        <motion.div
          animate={dealControls}
          style={{
            position: "absolute",
            zIndex: 2000,
            bottom: 60,
            right: 50,
            display: "flex",
            justifyContent: "flex-end",
            width: "100%",
          }}
        >
          <div
            style={{
              cursor: "pointer",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: 70,
              height: 40,
              backgroundColor: betChips?.length > 0 ? "red" : "grey",
              borderRadius: 5,
              color: "white",
            }}
            onClick={completeDeal}
          >
            Deal
          </div>
        </motion.div>
      ) : null}

      {myChipXY && round === 0 ? (
        <>
          {betChips.map((c) => (
            <motion.div
              key={c["no"] + ""}
              custom={c}
              style={{
                cursor: "pointer",
                position: "absolute",
                top: top(c.id),
                left: left(c.id),
              }}
              initial={{ display: "block", zIndex: 3000 + c["no"] }}
              animate={chipControls}
              onClick={() => retreatChip(c)}
            >
              <div key={c["no"] + ""} className={`pokerchip ${getColor(c.id)}`}></div>
            </motion.div>
          ))}
        </>
      ) : null}
      {myChipXY &&
        round === 0 &&
        chip_btns
          .filter((c) => checkChip(c.id))
          .map((c) => (
            <motion.div
              key={c["id"] + ""}
              style={{
                opacity: 0,
                cursor: "pointer",
                position: "absolute",
                zIndex: 2500,
                top: myChipXY ? myChipXY["y"] : 0,
                left: left(c.id),
              }}
              animate={btnControls}
              onClick={() => putChip(c.id)}
            >
              <div key={c["id"] + ""} className={`pokerchip ${getColor(c.id)}`}></div>
            </motion.div>
          ))}
      {/* {myChipXY && (
        <motion.div
          style={{
            position: "absolute",
            zIndex: 500,
            top: myChipXY["y"] - 300,
            left: viewport["width"] / 2,
          }}
          initial={{ opacity: 0, zIndex: 1000 }}
          animate={betChipControls}
        >
          <div className="betchip bred"></div>
        </motion.div>
      )} */}
    </>
  );
};
export default MyChipBox;
