import { profile } from "../../../content";
import { useOS } from "../../store";
import { Button } from "../../ui";
import s from "./General.module.css";

/**
 * About Me → General, reimagined as a registration card: the "Registered to" line of a classic
 * System Properties sheet, set in the same outlined display type and spec-sheet labels as the
 * Projects light table, beside a tilted print with the same product-shot lean as the phones.
 */
export function General() {
  const open = useOS((st) => st.open);

  return (
    <article className={s.card} aria-labelledby="about-name">
      <figure className={s.print}>
        <img src={profile.portrait} alt={`${profile.name} on a ridge, camera in hand`} decoding="async" />
      </figure>

      <div className={s.body}>
        <p className={s.kicker}>Registered to</p>
        <h2 id="about-name" className={s.name}>
          {profile.name}
        </h2>
        <p className={s.headline}>{profile.headline}</p>

        <dl className={s.facts}>
          {profile.facts.map((f) => (
            <div key={f.label} className={s.fact}>
              <dt>{f.label}</dt>
              <dd>{f.value}</dd>
            </div>
          ))}
        </dl>

        <div className={s.actions}>
          <Button onClick={() => open("experience")}>Experience…</Button>
          <Button onClick={() => open("projects")}>Projects…</Button>
          <Button onClick={() => open("contact")}>Contact…</Button>
        </div>
      </div>
    </article>
  );
}
