import React, { useEffect, useState } from "react";
import "./style.css";

const TYPE_SPEED = 55;
const TYPE_JITTER = 45;
const DELETE_SPEED = 22;
const HOLD_TIME = 1900;
const GAP_TIME = 350;

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Group characters into nowrap words so the live text wraps exactly like the ghosts
const renderTyped = (text, wordIndex) => {
  let offset = 0;
  return text.split(" ").map((token, t) => {
    const start = offset;
    offset += token.length + 1;
    return (
      <React.Fragment key={`${wordIndex}-${t}`}>
        {t > 0 && " "}
        <span className="typed-rotator__token">
          {token.split("").map((ch, i) => (
            <span key={start + i} className="typed-rotator__char">
              {ch}
            </span>
          ))}
        </span>
      </React.Fragment>
    );
  });
};

export const TypedRotator = ({ strings }) => {
  const [wordIndex, setWordIndex] = useState(0);
  const [length, setLength] = useState(0);
  const [phase, setPhase] = useState("typing");
  const reduced = prefersReducedMotion();

  const word = strings[wordIndex] || "";

  useEffect(() => {
    if (reduced) {
      const t = setTimeout(() => {
        setWordIndex((i) => (i + 1) % strings.length);
      }, HOLD_TIME + 600);
      return () => clearTimeout(t);
    }

    let t;
    if (phase === "typing") {
      if (length < word.length) {
        // pause slightly longer after spaces and symbols so it reads naturally
        const prev = word[length - 1];
        const extra = prev === " " || prev === "@" ? 70 : 0;
        t = setTimeout(
          () => setLength(length + 1),
          TYPE_SPEED + Math.random() * TYPE_JITTER + extra
        );
      } else {
        t = setTimeout(() => setPhase("deleting"), HOLD_TIME);
      }
    } else if (phase === "deleting") {
      if (length > 0) {
        t = setTimeout(() => setLength(length - 1), DELETE_SPEED);
      } else {
        t = setTimeout(() => {
          setWordIndex((i) => (i + 1) % strings.length);
          setPhase("typing");
        }, GAP_TIME);
      }
    }
    return () => clearTimeout(t);
  }, [phase, length, word, strings.length, reduced]);

  const idle = reduced || (phase === "typing" && length === word.length);

  return (
    <span className="typed-rotator" aria-label={strings.join(", ")}>
      {/* invisible copies reserve the height of the longest phrase so the layout never shifts */}
      {strings.map((s) => (
        <span key={s} className="typed-rotator__ghost" aria-hidden="true">
          {s}
          <span className="typed-rotator__caret" />
        </span>
      ))}
      <span className="typed-rotator__live" aria-hidden="true">
        {reduced ? (
          <span key={wordIndex} className="typed-rotator__word-fade">
            {word}
          </span>
        ) : (
          renderTyped(word.slice(0, length), wordIndex)
        )}
        <span
          className={`typed-rotator__caret${idle ? " is-idle" : ""}`}
        />
      </span>
    </span>
  );
};
