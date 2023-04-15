import { CoordProvider } from "./service/CoordManager";
import { EventProvider } from "./service/EventManager";
import { GameProvider } from "./service/GameManager";
import { TournamentProvider } from "./service/TournamentManager";
import { UserProvider } from "./service/UserManager";

import "./styles.css";
import MainHome from "./view/component/MainHome";

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
    [TournamentProvider],
    [GameProvider],
  ]);
  return (
    <Providers>
      <MainHome />
    </Providers>
  );
}

export default App;
