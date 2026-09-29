import { useState, type KeyboardEvent } from "react";
import { involvement } from "../../content";
import { PixelIcon } from "../icons/PixelIcon";
import type { IconName } from "../icons/sprites";
import { LinkButton, Sunken, Tabs } from "../ui";
import { Work } from "./experience/Work";
import a from "./apps.module.css";

/** Work history and involvement, as two tabs of one properties sheet. */
export function ExperienceApp() {
  return (
    <div className={a.column}>
      <div className={a.grow}>
        <Tabs
          tabs={[
            { label: "Work", content: <Work /> },
            { label: "Involvement", content: <Involvement /> },
          ]}
        />
      </div>
    </div>
  );
}

/** Arrow-key selection shared by the list views below. */
function useListSelection(count: number) {
  const [selected, setSelected] = useState(0);
  const onKeyDown = (e: KeyboardEvent<HTMLElement>, i: number) => {
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
    e.preventDefault();
    const next = Math.min(Math.max(i + (e.key === "ArrowDown" ? 1 : -1), 0), count - 1);
    (e.currentTarget.parentElement?.children[next] as HTMLElement | undefined)?.focus();
  };
  return { selected, setSelected, onKeyDown };
}

function Involvement() {
  const { selected, setSelected, onKeyDown } = useListSelection(involvement.length);
  const item = involvement[selected];
  return (
    <div className={a.split}>
      <Sunken className={a.scroll}>
        <ul className={a.list} role="listbox" aria-label="Involvement">
          {involvement.map((entry, i) => (
            <li
              key={entry.id}
              role="option"
              tabIndex={i === selected ? 0 : -1}
              aria-selected={i === selected}
              onClick={() => setSelected(i)}
              onFocus={() => setSelected(i)}
              onKeyDown={(e) => onKeyDown(e, i)}
            >
              <Label icon="people" text={entry.title} />
            </li>
          ))}
        </ul>
      </Sunken>
      <Sunken className={`${a.scroll} ${a.pad}`}>
        <article key={item.id}>
          <img className={a.hero} src={item.hero} alt="" loading="lazy" decoding="async" />
          <h3 className={a.heading}>{item.title}</h3>
          <p>{item.description}</p>
          {item.link && <LinkButton href={item.link}>Visit ↗</LinkButton>}
        </article>
      </Sunken>
    </div>
  );
}

function Label({ icon, text }: { icon: IconName; text: string }) {
  return (
    <span className={a.rowLabel}>
      <PixelIcon name={icon} size={16} />
      <span>{text}</span>
    </span>
  );
}
