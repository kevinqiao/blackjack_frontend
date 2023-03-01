import { motion } from "framer-motion";
import { useState } from "react";
import PokeCard from "../component/PokeCard";
import "./styles.css";

export default function FramerMain() {
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [rotate, setRotate] = useState(0);
  const draw = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: (i: number) => {
      const delay = 1 + i * 0.5;
      return {
        pathLength: 1,
        opacity: 1,
        transition: {
          pathLength: { delay, type: "spring", duration: 1.5, bounce: 0 },
          opacity: { delay, duration: 0.01 },
        },
      };
    },
  };
  return (
    <>
      {/* <div className="example">
      <div>
        <motion.div
          className="box"
          animate={{ x, y, rotate }}
          transition={{ type: "spring" }}
        />
      </div>
      <div className="inputs">
        <Input value={x} set={setX}>
          x
        </Input>
        <Input value={y} set={setY}>
          y
        </Input>
        <Input value={rotate} set={setRotate} min={-180} max={180}>
          rotate
        </Input>
      </div>
    </div> */}
      {[1, 3].map((i) => (
        <motion.div
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.8 }}
          style={{ x: 500 }}
          animate={{ x: [100, 200, 300, 500] }}
        >
          <PokeCard height={180} width={130} suit={"♥"} color={"red"} value={"K"} rank={13} />
        </motion.div>
      ))}
      <PokeCard height={180} width={130} suit={"♥"} color={"red"} value={"K"} rank={13} />

      <motion.svg width="600" height="600" viewBox="0 0 600 600" initial="hidden" animate="visible">
        <motion.circle cx="100" cy="100" r="80" stroke="#ff0055" variants={draw} custom={1} />
      </motion.svg>
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
        onClick={() => setX(200)}
      >
        Deal
      </div>
    </>
  );
}
