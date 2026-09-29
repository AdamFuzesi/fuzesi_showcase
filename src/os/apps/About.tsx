import { aboutMe, contact, socials } from "../../content";
import { PixelIcon } from "../icons/PixelIcon";
import { useOS, type WinState } from "../store";
import { Button, GroupBox, Tabs } from "../ui";
import { General } from "./about/General";
import { Skills } from "./about/Skills";
import a from "./apps.module.css";

/** About Me opens as a System Properties sheet; the General tab is the registration card. */
export function AboutApp({ win }: { win: WinState }) {
  const close = useOS((st) => st.close);

  const bio = (
    <>
      <h3 className={a.heading}>A bit about myself…</h3>
      <p>{aboutMe}</p>
    </>
  );

  const links = (
    <>
      <GroupBox label="Email">
        <ul className={a.linkList}>
          {[contact.MY_EMAIL, contact.MY_ALTEMAIL].map((email) => (
            <li key={email}>
              <a href={`mailto:${email}`}>
                <PixelIcon name="mail" size={16} />
                {email}
              </a>
            </li>
          ))}
        </ul>
      </GroupBox>
      <GroupBox label="Profiles">
        <ul className={a.linkList}>
          {socials.map((s) => (
            <li key={s.label}>
              <a href={s.href} target="_blank" rel="noopener noreferrer">
                <PixelIcon name="globe" size={16} />
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </GroupBox>
    </>
  );

  return (
    <div className={a.column}>
      <div className={a.grow}>
        <Tabs
          tabs={[
            { label: "General", content: <General /> },
            { label: "About Me", content: bio },
            { label: "Skills", content: <Skills /> },
            { label: "Links", content: links },
          ]}
        />
      </div>
      <div className={a.buttonRow}>
        <Button isDefault onClick={() => close(win.id)}>
          OK
        </Button>
        <Button onClick={() => close(win.id)}>Cancel</Button>
      </div>
    </div>
  );
}
