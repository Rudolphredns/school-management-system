//part 1 Classes and Object-Oriented Programming
class Student {
    name: string; 
    age: number; 
    grades: number[]; 
    static totalStudentsCount: number = 0;

    constructor(name: string, age: number) {
        this.name = name;
        this.age = age;
        this.grades = [];
        Student.totalStudentsCount++;
    }

    addGrade(grade: number): void {
        this.grades.push(grade);
    }

    getAverageGrade(): number {
        const total = this.grades.reduce((acc, curr) => acc + curr, 0);
        return this.grades.length ? total / this.grades.length : 0;
    }

    getLatestGrade(): number | null {
        return this.grades.length > 0 ? this.grades[this.grades.length - 1] : null;
    }

    static totalStudents(): number {
        return Student.totalStudentsCount;
    }
}

// Part 2: Inheritance and Polymorphism

class Teacher {
    name: string;
    age: number;
    subject: string;
    static totalTeachersCount: number = 0;

    constructor(name: string, age: number, subject: string) {
        this.name = name;
        this.age = age;
        this.subject = subject;
        Teacher.totalTeachersCount++;
    }

    assignGrade(student: Student, grade: number): void {
        student.addGrade(grade);
        $("#assignmentList").append(`<li>${this.name} assigned grade ${grade} to ${student.name}</li>`);
    }

    static totalTeachers(): number {
        return Teacher.totalTeachersCount;
    }
}

// อาร์เรย์สำหรับเก็บข้อมูลนักเรียนและครู
const students: Student[] = [];
const teachers: Teacher[] = [];

// Part 3: Dynamic Interactivity using jQuery

$(document).ready(() => {

    // ฟังก์ชันเพิ่มครู
    $("#teacherForm").on("submit", function (event) {
        event.preventDefault();

        const teacherName = $("#teacherName").val() as string;
        const teacherAge = parseInt($("#teacherAge").val() as string, 10);
        const teacherSubject = $("#teacherSubject").val() as string;

        if (teacherName && !isNaN(teacherAge) && teacherSubject) {
            const newTeacher = new Teacher(teacherName, teacherAge, teacherSubject);
            teachers.push(newTeacher);

            // อัพเดตรายการครูและจำนวนครูในหน้าเว็บ
            updateTeacherList();
            alert("Teacher added successfully!");
        }
    });

    // ฟังก์ชันเพิ่มนักเรียน
    $("#studentForm").on("submit", function (event) {
        event.preventDefault();

        const studentName = $("#studentName").val() as string;
        const studentAge = parseInt($("#studentAge").val() as string, 10);

        if (studentName && !isNaN(studentAge)) {
            const newStudent = new Student(studentName, studentAge);
            students.push(newStudent);

            // อันนี้เอาไว้ อัพเดตรายการนักเรียนและจำนวนนักเรียนในหน้าเว็บ
            updateStudentList();
            alert("Student added successfully!");
        }
    });

    // ฟังก์ชันให้ครูเลือกให้เกรดนักเรียน
    $("#assignGradeForm").on("submit", function (event) {
        event.preventDefault();

        const selectedTeacherIndex = parseInt($("#teacherSelect").val() as string, 10);
        const selectedStudentIndex = parseInt($("#studentSelect").val() as string, 10);
        const grade = parseInt($("#grade").val() as string, 10);

        if (!isNaN(selectedTeacherIndex) && !isNaN(selectedStudentIndex) && !isNaN(grade)) {
            const teacher = teachers[selectedTeacherIndex];
            const student = students[selectedStudentIndex];

            teacher.assignGrade(student, grade);

            updateAverageGradeDisplay();
            updateTopStudentsDisplay();
        }
    });

    // อัปเดตจำนวนครูและนักเรียนในหน้าเว็บตอนโหลดครั้งแรก
    updateTeacherList();
    updateStudentList();

});

//Part 4: Utility Functions for Display


// อัปเดตรายการครู
function updateTeacherList() {
    $("#teacherList").empty(); // ล้างข้อมูลเดิมในรายการ
    $("#teacherList").append(`<h3>Total Teachers: ${Teacher.totalTeachers()}</h3>`);

    teachers.forEach((teacher, index) => {
        $("#teacherList").append(`<li>${teacher.name} - Subject: ${teacher.subject}, Age: ${teacher.age}</li>`);
    });

    // อัพเดต dropdown 
    $("#teacherSelect").empty();
    teachers.forEach((teacher, index) => {
        $("#teacherSelect").append(`<option value="${index}">${teacher.name} (${teacher.subject})</option>`);
    });
}

// อัปเดตรายการนักเรีย
function updateStudentList() {
    $("#studentList").empty(); 
    $("#studentList").append(`<h3>Total Students: ${Student.totalStudents()}</h3>`);

    students.forEach((student, index) => {
        $("#studentList").append(`<li>${student.name} - Age: ${student.age}</li>`);
    });

    
    $("#studentSelect").empty();
    students.forEach((student, index) => {
        $("#studentSelect").append(`<option value="${index}">${student.name}</option>`);
    });
}

// Part 5: Grade Calculation and Display

// ฟังก์ชันคำนวณและอัพเดตเกรดเฉลี่ยทั้งหมด
function updateAverageGradeDisplay() {
    if (students.length > 0) {
        const totalGrades = students.reduce((acc, student) => acc + student.getAverageGrade(), 0);
        const averageGrade = totalGrades / students.length;
        $("#averageGrade").text(averageGrade.toFixed(2));
    } else {
        $("#averageGrade").text("-");
    }
}

// Part 6: Display Top Students


// ฟังก์ชันแสดง Top Students
function updateTopStudentsDisplay() {
    const topStudents = students.filter(student => student.getLatestGrade() !== null && student.getLatestGrade()! >= 75);
    $("#topStudentsList").empty();
    topStudents.forEach(student => {
        $("#topStudentsList").append(`<li>Top student ${student.name} graded ${student.getLatestGrade()} point</li>`);
    });
}

// Part 7: Data Persistence (Optional)

// ฟังก์ชันสำหรับบันทึกข้อมูลครูและนักเรียนลงใน localStorage 
function saveData() {
    localStorage.setItem("teachers", JSON.stringify(teachers));
    localStorage.setItem("students", JSON.stringify(students));
}

// Part 8: Load Data from Storage
// ฟังก์ชันสำหรับโหลดข้อมูลครูและนักเรียนจาก localStorage
function loadData() {
    const savedTeachers = localStorage.getItem("teachers");
    const savedStudents = localStorage.getItem("students");
    if (savedTeachers) {
        const parsedTeachers = JSON.parse(savedTeachers);
        parsedTeachers.forEach((t: any) => {
            teachers.push(new Teacher(t.name, t.age, t.subject));
        });
        updateTeacherList();
    }
    if (savedStudents) {
        const parsedStudents = JSON.parse(savedStudents);
        parsedStudents.forEach((s: any) => {
            students.push(new Student(s.name, s.age));
        });
        updateStudentList();
    }
}


// Part 9: Error Handling

// ฟังก์ชันสำหรับจัดการข้อผิดพลาด เผื่อ API ล้มเหลว
function handleError(message: string) {
    console.error(`Error: ${message}`);
    alert(`Error: ${message}`);
}



