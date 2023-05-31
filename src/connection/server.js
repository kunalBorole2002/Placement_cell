const express = require('express');
const mongoose = require('mongoose');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const {useState} = require("react");
const multer = require("multer");
const path = require("path");
app.use(bodyParser.json());
const Grid = require('gridfs-stream');
const crypto = require('crypto');

const GridFsStorage = require('multer-gridfs-storage').GridFsStorage;

app.use(cors());
// Connect to MongoDB

mongoose.connect('mongodb+srv://kunalborole:QAxAa5wFxk7FmwcN@cluster0.1msobqz.mongodb.net/placement_cell?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        console.log('Connected to MongoDB Atlas Cloud');
    })
    .catch(err => {
        console.error(err);
    });
// Define user schema
const userSchema = new mongoose.Schema({
    email: String,
    password: String,
    type:String
});
let userType;
let studentMarks;
let studentid;
let studentname;
let studentemail;
let studentbranch;
let studentstatus;
let studentgender;
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
            studentname = student.name;
            studentid = student._id;
            studentemail = student.email;
            studentbranch = student.branch;
            studentstatus = student.status;
            studentgender = student.gender;
            console.log("Logged in user", studentname, studentid);
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
        const placedCount = await Student.countDocuments({ status: 'Placed' });
        const unplacedCount = await Student.countDocuments({ status: 'Unplaced' });
        res.json({ count, placedCount, unplacedCount });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
