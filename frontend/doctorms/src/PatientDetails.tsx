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

  // ✅ CALL BACKEND (NOT MODEL DIRECTLY)
  const generateSummary = async () => {
    try {
      setLoadingAI(true);
      setAiSummary(null);

      const response = await fetch(
        `http://localhost:8000/patient-summary/${patient.id}`,
        {
          method: "POST",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to generate summary");
      }

      const data = await response.json();

      setAiSummary(data.summary);
    } catch (err) {
      console.error(err);
      setAiSummary("Failed to generate AI summary.");
    } finally {
      setLoadingAI(false);
    }
  };

  return (
    <div className="card" style={{ marginTop: "30px" }}>
      <h2>Patient Profile</h2>

      {/* TABS */}
      <div className="tabs">
        <TabButton
          label="Overview"
          active={activeTab === "OVERVIEW"}
          onClick={() => setActiveTab("OVERVIEW")}
        />
        <TabButton
          label="Prescriptions"
          active={activeTab === "PRESCRIPTIONS"}
          onClick={() => setActiveTab("PRESCRIPTIONS")}
        />
        <TabButton
          label="Reports"
          active={activeTab === "REPORTS"}
          onClick={() => setActiveTab("REPORTS")}
        />
        <TabButton
          label="AI Summary"
          active={activeTab === "AI"}
          onClick={() => setActiveTab("AI")}
        />
      </div>

      {/* OVERVIEW */}
      {activeTab === "OVERVIEW" && (
        <div className="tab-content">
          <p><b>Name:</b> {patient.name}</p>
          <p><b>Age:</b> {patient.age}</p>
          <p><b>Gender:</b> {patient.gender}</p>

          {user.role !== "ADMIN" && (
            <p className="muted-text">
              Only admin can edit patient details
            </p>
          )}
        </div>
      )}

      {/* PRESCRIPTIONS */}
      {activeTab === "PRESCRIPTIONS" && (
        <PrescriptionsTab patientId={patient.id} user={user} />
      )}

      {/* REPORTS */}
      {activeTab === "REPORTS" && (
        <ReportsTab patientId={patient.id} user={user} />
      )}

      {/* AI SUMMARY */}
      {activeTab === "AI" && (
        <div className="tab-content">
          <button
            className="primary-btn"
            onClick={generateSummary}
            disabled={loadingAI}
          >
            {loadingAI
              ? "Generating Summary..."
              : "Generate AI Summary"}
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
  onClick,
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