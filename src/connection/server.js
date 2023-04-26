const express = require('express');
const mongoose = require('mongoose');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const {useState} = require("react");
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
    type:String
});
let userType;
let studentMarks;
// Define user model
const User = mongoose.model('User', userSchema);

//student data
const studentSchema = new mongoose.Schema({
    id: String,
    name: String,
    email: String,
    branch: String,
    status: String,
    gender: String,
    marks: String,
    password: String,
    type: String
}, { versionKey: false });

// Define student model
const Student = mongoose.model('Student', studentSchema);

// Define a route for authenticating users
app.post('/api/signin', async (req, res) => {
    const { email, password } = req.body;
    // Declare the userType variable outside the try-catch block

    try {
        // Look for a matching user record
        const user = await User.findOne({ email, password });
        if (user) {
            userType = "admin"; // Assign the value here
            return res.json(user);
        }

        // If not found, look for a matching student record
        const student = await Student.findOne({ email, password });
        if (student) {
            studentMarks=student.marks;
            userType = "student"; // Assign the value here
            return res.json(student);
        }

        // If no matching records found, return error
        res.status(401).json({ message: 'Invalid email or password' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

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

app.get('/api/students/count', async (req, res) => {
    try {
        const count = await Student.distinct('id').countDocuments();
        const placedCount = await Student.countDocuments({ status: 'placed' });
        const unplacedCount = await Student.countDocuments({ status: 'unplaced' });
        res.json({ count, placedCount, unplacedCount });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
//
app.post('/api/signup',async(req,res)=>{
    const {name,email,gender,branch,status,marks,password} = req.body
    //new user
    const data = {
        name:name,
        email: email,
        gender:gender,
        branch:branch,
        status:status,
        marks:marks,
        password:password
    }

    try {
        const user = await Student.findOne({ email});
        if (user) {
            res.status(409).json({ message: 'Email already exists' });
        } else {
            await Student.insertMany([data]); // pass data inside an array
            res.status(200).json({ message: 'User registered successfully' });
        }
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
    cpackage: String,
    status: String,
    min_marks: String,
}, { versionKey: false });

const Company = mongoose.model('Company', companySchema);

// Define a route for fetching companies
app.get('/api/companies', async (req, res) => {
    try {
        const companies = await Company.find();
        console.log(companies);
        res.json(companies);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.get('/api/usertype', async (req, res) => {
    try {
        res.json({ userType });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
app.get('/api/studentmarks', async (req, res) => {
    try {
        console.log("Student marks ",studentMarks)
        res.json({ studentMarks });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

//insert company
app.post('/api/companies', async (req, res) => {
    try {
        const { name, location, date, cpackage, status, min_marks } = req.body;
        const company = new Company({ name, location, date, cpackage, status, min_marks });
        await company.save();
        // Send the updated data back to the front-end
        const companies = await Company.find();
        res.json({ success: true, companies });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


app.get('/api/activecompanies', async (req, res) => {
    try {
        const companies = await Company.find({ status: 'active' });
        res.json(companies);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

//delete a company
app.patch('/api/companies/:id', async (req, res) => {
    try {
        console.log(req.params.id);
        const company = await Company.findByIdAndUpdate(
            req.params.id,
            { status: 'inactive' },
            { new: true }
        );
        if (!company) {
            return res.status(404).json({ error: 'Company not found' });
        }
        res.json(company);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
app.patch('/api/incompanies/:id', async (req, res) => {
    try {
        console.log(req.params.id);
        const company = await Company.findByIdAndUpdate(
            req.params.id,
            { status: 'active' },
            { new: true }
        );
        if (!company) {
            return res.status(404).json({ error: 'Company not found' });
        }
        res.json(company);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/companies/count', async (req, res) => {
    try {
        const c_count = await Company.distinct('id').countDocuments();
        console.log(c_count);
        res.json({ c_count });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

//fetching year lables from database
const pyearsSchema = new mongoose.Schema({
    id: String,
    year: String,
    placed: String
});

// Define pyears model
const Pyears = mongoose.model('Pyears', pyearsSchema);

// Define a route for fetching all pyears
app.get('/api/pyears', async (req, res) => {
    try {
        const pyears = await Pyears.find();
        const years = pyears.map(pyear => pyear.year); // get all the years
        const placed = pyears.map(pyear => pyear.placed); // get all the placed
        res.json({ labels: years, data: placed });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.listen(3001, () => {
    console.log('Server running on port 3001');
});