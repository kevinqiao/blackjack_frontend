import { useMemo, useState } from "react";
import useCoordManager from "../../service/CoordManager";
import useEventSubscriber from "../../service/EventManager";
import "../../styles.css";

const MyChipBox = () => {
  const [betChips, setBetChips] = useState([]);
  const [total, setTotal] = useState(4);
  const { myChipXY, betChipXY, chipWidth } = useCoordManager();

  const { createEvent } = useEventSubscriber([]);

  const myChips1 = useMemo(() => {
    const chips = betChips.find((c) => c.id === 1);
    if (!chips || chips.items.length < total) return true;
    else return false;
  }, [total, betChips]);
  const myChips2 = useMemo(() => {
    const chips = betChips.find((c) => c.id === 2);
    if (!chips || chips.items.length < total) return true;
    else return false;
  }, [total, betChips]);
  const myChips3 = useMemo(() => {
    const chips = betChips.find((c) => c.id === 3);
    if (!chips || chips.items.length < total) return true;
    else return false;
  }, [total, betChips]);
  return (
    <>
      {myChipXY ? (
        <div
          style={{
            position: "absolute",
            display: "flex",
            top: myChipXY["y"],
            left: myChipXY["x"],
            zIndex: 50,
          }}
        >
          {myChips1 ? (
            <div
              style={{
                cursor: "pointer",
              }}
              onClick={() => createEvent({ name: "addChip", id: 1 })}
            >
              <div className="pokerchip blue"></div>
            </div>
          ) : (
            <div className="blankchip" />
          )}
          {myChips2 ? (
            <div
              style={{
                cursor: "pointer",
              }}
              onClick={() => createEvent({ name: "addChip", id: 2 })}
            >
              <div className="pokerchip red"></div>
            </div>
          ) : (
            <div className="blankchip" />
          )}
          {myChips3 ? (
            <div
              style={{
                cursor: "pointer",
              }}
              onClick={() => createEvent({ name: "addChip", id: 3 })}
            >
              <div className="pokerchip green"></div>
            </div>
          ) : (
            <div className="blankchip" />
          )}
        </div>
      ) : null}
    </>
  );
};
export default MyChipBox;
