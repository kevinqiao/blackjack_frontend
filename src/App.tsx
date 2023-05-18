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
import LobbyHome from "./view/mvp/LobbyHome";
import { NavProvider } from "./service/NavManager";
import TournamentList from "./view/component/lobby/TournamentList";
import Loading from "./view/component/Loading";
import EmojiSelector from "./view/mvp/EmojiSelector";

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
    [UserProvider],
    [SocketProvider],
    [TournamentProvider],
    [GameProvider],
    [NavProvider]
  ]);
  return (
    <Providers>
      <EmojiSelector/>
      {/* <TournamentList/> */}
      {/* <LobbyHome/>
      <Loading/> */}
      {/* <LuckySpin/> */}
      {/* <CasinoWheel/> */}
      {/* <MainHome /> */}
      {/* <CountDownClock/> */}
      {/* <CountDownTimer/> */}
    </Providers>
  );
}

export default App;
