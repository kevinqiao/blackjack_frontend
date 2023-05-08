import { CoordProvider } from "./service/CoordManager";
import { EventProvider } from "./service/EventManager";
import { GameProvider } from "./service/GameManager";
import { TournamentProvider } from "./service/TournamentManager";
import { UserProvider } from "./service/UserManager";
import {SocketProvider} from "./service/SocketManager";

import "./styles.css";
import CasinoWheel from "./view/component/lucky/CasinoWheel";
import LuckySpin from "./view/component/lucky/LuckySpin";
import MainHome from "./view/component/MainHome";
import CountDownClock from "./view/framer/CountDownClock";
import CountDownTimer from "./view/framer/CountDownTimer";

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
  const Providers = FlattenedProviderTree([
    [CoordProvider],
    [EventProvider],
    [SocketProvider],
    [UserProvider],
    [TournamentProvider],
    [GameProvider],
  ]);
  return (
    <Providers>
      {/* <LuckySpin/> */}
      {/* <CasinoWheel/> */}
      <MainHome />
      {/* <CountDownClock/> */}
      {/* <CountDownTimer/> */}
    </Providers>
  );
}

export default App;
