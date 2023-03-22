import { motion, useAnimationControls } from "framer-motion";
import { useMemo, useState } from "react";
import { ChipModel } from "../../model";
import useCoordManager from "../../service/CoordManager";
import "../../styles.css";
const CHIP_SIZE = 3;
const chip_btns = [
  { id: 1, amount: 1 },
  { id: 2, amount: 2 },
  { id: 3, amount: 3 },
];
const MyChipBox = () => {
  const [betChips, setBetChips] = useState<ChipModel[]>([]);
  // const [total, setTotal] = useState(5000);
  const { myChipXY, viewport, betChipXY, chipWidth, seatCoords } = useCoordManager();
  const controls = useAnimationControls();

  const total = useMemo(() => {
    const t = betChips.map((c) => c.amount).reduce((sub, c) => sub + c, 0);
    return t;
  }, [betChips]);
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
    const chip = { no: Date.now(), id: chipId, status: 0, amount: chipId, slot: 0 };
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
        controls.start((o) => {
          if (isIndex < 0 || o.id === chipId) {
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
          }
          return {};
        }),
      100
    );
  };
  const retreatChip = async (c: ChipModel) => {
    const bchips = betChips.filter((b) => b.no !== c.no);
    const isIndex = bchips.findIndex((b) => b.id === c.id);
    controls.start((o) => {
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
  const deal = () => {
    const firstIndexs = chip_btns
      .map((p) => {
        const cindex = betChips.findIndex((c) => c.id === p.id);
        return { id: p.id, index: cindex };
      })
      .filter((c) => c.index >= 0)
      .sort((a, b) => a.index - b.index);
    controls.start((o) => {
      const index = firstIndexs.findIndex((c) => c.id === o.id);
      return {
        x: viewport["width"] / 2 - left(o.id) - myChipXY["width"] / 2,
        y: -400,
        scale: 0.7,
        zIndex: index + 100,
        transition: {
          duration: 1.5,
          default: { ease: "linear" },
        },
      };
    });
  };
  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-around", width: "100%" }}>
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
          onClick={deal}
        >
          Deal
        </div>
      </div>

      {myChipXY ? (
        <motion.div
          style={{
            position: "absolute",
            display: "flex",
            top: myChipXY["y"],
            left: 0,
          }}
        >
          {betChips.map((c) => (
            <motion.div
              key={c["no"] + ""}
              custom={c}
              style={{
                cursor: "pointer",
                position: "absolute",
                top: 0,
                left: left(c.id),
              }}
              initial={{ zIndex: c["no"] }}
              animate={controls}
              onClick={() => retreatChip(c)}
            >
              <div key={c["no"] + ""} className={`pokerchip ${getColor(c.id)}`}></div>
            </motion.div>
          ))}
        </motion.div>
      ) : null}

      {myChipXY &&
        chip_btns
          .filter((c) => checkChip(c.id))
          .map((c) => (
            <div
              key={c["id"] + ""}
              style={{
                cursor: "pointer",
                position: "absolute",
                zIndex: 100,
                top: myChipXY ? myChipXY["y"] : 0,
                left: left(c.id),
              }}
              onClick={() => putChip(c.id)}
            >
              <div key={c["id"] + ""} className={`pokerchip ${getColor(c.id)}`}></div>
            </div>
          ))}
    </>
  );
};
export default MyChipBox;
