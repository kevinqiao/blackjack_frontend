import { CoordProvider } from "./service/CoordManager";
import { EventProvider } from "./service/EventManager";
import { GameProvider } from "./service/GameManager";
import "./styles.css";
import CardPanel from "./view/component/CardPanel";
import ControlPanel from "./view/component/ControlPanel";
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
      {/* <ChipBox /> */}
      {/* <PokeCard height={180} width={130} suit={"♥"} color={"red"} value={"K"} rank={13} /> */}
      {/* <Framer /> */}
      {/* <CardBox/> */}
      <ControlPanel />
      <CardPanel />
      <TurnSeatProgress />
    </Providers>
  );
}

export default App;
