
import { useEffect, useState } from "react";
import PatientDetails from "./PatientDetails";
import Login from "./Login";
import "./App.css";

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

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  // 🔍 Search & Filters (Doctor)
  const [search, setSearch] = useState("");
  const [genderFilter, setGenderFilter] = useState("ALL");
  const [minAge, setMinAge] = useState("");
  const [maxAge, setMaxAge] = useState("");

  const filteredPatients = patients.filter(p => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      String(p.id).includes(search);

    const matchesGender =
      genderFilter === "ALL" || p.gender === genderFilter;

    const matchesMinAge =
      minAge === "" || p.age >= Number(minAge);

    const matchesMaxAge =
      maxAge === "" || p.age <= Number(maxAge);

    return (
      matchesSearch &&
      matchesGender &&
      matchesMinAge &&
      matchesMaxAge
    );
  });

  // Admin-only form state
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("Male");

  const loadPatients = () => {
    fetch("http://localhost:8000/patients")
      .then(res => res.json())
      .then(data => {
        setPatients(data);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (user) loadPatients();
  }, [user]);

  const logout = () => {
    setUser(null);
    setSelectedPatient(null);
  };

  const addPatient = () => {
    if (!name || !age) return;

    fetch("http://localhost:8000/patients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        age: Number(age),
        gender
      })
    }).then(() => {
      setName("");
      setAge("");
      setGender("Male");
      loadPatients();
    });
  };

  if (!user) {
    return <Login onLogin={setUser} />;
  }

  return (
  <div className="app-container">
    {/* HEADER */}
    <div className="app-header">
      <h1>Doctor PMS</h1>

      <div className="user-box">
        <span className="username">{user.username}</span>
        <span className="role">{user.role}</span>
        <button className="logout-btn" onClick={logout}>
          Logout
        </button>
      </div>
    </div>

    {/* ADMIN ONLY: ADD PATIENT */}
    {user.role === "ADMIN" && (
      <div className="card">
        <h3>Add Patient</h3>

        <div className="form-grid">
          <input
            placeholder="Full Name"
            value={name}
            onChange={e => setName(e.target.value)}
          />

          <input
            type="number"
            placeholder="Age"
            value={age}
            onChange={e => setAge(e.target.value)}
          />

          <select
            value={gender}
            onChange={e => setGender(e.target.value)}
          >
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>

          <button className="primary-btn" onClick={addPatient}>
            Add Patient
          </button>
        </div>
      </div>
    )}

    {user.role === "DOCTOR" && (
      <p className="muted-text">
        Only admin can add new patients
      </p>
    )}

    {/* DOCTOR SEARCH & FILTERS */}
    {user.role === "DOCTOR" && (
      <div className="filter-bar">
        <input
          placeholder="Search by name or ID"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />

        <select
          value={genderFilter}
          onChange={e => setGenderFilter(e.target.value)}
        >
          <option value="ALL">All Genders</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>

        <input
          type="number"
          placeholder="Min Age"
          value={minAge}
          onChange={e => setMinAge(e.target.value)}
        />

        <input
          type="number"
          placeholder="Max Age"
          value={maxAge}
          onChange={e => setMaxAge(e.target.value)}
        />
      </div>
    )}

    {/* PATIENT LIST */}
    <div className="table-card">
      {loading && <p>Loading patients...</p>}

      {!loading && filteredPatients.length === 0 && (
        <p className="muted-text">No patients found.</p>
      )}

      {!loading && filteredPatients.length > 0 && (
        <table className="patient-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Age</th>
              <th>Gender</th>
            </tr>
          </thead>

          <tbody>
            {filteredPatients.map(p => (
              <tr
                key={p.id}
                className={
                  selectedPatient?.id === p.id ? "row-active" : ""
                }
                onClick={() => setSelectedPatient(p)}
              >
                <td>{p.id}</td>
                <td className="bold">{p.name}</td>
                <td>{p.age}</td>
                <td>{p.gender}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
    

    {/* PATIENT DETAILS */}
    {selectedPatient && (
      <PatientDetails patient={selectedPatient} user={user} />
    )}
  </div>
);

}

export default App;