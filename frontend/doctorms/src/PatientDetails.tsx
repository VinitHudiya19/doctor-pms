import { useState } from "react";
import PrescriptionsTab from "./PrescriptionsTab";
import ReportsTab from "./ReportsTab";

interface Patient {
  id: number;
  name: string;
  age: number;
  gender: string;
}

interface User {
  role: "ADMIN" | "DOCTOR";
  username: string;
}

interface Props {
  patient: Patient;
  user: User;
}

type Tab = "OVERVIEW" | "PRESCRIPTIONS" | "REPORTS" | "AI";

export default function PatientDetails({ patient, user }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("OVERVIEW");

  // AI Summary state
  const [loadingAI, setLoadingAI] = useState(false);
  const [aiSummary, setAiSummary] = useState<string | null>(null);

  const generateSummary = () => {
    setLoadingAI(true);
    setAiSummary(null);

    // 🔮 TEMP: simulate AI call (replace later with real API)
    setTimeout(() => {
      setAiSummary(
        `Patient ${patient.name}, ${patient.age} years old (${patient.gender}).

Recent medical activity includes prescriptions and reports recorded in the system.
No critical alerts detected.

Recommended: Continue current treatment and schedule follow-up if symptoms persist.`
      );
      setLoadingAI(false);
    }, 1500);
  };

  return (
    <div className="card" style={{ marginTop: "30px" }}>
      <h2>Patient Profile</h2>

      {/* TABS */}
      <div className="tabs">
        <TabButton label="Overview" active={activeTab === "OVERVIEW"} onClick={() => setActiveTab("OVERVIEW")} />
        <TabButton label="Prescriptions" active={activeTab === "PRESCRIPTIONS"} onClick={() => setActiveTab("PRESCRIPTIONS")} />
        <TabButton label="Reports" active={activeTab === "REPORTS"} onClick={() => setActiveTab("REPORTS")} />
        <TabButton label="AI Summary" active={activeTab === "AI"} onClick={() => setActiveTab("AI")} />
      </div>

      {/* TAB CONTENT */}
      {activeTab === "OVERVIEW" && (
        <div className="tab-content">
          <p><b>Name:</b> {patient.name}</p>
          <p><b>Age:</b> {patient.age}</p>
          <p><b>Gender:</b> {patient.gender}</p>

          {user.role !== "ADMIN" && (
            <p className="muted-text">Only admin can edit patient details</p>
          )}
        </div>
      )}

      {activeTab === "PRESCRIPTIONS" && (
        <PrescriptionsTab patientId={patient.id} user={user} />
      )}

      {activeTab === "REPORTS" && (
        <ReportsTab patientId={patient.id} user={user} />
      )}

      {/* 🧠 AI SUMMARY TAB */}
      {activeTab === "AI" && (
        <div className="tab-content">
          <button
            className="primary-btn"
            onClick={generateSummary}
            disabled={loadingAI}
          >
            {loadingAI ? "Generating Summary..." : "Generate AI Summary"}
          </button>

          {loadingAI && (
            <p className="muted-text" style={{ marginTop: "12px" }}>
              Analyzing patient data…
            </p>
          )}

          {aiSummary && (
            <div className="ai-card">
              <h4>AI Clinical Summary</h4>
              <pre>{aiSummary}</pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* TAB BUTTON */
function TabButton({
  label,
  active,
  onClick
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      className={`tab-btn ${active ? "tab-active" : ""}`}
      onClick={onClick}
      type="button"
    >
      {label}
    </button>
  );
}
