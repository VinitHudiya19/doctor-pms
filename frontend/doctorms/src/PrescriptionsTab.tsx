import { useEffect, useState } from "react";
import Card from "./components/Card";
import Modal from "./components/Modal";

interface Medicine {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
}

interface Prescription {
  id: number;
  doctor_name: string;
  diagnosis: string;
  medicines: Medicine[];
  notes?: string;
  created_at: string;
}

interface Props {
  patientId: number;
  user: {
    role: "ADMIN" | "DOCTOR";
    username: string;
  };
}

export default function PrescriptionsTab({ patientId, user }: Props) {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [showForm, setShowForm] = useState(false);

  const [diagnosis, setDiagnosis] = useState("");
  const [notes, setNotes] = useState("");
  const [medicines, setMedicines] = useState<Medicine[]>([
    { name: "", dosage: "", frequency: "", duration: "" }
  ]);

  const loadPrescriptions = () => {
    fetch(`http://localhost:8000/patients/${patientId}/prescriptions`)
      .then(res => res.json())
      .then(data => setPrescriptions(data));
  };

  useEffect(() => {
    loadPrescriptions();
  }, [patientId]);

  const addMedicineRow = () => {
    setMedicines([
      ...medicines,
      { name: "", dosage: "", frequency: "", duration: "" }
    ]);
  };

  const updateMedicine = (
    index: number,
    field: keyof Medicine,
    value: string
  ) => {
    const updated = [...medicines];
    updated[index][field] = value;
    setMedicines(updated);
  };

  const savePrescription = () => {
    fetch("http://localhost:8000/prescriptions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        patient_id: patientId,
        doctor_name: user.username,
        diagnosis,
        medicines,
        notes
      })
    }).then(() => {
      setShowForm(false);
      setDiagnosis("");
      setNotes("");
      setMedicines([{ name: "", dosage: "", frequency: "", duration: "" }]);
      loadPrescriptions();
    });
  };

  return (
    <div>
      {/* HEADER */}
      <Card>
        <div className="card-header">
          <h3>💊 Prescriptions</h3>

          {user.role === "DOCTOR" && (
            <button className="primary-btn" onClick={() => setShowForm(true)}>
              + Add Prescription
            </button>
          )}
        </div>
      </Card>

      {/* EMPTY STATE */}
      {prescriptions.length === 0 && (
        <Card>
          <p className="muted-text">No prescriptions added yet.</p>
        </Card>
      )}

      {/* LIST */}
      {prescriptions.map(p => (
        <Card key={p.id}>
          <div className="prescription-meta">
            <span>
              <b>Date:</b>{" "}
              {new Date(p.created_at).toLocaleDateString()}
            </span>
          </div>

          <div><b>Doctor:</b> {p.doctor_name}</div>
          <div><b>Diagnosis:</b> {p.diagnosis}</div>

          <div className="medicine-list">
            <b>Medicines:</b>
            <ul>
              {p.medicines.map((m, i) => (
                <li key={i}>
                  {m.name} – {m.dosage}, {m.frequency}, {m.duration}
                </li>
              ))}
            </ul>
          </div>

          {p.notes && (
            <div className="notes">
              <b>Notes:</b> {p.notes}
            </div>
          )}
        </Card>
      ))}

      {/* MODAL FORM */}
      {showForm && (
        <Modal title="Add Prescription" onClose={() => setShowForm(false)}>
          <div className="form-vertical">

            {/* DOCTOR (AUTO-FILLED) */}
            <input
              value={user.username}
              disabled
              className="input-disabled"
            />

            <input
              placeholder="Diagnosis"
              value={diagnosis}
              onChange={e => setDiagnosis(e.target.value)}
            />

            <h4>Medicines</h4>

            {medicines.map((m, i) => (
              <div key={i} className="medicine-grid">
                <input
                  placeholder="Medicine Name"
                  value={m.name}
                  onChange={e =>
                    updateMedicine(i, "name", e.target.value)
                  }
                />
                <input
                  placeholder="Dosage"
                  value={m.dosage}
                  onChange={e =>
                    updateMedicine(i, "dosage", e.target.value)
                  }
                />
                <input
                  placeholder="Frequency"
                  value={m.frequency}
                  onChange={e =>
                    updateMedicine(i, "frequency", e.target.value)
                  }
                />
                <input
                  placeholder="Duration"
                  value={m.duration}
                  onChange={e =>
                    updateMedicine(i, "duration", e.target.value)
                  }
                />
              </div>
            ))}

            <button className="btn-outline" onClick={addMedicineRow}>
              + Add Medicine
            </button>

            <textarea
              placeholder="Additional Notes"
              value={notes}
              onChange={e => setNotes(e.target.value)}
            />

            <div className="form-actions">
              <button
                className="btn-outline"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>
              <button className="primary-btn" onClick={savePrescription}>
                Save Prescription
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
