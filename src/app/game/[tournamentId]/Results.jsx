"use client";
import React, { useEffect, useMemo, useState } from "react";
import "./result.css";

/**
 * Simple round result: who was in the minority, the vote split, and what it means for YOU.
 * results: { yesVotes, noVotes, minority, voters }   myVote: "yes" | "no" | null
 */
const AUTO_CLOSE_MS = 7000;
const MAX_NAMES = 6;

const LABELS = {
  male: "Male",
  female: "Female",
  other: "Other",
  unknown: "Unknown",
};

/** Count votes per category (e.g. gender) for each side */
function breakdown(voters, key) {
  const rows = {};
  voters.forEach((v) => {
    const cat = v[key] || "unknown";
    rows[cat] = rows[cat] || { yes: 0, no: 0 };
    if (v.choice === "yes") rows[cat].yes += 1;
    else if (v.choice === "no") rows[cat].no += 1;
  });
  return Object.entries(rows).sort((a, b) => b[1].yes + b[1].no - (a[1].yes + a[1].no));
}

function BreakdownRows({ title, rows }) {
  if (!rows.length) return null;
  const max = Math.max(1, ...rows.map(([, c]) => Math.max(c.yes, c.no)));
  return (
    <div className="rs-group">
      <h4 className="rs-group-title">{title}</h4>
      {rows.map(([cat, c]) => (
        <div className="rs-row" key={cat}>
          <span className="rs-row-num rs-row-num--yes">{c.yes}</span>
          <div className="rs-row-bar rs-row-bar--yes"><i style={{ width: `${(c.yes / max) * 100}%` }} /></div>
          <span className="rs-row-label">{LABELS[cat] || cat}</span>
          <div className="rs-row-bar rs-row-bar--no"><i style={{ width: `${(c.no / max) * 100}%` }} /></div>
          <span className="rs-row-num rs-row-num--no">{c.no}</span>
        </div>
      ))}
    </div>
  );
}

const Results = ({ results, myVote, onClose }) => {
  const [showWho, setShowWho] = useState(false);
  const voters = useMemo(() => results.voters || [], [results]);
  const gender = useMemo(() => breakdown(voters, "gender"), [voters]);
  const age = useMemo(() => breakdown(voters, "age"), [voters]);
  const namesFor = (side) => {
    const list = voters.filter((v) => v.choice === side).map((v) => v.name);
    return { shown: list.slice(0, MAX_NAMES), extra: Math.max(0, list.length - MAX_NAMES) };
  };

  // Close automatically after a few seconds, unless the player opened "who voted what"
  useEffect(() => {
    if (showWho || !onClose) return;
    const t = setTimeout(onClose, AUTO_CLOSE_MS);
    return () => clearTimeout(t);
  }, [showWho, onClose]);

  const yes = results.yesVotes ?? (results.voters || []).filter((v) => v.choice === "yes").length;
  const no = results.noVotes ?? (results.voters || []).filter((v) => v.choice === "no").length;
  const total = yes + no;

  const minoritySide = yes < no ? "yes" : no < yes ? "no" : null;
  const minorityCount = minoritySide === "yes" ? yes : minoritySide === "no" ? no : 0;
  const hasMinority = minoritySide !== null && minorityCount > 0;

  const title = hasMinority
    ? `${minoritySide.toUpperCase()} was the minority`
    : total === 0
    ? "Nobody voted"
    : yes === no
    ? "It was a tie"
    : "Everyone voted the same";

  const subtitle = hasMinority ? "Minority voters scored +1 point" : "Nobody scores this time";

  let personal = null;
  if (!myVote) {
    personal = { tone: "neutral", text: "You didn't vote this time" };
  } else if (hasMinority && myVote === minoritySide) {
    personal = { tone: "win", text: `You voted ${myVote.toUpperCase()}. You scored +1!` };
  } else if (hasMinority) {
    personal = { tone: "lose", text: `You voted ${myVote.toUpperCase()}. No point this time` };
  } else {
    personal = { tone: "neutral", text: `You voted ${myVote.toUpperCase()}` };
  }

  const yesPct = total ? Math.round((yes / total) * 100) : 50;

  return (
    <div className="results-overlay" onClick={onClose} role="dialog" aria-label="Round result">
      <div className="results-card rs-card" onClick={(e) => e.stopPropagation()}>
        {onClose && (
          <button className="results-close" onClick={onClose} aria-label="Close result">
            ×
          </button>
        )}

        <p className="rs-kicker">RESULT</p>
        <h2 className="rs-title">{title}</h2>
        <p className="rs-sub">{subtitle}</p>

        <div className="rs-split" aria-label={`Yes ${yes}, No ${no}`}>
          <div className={`rs-side rs-yes ${minoritySide === "yes" && hasMinority ? "is-minority" : ""}`}>
            <span className="rs-count">{yes}</span>
            <span className="rs-label">YES</span>
          </div>
          <div className={`rs-side rs-no ${minoritySide === "no" && hasMinority ? "is-minority" : ""}`}>
            <span className="rs-count">{no}</span>
            <span className="rs-label">NO</span>
          </div>
        </div>
        <div className="rs-bar" aria-hidden="true">
          <div className="rs-bar-yes" style={{ width: `${yesPct}%` }} />
        </div>

        {personal && <p className={`rs-me rs-me--${personal.tone}`}>{personal.text}</p>}
        {voters.length > 0 && (
          <button type="button" className="rs-who-btn" onClick={() => setShowWho((v) => !v)} aria-expanded={showWho}>
            {showWho ? "Hide who voted what" : "See who voted what"}
          </button>
        )}

        {showWho && (
          <div className="rs-who">
            <div className="rs-who-head"><span>YES</span><span>NO</span></div>
            <BreakdownRows title="By gender" rows={gender} />
            <BreakdownRows title="By age" rows={age} />
            {["yes", "no"].map((side) => {
              const { shown, extra } = namesFor(side);
              return shown.length ? (
                <p className="rs-names" key={side}>
                  <b>{side.toUpperCase()}:</b> {shown.join(", ")}
                  {extra > 0 ? ` +${extra} more` : ""}
                </p>
              ) : null;
            })}
          </div>
        )}

        <p className="rs-hint">{showWho ? "Tap outside to close" : "Tap anywhere to continue"}</p>
      </div>
    </div>
  );
};

export default Results;
