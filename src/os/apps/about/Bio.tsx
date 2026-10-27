import { aboutMe } from "../../../content";
import s from "./Bio.module.css";

/**
 * About Me → About Me, on the same paper stock as the registration card: the headline as a lead,
 * a strip of headline numbers, then each paragraph beside a spec-sheet label.
 */
export function Bio() {
  return (
    <article className={s.sheet} aria-labelledby="bio-headline">
      <p className={s.kicker}>About Me</p>
      <h3 id="bio-headline" className={s.headline}>
        {aboutMe.headline}
      </h3>

      <dl className={s.stats}>
        {aboutMe.stats.map((stat) => (
          <div key={stat.label} className={s.stat}>
            <dd>{stat.value}</dd>
            <dt>{stat.label}</dt>
          </div>
        ))}
      </dl>

      <div className={s.sections}>
        {aboutMe.sections.map((section) => (
          <section key={section.label} className={s.section}>
            <h4>{section.label}</h4>
            <p>{section.text}</p>
          </section>
        ))}
      </div>
    </article>
  );
}
