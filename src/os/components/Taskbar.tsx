import { useEffect, useState } from "react";
import { appIcon, appTitle } from "../apps/manifest";
import { PixelIcon } from "../icons/PixelIcon";
import { useOS } from "../store";
import { StartMenu } from "./StartMenu";
import s from "./Taskbar.module.css";

export function Taskbar() {
  const order = useOS((st) => st.order);
  const windows = useOS((st) => st.windows);
  const activeId = useOS((st) => st.activeId);
  const startOpen = useOS((st) => st.startOpen);
  const { setStartOpen, toggleFromTaskbar } = useOS.getState();

  return (
    <>
      {startOpen && <StartMenu />}
      <nav className={s.taskbar} aria-label="Taskbar">
        <button
          className={s.start}
          aria-pressed={startOpen}
          aria-haspopup="menu"
          aria-expanded={startOpen}
          onPointerDown={(e) => e.stopPropagation()}
          onClick={() => setStartOpen(!startOpen)}
        >
          <PixelIcon name="logo" size={16} />
          <span>Start</span>
        </button>
        <span className={s.grip} aria-hidden="true" />

        <ul className={s.tasks}>
          {order.map((id) => {
            const win = windows[id];
            const pressed = activeId === id && !win.minimized;
            return (
              <li key={id} className={s.taskItem}>
                <button className={s.task} aria-pressed={pressed} onClick={() => toggleFromTaskbar(id)} title={appTitle(win.app, win.param)}>
                  <PixelIcon name={appIcon(win.app)} size={16} />
                  <span className={s.taskLabel}>{appTitle(win.app, win.param)}</span>
                </button>
              </li>
            );
          })}
        </ul>

        <Tray />
      </nav>
    </>
  );
}

function Tray() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    // Tick on the minute boundary, then every minute.
    let interval: number | undefined;
    const timeout = window.setTimeout(() => {
      setNow(new Date());
      interval = window.setInterval(() => setNow(new Date()), 60_000);
    }, 60_000 - (Date.now() % 60_000));
    return () => {
      window.clearTimeout(timeout);
      window.clearInterval(interval);
    };
  }, []);

  const time = now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  const date = now.toLocaleDateString([], { weekday: "long", year: "numeric", month: "long", day: "numeric" });
  return (
    <div className={s.tray}>
      <PixelIcon name="globe" size={16} />
      <time dateTime={now.toISOString()} title={date} aria-label={`${time}, ${date}`}>
        {time}
      </time>
    </div>
  );
}
