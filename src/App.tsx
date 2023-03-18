import { CoordProvider } from "./service/CoordManager";
import { EventProvider } from "./service/EventManager";
import { GameProvider } from "./service/GameManager";

import "./styles.css";

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
      <ChipBox />
      {/* 
      <div style={{ position: "absolute", zIndex: 600, width: "100%", height: 50 }}>
        <ControlPanel />
      </div>
      <GameOver />

      <div style={{ position: "absolute", zIndex: 400, width: "100%", height: "100%" }}>
        <CardPanel />
        <TurnSeatProgress />
        <SlotScorePanel />
        <BlackJack />
      </div> */}
    </Providers>
  );
}

export default App;
