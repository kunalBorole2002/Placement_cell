const express = require('express');
const mongoose = require('mongoose');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
app.use(bodyParser.json());

app.use(cors());
// Connect to MongoDB
mongoose.connect('mongodb+srv://kunalborole:QAxAa5wFxk7FmwcN@cluster0.1msobqz.mongodb.net/placement_cell?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Define user schema
const userSchema = new mongoose.Schema({
    email: String,
    password: String,
});

// Define user model
const User = mongoose.model('User', userSchema);

// Define a route for authenticating users
app.post('/api/signin', async (req, res) => {
    const { email, password } = req.body;
    try {
        if(password.length < 8) {
            res.status(401).json({ message: 'password too short' });
        }
        const user = await User.findOne({ email, password });
        if (!user) {
            res.status(401).json({ message: 'Invalid email or password' });
        } else {
            res.json(user);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

//student data
const studentSchema = new mongoose.Schema({
    id: String,
    name: String,
    email: String,
    branch: String,
    status: String,
    gender: String
});

// Define student model
const Student = mongoose.model('Student', studentSchema);

// Define a route for fetching all students
app.get('/api/students', async (req, res) => {
    try {
        const students = await Student.find();
        res.json(students);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

//company data
const companySchema = new mongoose.Schema({
    id: String,
    name: String,
    location: String,
    date: String,
    package: String,
});

const Company = mongoose.model('Company', companySchema);

// Define a route for fetching companies
app.get('/api/companies', async (req, res) => {
    try {
        const companies = await Company.find();
        res.json(companies);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.listen(3001, () => {
    console.log('Server running on port 3001');
});