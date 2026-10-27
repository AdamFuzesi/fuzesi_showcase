import { aboutMe } from "../../../content";
import s from "./Bio.module.css";

/** About Me → About Me, on the same paper stock as the registration card: a lead line, then the bio as running text. */
export function Bio() {
  return (
    <article className={s.sheet} aria-labelledby="bio-headline">
      <p className={s.kicker}>About Me</p>
      <h3 id="bio-headline" className={s.headline}>
        {aboutMe.headline}
      </h3>

      <div className={s.text}>
        {aboutMe.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </article>
  );
}
