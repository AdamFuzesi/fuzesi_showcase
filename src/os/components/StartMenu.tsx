import { projects } from "../../content";
import { useOS } from "../store";
import { Menu, type MenuEntry } from "./Menu";
import s from "./StartMenu.module.css";

export function StartMenu() {
  const { open, setStartOpen } = useOS.getState();

  const items: MenuEntry[] = [
    { label: "About Me", icon: "computer", onSelect: () => open("about") },
    { label: "Experience & Background", icon: "briefcase", onSelect: () => open("experience") },
    {
      label: "Projects",
      icon: "folder",
      children: [
        { label: "Open Light Table", icon: "folder", onSelect: () => open("projects") },
        { separator: true },
        ...projects.map((p): MenuEntry => ({ label: p.name, onSelect: () => open("detail", p.id) })),
      ],
    },
    { separator: true },
    { label: "Contact", icon: "mail", onSelect: () => open("contact") },
  ];

  return (
    <div className={s.root} onPointerDown={(e) => e.stopPropagation()}>
      <Menu
        label="Start"
        size="large"
        autoFocus
        items={items}
        onDismiss={() => setStartOpen(false)}
        banner={
          <div className={s.banner} aria-hidden="true">
            <span className={s.bannerText}>
              <b>AdamOS</b> 98
            </span>
          </div>
        }
      />
    </div>
  );
}
