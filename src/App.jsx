import React from "react";
import { CoordProvider } from "./service/CoordManager";
import { EventProvider } from "./service/EventManager";
import { GameProvider } from "./service/GameManager";
import "./styles.css";
import CardPanel from "./view/component/CardPanel";

function App() {
  const FlattenedProviderTree = (providers) => {
    if (providers?.length === 1) {
      return providers[0][0];
    }
    const [A, paramsA] = providers.shift();
    const [B, paramsB] = providers.shift();

    return FlattenedProviderTree([
      [
        ({ children }) => (
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
      <CardPanel />
    </Providers>
  );
}

export default App;