//update profile changes
app.post('/api/updatestudent/:stuid', async (req, res) => {


    const { stuid } = req.params;

    const { fullname, marks, branch, status } = req.body;
    console.log("updating student",stuid,marks,branch,status);
    try {
        const student = await Student.findOne({ _id: stuid });
        if (!student) {
            return res.status(404).json({ message: `Student with ID ${stuid} not found` });
        }
        console.log("updating student");
        student.name = fullname;
        student.marks = marks;
        student.branch = branch;
        student.status = status;
        await student.save();

        return res.status(200).json({ message: `Student with ID ${stuid} updated successfully` });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
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
    pbranch: String,
}, { versionKey: false });

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

app.get('/api/usertype', async (req, res) => {
    try {
        res.json({ userType });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
app.get('/api/studentmarks', async (req, res) => {
    const student = await Student.find({ _id: studentid });
    try {
        res.json({ student });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
app.get('/api/loggedin', async (req, res) => {
    try {
        res.json({ studentid,studentname,studentMarks,studentgender, studentstatus, studentbranch, studentemail});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.get('/api/getstudent', async (req, res) => {
    try {
        const student = await Student.find({ _id: studentid });
        res.json(student);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

//insert company
app.post('/api/companies', async (req, res) => {
    try {
        const { name, location, date, cpackage, status, min_marks, pbranch } = req.body;
        const company = new Company({ name, location, date, cpackage, status, min_marks, pbranch });
        console.log('Insert company',min_marks)
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
//updating a company
app.patch('/api/updatecompanies/:id', async (req, res) => {
    const { id } = req.params;
    const { cpackage, location, min_marks, date } = req.body;

    console.log('updatecompanies',id,cpackage,location,min_marks,date);

    try {
        const updatedCompany = await Company.findByIdAndUpdate(id, {
            cpackage,
            location,
            min_marks,
            date
        }, { new: true, fields: { cpackage: 1, location: 1, min_marks: 1, date: 1 } });

        res.status(200).json(updatedCompany);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

//delete a company
app.patch('/api/companies/:id', async (req, res) => {
    try {
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

const appliedSchema = new mongoose.Schema({
    id: String,
    studentid: String,
    studentname: String,
    companyid: String,
    companyname: String,
    status: String,
}, { versionKey: false });

// Define pyears model
const Applied = mongoose.model('Applied', appliedSchema);

// Define a route for fetching all pyears
app.get('/api/getapplied/:studentid/:companyid', async (req, res) => {
    try {
        const { studentid, companyid } = req.params;
        const applied = await Applied.findOne({ studentid, companyid });
        res.json(applied !== null);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
// Define a route for handling student applications
app.post('/api/applied', async (req, res) => {
    const { status, companyid, companyname } = req.body;
    try {
        const applied = new Applied({
            studentid,
            studentname,
            companyid,
            companyname,
            status
        });
        await applied.save();
        res.json(applied);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

const questionSchema = new mongoose.Schema({
    companyid: String,
    questions: [String],
}, { versionKey: false });

// create a question model
const Question = mongoose.model('Question', questionSchema);

//delete question
app.delete('/api/deletequestions/:companyId/:questionId', async (req, res) => {
    const { companyId, questionId } = req.params;
    try {
        const question = await Question.findOne({ companyid: companyId });
        if (!question) {
            return res.status(404).json({ message: 'Question not found' });
        }
        question.questions.splice(questionId, 1);
        await question.save();
        res.json({ message: 'Question deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// create a route to fetch questions with a specific companyid
app.get('/api/questions/:companyid', async (req, res) => {
    const { companyid } = req.params;

    try {
        const questions = await Question.findOne({ companyid });
        res.send(questions);
    } catch (error) {
        res.status(500).send(error);
    }
});

//insert new question
app.post('/api/insertquestions', async (req, res) => {
    const { studentName, companyId, question } = req.body;

    console.log("Inserting ",companyId,question,studentName);

    try {
        let questionDoc = await Question.findOne({ companyid: companyId });
        console.log("checking ",questionDoc);
        if (questionDoc) {
            questionDoc.questions.push(`${question} (${studentName})`);
        } else {
            questionDoc = new Question({ companyId, questions: [`${question} (${studentName})`] });
        }
        await questionDoc.save();
        res.status(200).json(questionDoc);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Something went wrong' });
    }
});

//resume
const { v4: uuidv4 } = require('uuid');

// create a schema for the resume model
const resumeSchema = new mongoose.Schema({
    studentId: { type: String, required: true },
    filename: { type: String, required: true },
    filePath: { type: String, required: true },
}, { versionKey: false });

// create a model for the resume schema
const Resume = mongoose.model('Resume', resumeSchema);

// configure the multer storage engine
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const fileName = `${uuidv4()}${path.extname(file.originalname)}`;
        cb(null, fileName);
    }
});

// create a multer instance
const upload = multer({ storage });

// handle file uploads
app.post('/api/resume', upload.single('resume'), async (req, res) => {
    try {
        const { studentId } = req.body;
        const resume = new Resume({
            studentId,
            filename: req.file.filename,
            filePath: req.file.path,
        });
        await resume.save();
        res.status(201).json({ message: 'Resume uploaded successfully', resume: resume.filename });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'An error occurred while uploading the resume' });
    }
});
//check
app.get("/api/checkresume/:studentId", async (req, res) => {
    const { studentId } = req.params;

    console.log("Checking resume",studentId);

    try {
        const resume = await Resume.findOne({ studentId });
        if (resume) {
            res.json({ exists: true });
        } else {
            res.json({ exists: false });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
});
app.put('/api/resume/:studentId', upload.single('resume'), async (req, res) => {
    try {
        const { studentId } = req.params;
        const resume = await Resume.findOne({ studentId });
        if (!resume) {
            res.status(404).json({ message: 'Resume not found' });
            return;
        }
        resume.filename = req.file.filename;
        resume.filePath = req.file.path;
        await resume.save();
        res.status(200).json({ message: 'Resume updated successfully', resume: resume.filename });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'An error occurred while updating the resume' });
    }
});


// handle file downloads
app.get('/api/resume/:studentId', async (req, res) => {
    try {
        const { studentId } = req.params;
        const resume = await Resume.findOne({ studentId });
        if (!resume) {
            res.status(404).json({ message: 'Resume not found' });
            return;
        }
        res.set('Content-Type', 'application/pdf');
        const absolutePath = path.resolve(resume.filePath);
        res.sendFile(absolutePath);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'An error occurred while fetching the resume' });
    }
});

app.listen(3001, () => {
    console.log('Server running on port 3001');
});