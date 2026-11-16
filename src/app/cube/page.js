"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Header from "../Components/MainHeader";
import { useUser } from "../Context/userContext";
import { toast } from "react-toastify";
import "./cube.css";

const CUBE_FACES = [
  {
    faceId: 1, part: "Part I", title: "Foundations of the Cube", color: "#f97316",
    steps: [
      { stepId: 1,  name: "Vision & Aspirations™",                           points: 6 },
      { stepId: 2,  name: "Big Idea™",                                        points: 5 },
      { stepId: 3,  name: "Attributes: Character, Competence, Core Values™",  points: 5 },
    ],
  },
  {
    faceId: 2, part: "Part II", title: "Discovery & Opportunity", color: "#a78bfa",
    steps: [
      { stepId: 4,  name: "Discover Opportunities™",             points: 4 },
      { stepId: 5,  name: "Extraction™",                          points: 4 },
      { stepId: 6,  name: "Benchmark Successful Examples™",       points: 4 },
      { stepId: 7,  name: "Market Analysis – Perception Audit™",  points: 4 },
      { stepId: 8,  name: "Study How Others Achieve Success™",    points: 3 },
    ],
  },
  {
    faceId: 3, part: "Part III", title: "Design & Differentiation", color: "#60a5fa",
    steps: [
      { stepId: 9,  name: "Key Success Factors™",        points: 5 },
      { stepId: 10, name: "Define Products & Services™", points: 5 },
      { stepId: 11, name: "Differentiate Attributes™",   points: 4 },
      { stepId: 12, name: "Decide Market Direction™",    points: 4 },
    ],
  },
  {
    faceId: 4, part: "Part IV", title: "Experience & Validation", color: "#34d399",
    steps: [
      { stepId: 13, name: "Distribution Channels™",  points: 4 },
      { stepId: 14, name: "Experience Economy™",      points: 4 },
      { stepId: 15, name: "Simulate Scenarios™",      points: 4 },
      { stepId: 16, name: "Refine Concepts™",         points: 4 },
      { stepId: 17, name: "Validate Assumptions™",    points: 4 },
    ],
  },
  {
    faceId: 5, part: "Part V", title: "Strategy & Systems", color: "#f472b6",
    steps: [
      { stepId: 18, name: "Strategy (Core Roadmap)™",        points: 5 },
      { stepId: 19, name: "Integrate Systems & Teams™",      points: 4 },
      { stepId: 20, name: "Mission Marketing / CSR™",        points: 4 },
      { stepId: 21, name: "Communication (Marketing Docs)™", points: 4 },
      { stepId: 22, name: "Network & Marketing Outreach™",   points: 4 },
    ],
  },
  {
    faceId: 6, part: "Part VI", title: "Execution & Tracking", color: "#fbbf24",
    steps: [
      { stepId: 23, name: "Implementation Plan™",  points: 5 },
      { stepId: 24, name: "Routine Tracking™",      points: 3 },
    ],
  },
];

