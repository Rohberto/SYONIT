"use client";
import React from "react";
import "./result.css";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const Results = ({ results }) => {
  const voters = results.voters || [];

  // Group vote data
  const yesVoters = voters.filter(v => v.choice === "yes");
  const noVoters = voters.filter(v => v.choice === "no");

  // Aggregate gender/age stats
  const genderStats = {
    yes: yesVoters.reduce((acc, v) => ({ ...acc, [v.gender]: (acc[v.gender] || 0) + 1 }), {}),
    no: noVoters.reduce((acc, v) => ({ ...acc, [v.gender]: (acc[v.gender] || 0) + 1 }), {})
  };

  const ageStats = {
    yes: yesVoters.reduce((acc, v) => ({ ...acc, [v.age]: (acc[v.age] || 0) + 1 }), {}),
    no: noVoters.reduce((acc, v) => ({ ...acc, [v.age]: (acc[v.age] || 0) + 1 }), {})
  };

const chartColors = [
  "#FF6A3D",
  "#3DA5FF",
  "#FFB74D",
  "#81C784",
  "#9575CD",
  "#E57373"
];

const createChartData = (obj) => {
  const keys = Object.keys(obj);
  const values = Object.values(obj);

  return {
    labels: keys,
    datasets: [
      {
        data: values,
        backgroundColor: keys.map((_, i) => chartColors[i % chartColors.length]),
        borderWidth: 0
      }
    ]
  };
};



  return (
    <div className="results-overlay">
      <div className="results-card">

        <h3 className="primer-text">PRIMER</h3>
        <p className="question-text">{results.question || ""}</p>

        {/* AVATARS & CHOICES ROW */}
        <div className="avatar-row">
          {voters.map((v,i) => (
            <div key={i} className="avatar-wrap">
              <div className={`avatar-icon ${v.choice}`}></div>
              <span className="vote-label">{v.choice.toUpperCase()}</span>
              <p className="avatar-name">{v.name}</p>
            </div>
          ))}
        </div>

        <p className="votes-title">ROUND {results.opportunityNumber} — VOTES</p>

        {/* VOTE BUBBLES */}
        <div className="bubble-row">
          {voters.map((v,i) => (
            <div key={i} className={`bubble ${v.choice}`}>
              {v.choice.charAt(0).toUpperCase()}
            </div>
          ))}
        </div>

        {/* SCORE SUMMARY */}
        <div className="results-summary">
          <div className="choice-box yes-box">Y <span>{results.yesVotes}</span></div>
          <div className="choice-box no-box">N <span>{results.noVotes}</span></div>
          <div className="points-box">
            {results.minority?.toUpperCase()} gets +1PT
          </div>
        </div>

        {/* CHARTS */}
        <div className="stats-section">
          <h4>Who voted YES?</h4>
          <div className="chart-row">
            <div>
              <p>By Gender</p>
              <Pie data={createChartData(genderStats.yes)} />
            </div>
            <div>
              <p>By Age</p>
              <Pie data={createChartData(ageStats.yes)} />
            </div>
          </div>

          <h4>Who voted NO?</h4>
          <div className="chart-row">
            <div>
              <p>By Gender</p>
              <Pie data={createChartData(genderStats.no)} />
            </div>
            <div>
              <p>By Age</p>
              <Pie data={createChartData(ageStats.no)} />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Results;
