import { findProject } from "../../content";
import { useOS, type WinState } from "../store";
import { Button, LinkButton } from "../ui";
import a from "./apps.module.css";

/** One project in its own window — opened from the Light Table's "Details…" or the Start menu. */
export function DetailApp({ win }: { win: WinState }) {
  const close = useOS((st) => st.close);
  const project = findProject(win.param);
  if (!project) return <p className={a.pad}>This project could not be found.</p>;

  return (
    <div className={a.column}>
      <div className={`${a.grow} ${a.scroll} ${a.pad}`}>
        <img className={a.hero} src={project.hero} alt={project.name} loading="lazy" decoding="async" />
        <h3 className={a.bigHeading}>{project.name}</h3>
        {project.stack.length > 0 && (
          <ul className={a.tags} aria-label="Stack">
            {project.stack.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        )}
        <p>{project.description}</p>
      </div>
      <div className={a.buttonRow}>
        {project.link && <LinkButton href={project.link}>Visit ↗</LinkButton>}
        <Button isDefault onClick={() => close(win.id)}>
          Close
        </Button>
      </div>
    </div>
  );
}