function CubeVisual({ faces, totalUnlocked }) {
  const [rotation, setRotation] = useState({ x: -20, y: 45 });
  const [dragging, setDragging] = useState(false);
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 });

  const startDrag = (x, y) => { setDragging(true); setLastPos({ x, y }); };
  const moveDrag  = (x, y) => {
    if (!dragging) return;
    setRotation(r => ({ x: r.x - (y - lastPos.y) * 0.5, y: r.y + (x - lastPos.x) * 0.5 }));
    setLastPos({ x, y });
  };

  const SLOTS = [
    { cls: "cf-front",  idx: 0 },
    { cls: "cf-back",   idx: 1 },
    { cls: "cf-right",  idx: 2 },
    { cls: "cf-left",   idx: 3 },
    { cls: "cf-top",    idx: 4 },
    { cls: "cf-bottom", idx: 5 },
  ];

  return (
    <div className="cube-wrap">
      <div
        className="cube-scene"
        onMouseDown={e => startDrag(e.clientX, e.clientY)}
        onMouseMove={e => moveDrag(e.clientX, e.clientY)}
        onMouseUp={() => setDragging(false)}
        onMouseLeave={() => setDragging(false)}
        onTouchStart={e => startDrag(e.touches[0].clientX, e.touches[0].clientY)}
        onTouchMove={e => { e.preventDefault(); moveDrag(e.touches[0].clientX, e.touches[0].clientY); }}
        onTouchEnd={() => setDragging(false)}
      >
        <div className="cube-3d" style={{ transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)` }}>
          {SLOTS.map(({ cls, idx }) => {
            const face = faces[idx] || CUBE_FACES[idx];
            const done = face.faceComplete;
            return (
              <div
                key={cls}
                className={`cube-face ${cls} ${done ? "face-done" : ""}`}
                style={done ? { background: face.color + "44", borderColor: face.color } : {}}
              >
                <span className="face-roman">{face.part.split(" ")[1]}</span>
                {done && <span className="face-check">✓</span>}
              </div>
            );
          })}
        </div>
      </div>
      <p className="cube-count-lbl">{totalUnlocked} / 24 steps unlocked</p>
      <p className="cube-drag-hint">Drag to rotate</p>
    </div>
  );
}

function ConfirmModal({ step, globalPoints, onConfirm, onCancel, loading }) {
  const canAfford = globalPoints >= step.points;
  return (
    <div className="modal-backdrop">
      <div className="modal-box">
        <h3 className="modal-title">Unlock Step {step.stepId}?</h3>
        <p className="modal-step-name">{step.name}</p>
        <div className="modal-row"><span>Cost</span><span className="modal-cost">{step.points} pts</span></div>
        <div className="modal-row">
          <span>Your Points</span>
          <span className={canAfford ? "pts-ok" : "pts-low"}>{globalPoints} pts</span>
        </div>
        {!canAfford && <p className="modal-warn">You need {step.points - globalPoints} more points.</p>}
        <div className="modal-actions">
          <button className="btn-cancel" onClick={onCancel}>Cancel</button>
          <button className="btn-unlock" onClick={onConfirm} disabled={!canAfford || loading}>
            {loading ? "Unlocking..." : "Unlock"}
          </button>
        </div>
      </div>
    </div>
  );
}

function CompleteModal({ onClose }) {
  return (
    <div className="modal-backdrop">
      <div className="modal-box modal-complete">
        <div className="trophy-icon">🏆</div>
        <h2 className="complete-title">Cube Complete!</h2>
        <p className="complete-body">You've unlocked all 24 steps of the IAM Whealthbeing Cube.</p>
        <p className="complete-sub">Your prize has been recorded. Our team will be in touch!</p>
        <button className="btn-unlock" style={{ marginTop: 20, width: "100%" }} onClick={onClose}>Awesome!</button>
      </div>
    </div>
  );
}

export default function CubePage() {
  const { user, setUser, token } = useUser();
  const router = useRouter();
  const url = process.env.NEXT_PUBLIC_SOCKET_URL;

  const defaultFaces = CUBE_FACES.map(f => ({
    ...f,
    steps: f.steps.map(s => ({ ...s, unlocked: false })),
    faceComplete: false,
  }));

  const [faces, setFaces]                 = useState(defaultFaces);
  const [totalUnlocked, setTotalUnlocked] = useState(0);
  const [cubeComplete, setCubeComplete]   = useState(false);
  const [globalPoints, setGlobalPoints]   = useState(0);
  const [activeFace, setActiveFace]       = useState(null);
  const [confirmStep, setConfirmStep]     = useState(null);
  const [unlocking, setUnlocking]         = useState(false);
  const [showComplete, setShowComplete]   = useState(false);
  const [loading, setLoading]             = useState(true);

  useEffect(() => { if (!loading && !user) router.push("/login"); }, [user, loading]);
  useEffect(() => { if (user?.globalPoints !== undefined) setGlobalPoints(user.globalPoints); }, [user]);

  const fetchProgress = useCallback(async () => {
    if (!user?.id) return;
    try {
      const res = await fetch(`${url}/api/cube/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setFaces(data.faces);
      setTotalUnlocked(data.totalUnlocked);
      setCubeComplete(data.cubeComplete);
      setGlobalPoints(data.globalPoints);
    } catch {
      toast.error("Failed to load cube progress");
    } finally {
      setLoading(false);
    }
  }, [user?.id, token, url]);

  useEffect(() => { fetchProgress(); }, [fetchProgress]);

  const handleUnlock = async () => {
    if (!confirmStep || unlocking) return;
    setUnlocking(true);
    try {
      const res = await fetch(`${url}/api/cube/unlock`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ userId: user.id, stepId: confirmStep.stepId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      toast.success(`✅ "${confirmStep.name}" unlocked!`);
      const updatedUser = { ...user, globalPoints: data.globalPoints };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setGlobalPoints(data.globalPoints);
      setConfirmStep(null);
      await fetchProgress();
      if (data.cubeComplete) setShowComplete(true);
    } catch (err) {
      toast.error(err.message || "Failed to unlock step");
    } finally {
      setUnlocking(false);
    }
  };

  if (loading) {
    return (
      <div className="cube-page">
        <Header />
        <div className="cube-loading">
          <div className="cube-spinner" />
          <p>Loading your cube...</p>
        </div>
      </div>
    );
  }

  const activeFaceData = faces.find(f => f.faceId === activeFace);

  return (
    <div className="cube-page">
      <Header />

      <div className="pts-pill-row">
        <span className="pts-pill">{globalPoints} PTS</span>
      </div>

      <p className="page-heading">IAM Whealthbeing Cube</p>
      <p className="page-sub">Unlock all 24 steps to win a prize</p>

      <CubeVisual faces={faces} totalUnlocked={totalUnlocked} />

      <div className="bar-row">
        <div className="bar-track">
          <div className="bar-fill" style={{ width: `${Math.round((totalUnlocked / 24) * 100)}%` }} />
        </div>
        <span className="bar-pct">{Math.round((totalUnlocked / 24) * 100)}%</span>
      </div>

      {cubeComplete && (
        <div className="complete-badge" onClick={() => setShowComplete(true)}>
          🏆 Cube Complete — Prize Unlocked!
        </div>
      )}

      <div className="face-tabs">
        {faces.map(face => (
          <button
            key={face.faceId}
            className={`face-tab ${activeFace === face.faceId ? "tab-open" : ""} ${face.faceComplete ? "tab-done" : ""}`}
            style={{ "--fc": face.color }}
            onClick={() => setActiveFace(activeFace === face.faceId ? null : face.faceId)}
          >
            <span className="tab-part">{face.part}</span>
            <span className="tab-title">{face.title}</span>
            {face.faceComplete && <span className="tab-check">✓</span>}
          </button>
        ))}
      </div>

      {activeFaceData && (
        <div className="face-detail" style={{ "--fc": activeFaceData.color }}>
          <div className="face-det-header">
            <div>
              <p className="det-part">{activeFaceData.part}</p>
              <p className="det-title">{activeFaceData.title}</p>
            </div>
            <span className="det-count">
              {activeFaceData.steps.filter(s => s.unlocked).length}/{activeFaceData.steps.length}
            </span>
          </div>
          {activeFaceData.steps.map(step => (
            <div
              key={step.stepId}
              className={`step-row ${step.unlocked ? "step-done" : "step-locked"}`}
              onClick={() => !step.unlocked && setConfirmStep(step)}
            >
              <div className="step-info">
                <span className="step-num">Step {step.stepId}</span>
                <span className="step-name">{step.name}</span>
              </div>
              <div className="step-right">
                {step.unlocked ? (
                  <span className="step-tick">✓</span>
                ) : (
                  <div className="step-cost-wrap">
                    <span>🔒</span>
                    <span className="step-pts">{step.points} pts</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {confirmStep && (
        <ConfirmModal
          step={confirmStep}
          globalPoints={globalPoints}
          onConfirm={handleUnlock}
          onCancel={() => setConfirmStep(null)}
          loading={unlocking}
        />
      )}
      {showComplete && <CompleteModal onClose={() => setShowComplete(false)} />}
    </div>
  );
}