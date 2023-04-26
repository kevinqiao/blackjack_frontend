import CardPanel from "./CardPanel";
import ControlPanel from "./ControlPanel";
import GameOver from "./GameOver";
import MyChipBox from "./MyChipBox";
import PlayTable from "./PlayTable";
import SlotScorePanel from "./SlotScorePanel";
import SeatAvatar from "./common/SeatAvatar";
import SlotChipPanel from "./common/SlotChipPanel";
import TurnClockDown from "./common/TurnClockDown";

function PlayHome() {
  return (
    <>
      <PlayTable />
      <SeatAvatar />
      <MyChipBox />
      <ControlPanel />
      <GameOver />
      <CardPanel />
      <TurnClockDown />
      <SlotScorePanel />
      <SlotChipPanel />
    </>
  );
}

export default PlayHome;
