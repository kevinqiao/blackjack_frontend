import { createContext, useContext, useEffect, useState } from "react";
const CHIP_RADIUS = 151;
const AVATAR_RADIUS = 100;
const CoordContext = createContext<any>(null);

const initChipCSS = (scale: number) => {
  const r: HTMLElement | null = document.querySelector(":root");
  // var rs = getComputedStyle(r);
  if (r?.style) {
    r.style.setProperty("--cx", CHIP_RADIUS * scale + "px");
    r.style.setProperty("--c1x", 117 * scale + "px");
    r.style.setProperty("--c2x", 111 * scale + "px");
    r.style.setProperty("--tx", 9 * scale * 1.1 + "px");
    r.style.setProperty("--t2x", 20 * scale + "px");
    r.style.setProperty("--fontSize", 50 * scale + "px/" + 111 * scale + "px");
    r.style.setProperty("--lg1", 67.5 * scale + "px");
    r.style.setProperty("--lg2", 83.5 * scale + "px");
    r.style.setProperty("--lg3", 97.4304 * scale + "px");
    r.style.setProperty("--lg4", 113.4304 * scale + "px");
    r.style.setProperty("--lgb1", 69.5 * scale + "px");
    r.style.setProperty("--lgb2", 81.5 * scale + "px");
    r.style.setProperty("--lgb3", 98.7104 * scale + "px");
    r.style.setProperty("--lgb4", 110.7104 * scale + "px");
    r.style.setProperty("--br1", 8 * scale + "px");
    r.style.setProperty("--bs0", -1 * scale + "px");
    r.style.setProperty("--bs1", 1 * scale + "px");
    r.style.setProperty("--bs2", 3 * scale + "px");
    r.style.setProperty("--bs3", 5 * scale + "px");
  }
};
const initBetChipCSS = (scale: number) => {
  const r: HTMLElement | null = document.querySelector(":root");
  // var rs = getComputedStyle(r);
  if (r?.style) {
    r.style.setProperty("--bcx", CHIP_RADIUS * scale + "px");
    r.style.setProperty("--bc1x", 117 * scale + "px");
    r.style.setProperty("--bc2x", 111 * scale + "px");
    r.style.setProperty("--btx", 9 * scale * 1.1 + "px");
    r.style.setProperty("--bt2x", 20 * scale + "px");
    r.style.setProperty("--bfontSize", 50 * scale + "px/" + 111 * scale + "px");
    r.style.setProperty("--blg1", 67.5 * scale + "px");
    r.style.setProperty("--blg2", 83.5 * scale + "px");
    r.style.setProperty("--blg3", 97.4304 * scale + "px");
    r.style.setProperty("--blg4", 113.4304 * scale + "px");
    r.style.setProperty("--blgb1", 69.5 * scale + "px");
    r.style.setProperty("--blgb2", 81.5 * scale + "px");
    r.style.setProperty("--blgb3", 98.7104 * scale + "px");
    r.style.setProperty("--blgb4", 110.7104 * scale + "px");
    r.style.setProperty("--bbr1", 8 * scale + "px");
    r.style.setProperty("--bbs0", -1 * scale + "px");
    r.style.setProperty("--bbs1", 1 * scale + "px");
    r.style.setProperty("--bbs2", 3 * scale + "px");
    r.style.setProperty("--bbs3", 5 * scale + "px");
  }
};
const initAvatarCSS = (scale: number) => {
  const r: HTMLElement | null = document.querySelector(":root");
  if (r?.style) r.style.setProperty("--avatar-radius", AVATAR_RADIUS * scale + "px");
};
const initCardCSS = (scale: number) => {
  const r: HTMLElement | null = document.querySelector(":root");
  // var rs = getComputedStyle(r);
  if (r?.style) {
    r.style.setProperty("--card-font-size", 1.2 * scale + "em");
    r.style.setProperty("--card-star-size", 2 * scale + "em");
  }
};
export const CoordProvider = ({ children }: { children: HTMLElement }) => {
  const [value, setValue] = useState({});
  const updateCoord = () => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const v: any = { width: w, height: h };
    const scale: number = w > 700 ? (700 * 0.5) / (5 * CHIP_RADIUS) : (w * 0.5) / (5 * CHIP_RADIUS);
    // initChipCSS(scale >= 1 ? 1 : scale);
    initChipCSS(scale);
    initBetChipCSS(0.2);
    initAvatarCSS(scale);
    const myChipX = w / 2;
    const myChipY = h - scale * CHIP_RADIUS - 60;
    const myChip = { x: myChipX, y: myChipY, width: scale * CHIP_RADIUS, height: scale * CHIP_RADIUS, scale: scale };

    v["myChipXY"] = myChip;
    v["chipScale"] = scale;

    v["chipWidth"] = scale * 121;
    v["viewport"] = { width: w, height: h };

    let cardWidth = (130 / 1000) * (w > 1000 ? 1000 : w);
    cardWidth = cardWidth < 70 ? 70 : cardWidth;
    const cardHeight = (cardWidth * 180) / 130;

    initCardCSS(cardWidth / 130);
    v["cardXY"] = { width: cardWidth, height: cardHeight };

    v["seatCoords"] = [];
    const seat0 = { no: 0, direction: 0, x: w / 2, y: h - cardHeight - 20, dx: 0.3 };
    const seat1 = { no: 1 };
    const seat2 = { no: 2 };
    const seat3 = { no: 3, direction: 0, x: w / 2, y: 40, dx: 0.3 };
    v["seatCoords"].push(seat0);
    v["seatCoords"].push(seat1);
    v["seatCoords"].push(seat2);
    v["seatCoords"].push(seat3);
    if (w < h) {
      Object.assign(seat1, { direction: 0, x: cardWidth * 1.3, y: h / 2 - cardHeight / 2, dx: 0.15, cards: 6 });
      Object.assign(seat2, { direction: 0, x: w - cardWidth, y: h / 2 - cardHeight / 2, dx: 0.15, cards: 6 });
    } else {
      Object.assign(seat1, { direction: 0, x: cardWidth, y: h / 2, dx: 0.15, cards: 0 });
      Object.assign(seat2, { direction: 0, x: w - cardWidth, y: h / 2, dx: 0.15, cards: 0 });
    }
    setValue(v);
  };
  useEffect(() => {
    updateCoord();
    window.addEventListener("resize", updateCoord, true);
    return () => window.removeEventListener("resize", updateCoord, true);
  }, []);

  return <CoordContext.Provider value={value}> {children} </CoordContext.Provider>;
};

const useCoordManager = () => {
  return useContext(CoordContext);
};
export default useCoordManager;
