import React from "react";
import { motion } from "framer-motion";

const items = [
  "Item 1",
  "Item 2",
  "Item 3",
  "Item 4",
  "Item 5",
  "Item 6",
];

const colors = ["#F44336", "#E91E63", "#9C27B0", "#673AB7", "#3F51B5", "#2196F3"];

const CasinoWheel = () => {
  const itemSize = 360 / items.length;
  const [isSpinning, setIsSpinning] = React.useState(false);

  const spin = () => {
    setIsSpinning(true);
    setTimeout(() => {
      setIsSpinning(false);
    }, 5000);
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <motion.div
        animate={{
          rotate: isSpinning ? [0, 360 * 5] : 0,
        }}
        transition={{
          duration: 5,
          ease: "linear",
        }}
        style={{
          width: 300,
          height: 300,
          borderRadius: "50%",
          backgroundColor: "white",
          position: "relative",
          border: "5px solid #ccc",
        }}
      >
        {items.map((item, index) => (
          <motion.div
            key={index}
            style={{
              width: "50%",
              height: "50%",
              position: "absolute",
              top: 0,
              left: 0,
              originX: 1,
              originY: 1,
              backgroundColor: colors[index % colors.length],
            }}
            animate={{ rotate: [0, itemSize * index] }}
            transition={{ duration: 0 }}
          >
            <div
              style={{
                transform: `rotate(${itemSize / 2}deg)`,
                position: "absolute",
                top: 0,
                left: "50%",
                paddingLeft: 10,
                paddingRight: 10,
                textAlign: "center",
                fontWeight: "bold",
                color: "white",
              }}
            >
              {item}
            </div>
          </motion.div>
        ))}
      </motion.div>
      <motion.div
        style={{
          position: "absolute",
          top: "calc(50% - 30px)",
          left: "calc(50% - 1px)",
          width: 2,
          height: 30,
          backgroundColor: "black",
        }}
      />
      <button
        onClick={spin}
        style={{
          position: "fixed",
          bottom: 20,
          backgroundColor: "blue",
          color: "white",
          padding: "10px 20px",
          borderRadius: 4,
          border: "none",
          fontSize: 16,
          cursor: "pointer",
        }}
      >
        Spin
      </button>
    </div>
  );
};

export default CasinoWheel;
