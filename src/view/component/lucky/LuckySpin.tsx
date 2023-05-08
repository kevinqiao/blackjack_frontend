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

const LuckySpin = () => {
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
          backgroundColor: "lightblue",
          position: "relative",
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
              backgroundColor: index % 2 === 0 ? "white" : "gray",
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
              }}
            >
              {item}
            </div>
          </motion.div>
        ))}
      </motion.div>
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

export default LuckySpin;
