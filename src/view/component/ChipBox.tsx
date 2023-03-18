import useCoordManager from "../../service/CoordManager";
import useEventSubscriber from "../../service/EventManager";
import "../../styles.css";
import AnimateBox from "./AnimateBox";
import MyChipBox from "./MyChipBox";

const ChipBox = () => {
  const { myChipXY } = useCoordManager();
  const { createEvent } = useEventSubscriber([], []);

  return (
    <div
      style={{
        position: "relative",
        top: 0,
        left: 0,
        zIndex: 10,
      }}
    >
      {myChipXY ? (
        <>
          <AnimateBox />
          <MyChipBox />
        </>
      ) : null}
      <div
        style={{
          position: "absolute",
          top: 40,
          left: 0,
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          width: "100%",
          zIndex: 1000,
        }}
      >
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
          onClick={() => createEvent({ name: "resetGame", topic: "", data: null, delay: 0 })}
        >
          New
        </div>
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
          onClick={() => createEvent({ name: "dealCompleted", topic: "", data: null, delay: 0 })}
        >
          Deal
        </div>
      </div>
    </div>
  );
};
export default ChipBox;
