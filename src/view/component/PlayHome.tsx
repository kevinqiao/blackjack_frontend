import CardPanel from "./CardPanel";
import ControlPanel from "./ControlPanel";
import GameOver from "./GameOver";
import MyChipBox from "./MyChipBox";
import PlayTable from "./PlayTable";
import SlotScorePanel from "./SlotScorePanel";
import PlaceBetClockDown from "./common/PlaceBetClockDown";
import SeatAvatar from "./common/SeatAvatar";
import SlotChipPanel from "./common/SlotChipPanel";
import TurnCountDown from "./common/TurnCountDown";

function PlayHome() {
  return (
    <>
      <PlayTable />
      <SeatAvatar />
      <MyChipBox />
      <ControlPanel />
      <GameOver />
      <CardPanel />
      <TurnCountDown />
      <PlaceBetClockDown />
      <SlotScorePanel />
      <SlotChipPanel />
    </>
  );
}

export default PlayHome;
