import { useId, useState, type ButtonHTMLAttributes, type ReactNode } from "react";
import { PixelIcon } from "../icons/PixelIcon";
import type { IconName } from "../icons/sprites";
import s from "./ui.module.css";

const cx = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(" ");

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Draws the heavy outline of the dialog's default (Enter) button. */
  isDefault?: boolean;
  compact?: boolean;
  pressed?: boolean;
}

export function Button({ isDefault, compact, pressed, className, type = "button", ...rest }: ButtonProps) {
  return (
    <button
      type={type}
      aria-pressed={pressed}
      className={cx(s.button, isDefault && s.default, compact && s.compact, className)}
      {...rest}
    />
  );
}

/** Opens an external URL in a new tab — the OS never navigates the iframe away. */
export function LinkButton({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a className={cx(s.button, s.linkButton)} href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}

export function GroupBox({ label, children, className }: { label: ReactNode; children: ReactNode; className?: string }) {
  return (
    <fieldset className={cx(s.group, className)}>
      <legend>{label}</legend>
      {children}
    </fieldset>
  );
}

export function Sunken({ children, className, style }: { children: ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <div className={cx(s.sunken, className)} style={style}>
      {children}
    </div>
  );
}

export function Divider() {
  return <hr className={s.divider} />;
}

interface FieldProps {
  label: string;
  multiline?: boolean;
  name: string;
  type?: string;
  value: string;
  required?: boolean;
  readOnly?: boolean;
  onChange?: (value: string) => void;
}

export function Field({ label, multiline, name, type = "text", value, required, readOnly, onChange }: FieldProps) {
  const id = useId();
  return (
    <div className={cx(s.fieldRow, multiline && s.fieldRowTop)}>
      <label htmlFor={id}>{label}</label>
      {multiline ? (
        <textarea id={id} name={name} className={s.input} rows={6} value={value} required={required} readOnly={readOnly} onChange={(e) => onChange?.(e.target.value)} />
      ) : (
        <input id={id} name={name} type={type} className={s.input} value={value} required={required} readOnly={readOnly} onChange={(e) => onChange?.(e.target.value)} />
      )}
    </div>
  );
}

export function Tabs({ tabs }: { tabs: { label: string; content: ReactNode }[] }) {
  const [active, setActive] = useState(0);
  const base = useId();
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div role="tablist" className={s.tablist}>
        {tabs.map((t, i) => (
          <button
            key={t.label}
            role="tab"
            id={`${base}-tab-${i}`}
            aria-selected={i === active}
            aria-controls={`${base}-panel`}
            tabIndex={i === active ? 0 : -1}
            className={s.tab}
            onClick={() => setActive(i)}
            onKeyDown={(e) => {
              if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
                const next = (active + (e.key === "ArrowRight" ? 1 : tabs.length - 1)) % tabs.length;
                setActive(next);
                document.getElementById(`${base}-tab-${next}`)?.focus();
              }
            }}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div role="tabpanel" id={`${base}-panel`} aria-labelledby={`${base}-tab-${active}`} className={s.tabpanel}>
        {tabs[active].content}
      </div>
    </div>
  );
}

export function StatusBar({ fields }: { fields: ReactNode[] }) {
  return (
    <div className={s.statusBar}>
      {fields.map((f, i) => (
        <div key={i} className={s.statusField}>
          {f}
        </div>
      ))}
    </div>
  );
}

export function AddressBar({ icon, path }: { icon: IconName; path: string }) {
  return (
    <div className={s.toolbar}>
      <span className={s.toolbarLabel}>Address</span>
      <div className={s.address}>
        <PixelIcon name={icon} size={16} />
        {path}
      </div>
    </div>
  );
}
