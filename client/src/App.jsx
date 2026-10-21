import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Briefcase, Trash2 } from 'lucide-react';
import './App.css';

const API_BASE = 'http://localhost:5001/api/applications';

export default function App() {
  const [applications, setApplications] = useState([]);
  const [form, setForm] = useState({
    company: '',
    role: '',
    status: 'Applied',
    ctc: '',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });

  const fetchApplications = async () => {
    try {
      const response = await axios.get(API_BASE);
      setApplications(response.data);
    } catch (err) {
      console.error('Error fetching applications:', err);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.company || !form.role) return;

    try {
      await axios.post(API_BASE, form);
      setForm({
        company: '',
        role: '',
        status: 'Applied',
        ctc: '',
        date: new Date().toISOString().split('T')[0],
        notes: ''
      });
      fetchApplications();
    } catch (err) {
      console.error('Error adding application:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE}/${id}`);
      fetchApplications();
    } catch (err) {
      console.error('Error deleting application:', err);
    }
  };

  const total = applications.length;
  const interviewing = applications.filter((a) => a.status === 'Interview').length;
  const offers = applications.filter((a) => a.status === 'Offered').length;

  return (
    <div className="container">
      <header>
        <h1><Briefcase /> Placement Tracker</h1>
        <p>Manage your job & internship applications and track your interview pipeline</p>
      </header>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-title">Total Applications</div>
          <div className="stat-value">{total}</div>
        </div>
        <div className="stat-card">
          <div className="stat-title">In Interviews</div>
          <div className="stat-value">{interviewing}</div>
        </div>
        <div className="stat-card">
          <div className="stat-title">Offers Received</div>
          <div className="stat-value" style={{ color: '#34d399' }}>{offers}</div>
        </div>
      </div>

      <div className="form-card">
        <h3>Add New Application</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <input
              type="text"
              name="company"
              placeholder="Company Name (e.g. Google)"
              value={form.company}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="role"
              placeholder="Role (e.g. SDE Intern)"
              value={form.role}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="ctc"
              placeholder="Package / Stipend"
              value={form.ctc}
              onChange={handleChange}
            />
            <select name="status" value={form.status} onChange={handleChange}>
              <option value="Applied">Applied</option>
              <option value="OA">OA Scheduled</option>
              <option value="Interview">Interview Round</option>
              <option value="Offered">Offer Received</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
          <button type="submit" className="btn-primary">
            Save Application
          </button>
        </form>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Company</th>
              <th>Role</th>
              <th>Package</th>
              <th>Status</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <tr key={app.id}>
                <td style={{ fontWeight: 600 }}>{app.company}</td>
                <td>{app.role}</td>
                <td>{app.ctc || '-'}</td>
                <td>
                  <span className={`badge badge-${app.status}`}>
                    {app.status}
                  </span>
                </td>
                <td style={{ color: '#94a3b8' }}>{app.date}</td>
                <td>
                  <button
                    onClick={() => handleDelete(app.id)}
                    className="btn-delete"
                    title="Delete entry"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {applications.length === 0 && (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', color: '#64748b' }}>
                  No applications added yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}