import { useEffect } from "react";
import { APPS, appIcon, appTitle } from "./apps/manifest";
import { APP_COMPONENTS } from "./apps/registry";
import { Desktop } from "./components/Desktop";
import { Taskbar } from "./components/Taskbar";
import { Window } from "./components/Window";
import { Screen } from "./Screen";
import { useOS } from "./store";

export function OS() {
  const order = useOS((st) => st.order);
  const windows = useOS((st) => st.windows);

  // Land on the desktop with About open. `open` is idempotent, so StrictMode's double run is harmless.
  useEffect(() => useOS.getState().open("about"), []);

  return (
    <Screen>
      {/* Any press that reaches the root (i.e. wasn't swallowed by a menu) closes the Start menu. */}
      <div onPointerDown={() => useOS.getState().startOpen && useOS.getState().setStartOpen(false)}>
        <Desktop />
        {order.map((id) => {
          const win = windows[id];
          const App = APP_COMPONENTS[win.app];
          return (
            <Window key={id} win={win} title={appTitle(win.app, win.param)} icon={appIcon(win.app)} resizable={APPS[win.app].resizable}>
              <App win={win} />
            </Window>
          );
        })}
        <Taskbar />
      </div>
    </Screen>
  );
}
