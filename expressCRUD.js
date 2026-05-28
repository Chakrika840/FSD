const express = require("express");
const fs = require("fs");
const app = express();
const PORT = 2003;

let stu = [];
try {
    stu = require('./students.json');
} catch (err) {
    stu = [];
}

// Helper function to save data to students.json
function saveData(data) {
    fs.writeFile('students.json', JSON.stringify(data, null, 2), (err) => {
        if (err) throw err;
    });
}

// Home route
app.get("/", (req, res) => {
    res.send("<h1>Welcome to Student Management System</h1>");
});

// List all students
app.get("/list", (req, res) => {
    fs.readFile("students.json", (err, data) => {
        if (err) {
            console.error("Error reading the file", err);
            res.status(500).send("Error reading data");
            return;
        }
        res.type("json").send(data);
    });
});

// POST a new student using query parameters
// Example: POST /student?rollno=1&name=Harry
app.post("/student", (req, res) => {
    const newStu = {
        rollno: parseInt(req.query.rollno),
        name: req.query.name
    };

    if (!newStu.rollno || !newStu.name) {
        res.status(400).send("Missing required fields");
        return;
    }

    stu.push(newStu);
    saveData(stu);
    res.send("<h1>Student added successfully</h1>");
});

// PUT (update) a student using query parameters
// Example: PUT /student?rollno=1&name=HarryUpdated
app.put("/student", (req, res) => {
    const upStu = {
        rollno: parseInt(req.query.rollno),
        name: req.query.name
    };

    if (!upStu.rollno || !upStu.name) {
        res.status(400).send("Missing required fields");
        return;
    }

    const student = stu.find(s => s.rollno === upStu.rollno);
    if (student) {
        student.name = upStu.name;
        saveData(stu);
        res.send("<h1>Student data updated successfully</h1>");
    } else {
        res.status(404).send("Student not found");
    }
});

// DELETE a student using query parameters
// Example: DELETE /student?rollno=1
app.delete("/student", (req, res) => {
    const rollno = parseInt(req.query.rollno);

    if (!rollno) {
        res.status(400).send("Missing rollno field");
        return;
    }

    const index = stu.findIndex(s => s.rollno === rollno);
    if (index !== -1) {
        stu.splice(index, 1);
        saveData(stu);
        res.send("<h1>Student deleted successfully</h1>");
    } else {
        res.status(404).send("Student not found");
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
