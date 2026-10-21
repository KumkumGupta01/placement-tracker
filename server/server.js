const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 5001;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory data store for placement applications
let applications = [
  {
    id: uuidv4(),
    company: "Google",
    role: "Software Engineering Intern",
    status: "Applied",
    ctc: "1.2 Lakh/month",
    date: "2026-10-21",
    notes: "Applied via referral link on careers portal."
  }
];

// GET: Fetch all applications
app.get('/api/applications', (req, res) => {
  res.json(applications);
});

// POST: Add a new application
app.post('/api/applications', (req, res) => {
  const { company, role, status, ctc, date, notes } = req.body;

  if (!company || !role) {
    return res.status(400).json({ error: "Company name and role are required." });
  }

  const newApp = {
    id: uuidv4(),
    company,
    role,
    status: status || "Applied",
    ctc: ctc || "Not specified",
    date: date || new Date().toISOString().split('T')[0],
    notes: notes || ""
  };

  applications.push(newApp);
  res.status(201).json(newApp);
});

// PUT: Update an existing application
app.put('/api/applications/:id', (req, res) => {
  const { id } = req.params;
  const appIndex = applications.findIndex(item => item.id === id);

  if (appIndex === -1) {
    return res.status(404).json({ error: "Application not found." });
  }

  applications[appIndex] = { ...applications[appIndex], ...req.body };
  res.json(applications[appIndex]);
});

// DELETE: Remove an application
app.delete('/api/applications/:id', (req, res) => {
  const { id } = req.params;
  applications = applications.filter(item => item.id !== id);
  res.json({ message: "Application deleted successfully." });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});

// Keep process running
setInterval(() => {}, 1 << 30);