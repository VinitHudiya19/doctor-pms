import { useEffect, useState } from "react";
import Card from "./components/Card";
import Modal from "./components/Modal";

interface Report {
  id: number;
  patient_id: number;
  doctor_name: string;
  title: string;
  file_path: string;
  created_at: string;
}

interface Props {
  patientId: number;
  user: {
    role: "ADMIN" | "DOCTOR";
    username: string;
  };
}

export default function ReportsTab({ patientId, user }: Props) {
  const [reports, setReports] = useState<Report[]>([]);
  const [showForm, setShowForm] = useState(false);

  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const loadReports = () => {
    fetch(`http://localhost:8000/patients/${patientId}/reports`)
      .then(res => res.json())
      .then(data => setReports(data));
  };

  useEffect(() => {
    loadReports();
  }, [patientId]);

  const uploadReport = () => {
    if (!file || !title) return;

    const formData = new FormData();
    formData.append("patient_id", String(patientId));
    formData.append("doctor_name", user.username);
    formData.append("title", title);
    formData.append("file", file);

    fetch("http://localhost:8000/reports", {
      method: "POST",
      body: formData
    }).then(() => {
      setShowForm(false);
      setTitle("");
      setFile(null);
      loadReports();
    });
  };

  return (
    <div>
      {/* HEADER */}
      <Card>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >
          <h3 style={{ margin: 0 }}>📄 Medical Reports</h3>

          {user.role === "DOCTOR" && (
            <button onClick={() => setShowForm(true)}>
              + Upload Report
            </button>
          )}
        </div>
      </Card>

      {/* EMPTY STATE */}
      {reports.length === 0 && (
        <Card>
          <p style={{ color: "var(--muted)", margin: 0 }}>
            No reports uploaded yet.
          </p>
        </Card>
      )}

      {/* REPORT LIST */}
      {reports.map(r => (
        <Card key={r.id}>
          <b>{r.title}</b><br />
          Doctor: {r.doctor_name}<br />
          Date: {new Date(r.created_at).toLocaleDateString()}<br /><br />

          <a
            href={`http://localhost:8000/files/${r.file_path.split("/").pop()}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            View / Download Report
          </a>
        </Card>
      ))}

      {/* UPLOAD MODAL */}
      {showForm && (
        <Modal
          title="Upload Medical Report"
          onClose={() => setShowForm(false)}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px"
            }}
          >
            {/* AUTO-FILLED DOCTOR */}
            <input
              value={user.username}
              disabled
              style={{ background: "#e5e7eb" }}
            />

            <input
              placeholder="Report Title"
              value={title}
              onChange={e => setTitle(e.target.value)}
            />

            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={e => setFile(e.target.files?.[0] || null)}
            />

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "8px"
              }}
            >
              <button onClick={() => setShowForm(false)}>Cancel</button>
              <button onClick={uploadReport}>Upload</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
