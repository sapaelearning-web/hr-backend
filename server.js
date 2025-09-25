const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const User = require('./models/User');
const Attendance = require('./models/Attendance');
const Leave = require('./models/Leave');
const Task = require('./models/Task');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors({
  origin: "*",
  methods: ['GET','POST','DELETE','OPTIONS'],
  credentials: true
}));

// MongoDB Connection
mongoose.connect('mongodb+srv://sapaelearning_db_user:GnwX3iI5U2dCVKDT@cluster0.pckipja.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected...'))
.catch(err => console.error(err));

// Routes
app.get('/', (req, res) => {
  res.send('HR Management Backend API!');
});

// User Routes
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password, leaveQuota, role } = req.body;
    const newUser = new User({ id: uuidv4(), name, email, password, leaveQuota, role });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password }); // In real app, hash and compare passwords
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    res.json(user); // Return user data, in real app, return JWT token
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/api/users/:id', async (req, res) => {
  try {
    const user = await User.findOne({ id: req.params.id });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.put('/api/users/:id', async (req, res) => {
  try {
    const { name, email, password, leaveQuota, role } = req.body;
    const updatedUser = await User.findOneAndUpdate(
      { id: req.params.id },
      { name, email, password, leaveQuota, role },
      { new: true }
    );
    if (!updatedUser) return res.status(404).json({ message: 'User not found' });
    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.delete('/api/users/:id', async (req, res) => {
  try {
    const deletedUser = await User.findOneAndDelete({ id: req.params.id });
    if (!deletedUser) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Attendance Routes
app.get('/api/attendance', async (req, res) => {
  try {
    const attendance = await Attendance.find();
    res.json(attendance);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/attendance', async (req, res) => {
  try {
    const { userId, date, checkIn, checkOut } = req.body;
    const newAttendance = new Attendance({ id: uuidv4(), userId, date, checkIn, checkOut });
    await newAttendance.save();
    res.status(201).json(newAttendance);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.put('/api/attendance/:id', async (req, res) => {
  try {
    const { checkOut } = req.body;
    const updatedAttendance = await Attendance.findOneAndUpdate(
      { id: req.params.id },
      { checkOut },
      { new: true }
    );
    if (!updatedAttendance) return res.status(404).json({ message: 'Attendance record not found' });
    res.json(updatedAttendance);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Leave Routes
app.get('/api/leaves', async (req, res) => {
  try {
    const leaves = await Leave.find();
    res.json(leaves);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/leaves', async (req, res) => {
  try {
    const { userId, fromDate, toDate, reason, status } = req.body;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const leaveFromDate = new Date(fromDate);
    leaveFromDate.setHours(0, 0, 0, 0);

    if (leaveFromDate.getTime() < today.getTime()) {
      return res.status(400).json({ message: 'Cannot apply for leave on past dates.' });
    }

    const newLeave = new Leave({ id: uuidv4(), userId, fromDate, toDate, reason, status });
    await newLeave.save();
    res.status(201).json(newLeave);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.put('/api/leaves/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const updatedLeave = await Leave.findOneAndUpdate(
      { id: req.params.id },
      { status },
      { new: true }
    );
    if (!updatedLeave) return res.status(404).json({ message: 'Leave request not found' });
    res.json(updatedLeave);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Task Routes
app.get('/api/tasks', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/tasks', async (req, res) => {
  try {
    const { title, description, assignedTo, status } = req.body;
    const newTask = new Task({ id: uuidv4(), title, description, assignedTo, status });
    await newTask.save();
    res.status(201).json(newTask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.put('/api/tasks/:id', async (req, res) => {
  try {
    const { title, description, assignedTo, status } = req.body;
    const updatedTask = await Task.findOneAndUpdate(
      { id: req.params.id },
      { title, description, assignedTo, status },
      { new: true }
    );
    if (!updatedTask) return res.status(404).json({ message: 'Task not found' });
    res.json(updatedTask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.delete('/api/tasks/:id', async (req, res) => {
  try {
    const deletedTask = await Task.findOneAndDelete({ id: req.params.id });
    if (!deletedTask) return res.status(404).json({ message: 'Task not found' });
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
