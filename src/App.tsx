import { CoordProvider } from "./service/CoordManager";
import { EventProvider } from "./service/EventManager";
import { GameProvider } from "./service/GameManager";

import "./styles.css";
import BlackJack from "./view/component/BlackJack";
import CardPanel from "./view/component/CardPanel";
import ControlPanel from "./view/component/ControlPanel";
import GameOver from "./view/component/GameOver";
import SlotScorePanel from "./view/component/SlotScorePanel";
import SlotChipPanel from "./view/component/common/SlotChipPanel";
import TurnSeatProgress from "./view/component/common/TurnSeatProgress";

function App() {
  const FlattenedProviderTree = (providers: any): any => {
    if (providers?.length === 1) {
      return providers[0][0];
    }
    const [A, paramsA] = providers.shift();
    const [B, paramsB] = providers.shift();

    return FlattenedProviderTree([
      [
        ({ children }: { children: any }) => (
          <A {...(paramsA || {})}>
            <B {...(paramsB || {})}>{children}</B>
          </A>
        ),
      ],
      ...providers,
    ]);
  };
  const Providers = FlattenedProviderTree([[CoordProvider], [EventProvider], [GameProvider]]);
  return (
    <Providers>
      {/* <MyChipBox /> */}

      <div style={{ position: "absolute", zIndex: 600, width: "100%", height: 50 }}>
        <ControlPanel />
      </div>
      <GameOver />

      <div style={{ position: "absolute", zIndex: 400, width: "100%", height: "100%" }}>
        <CardPanel />
        <TurnSeatProgress />
        <SlotScorePanel />
        <SlotChipPanel />
        <BlackJack />
      </div>
    </Providers>
  );
}

export default App;
