// สร้างคลาส Teacher โดยไม่ต้องสืบทอดจากคลาสอื่น
var Teacher = /** @class */ (function () {
    function Teacher(name, age, subject) {
        this.name = name;
        this.age = age;
        this.subject = subject;
        Teacher.totalTeachersCount++; // เพิ่มจำนวน Teacher ในระบบ
    }
    // Method สำหรับให้ครูเพิ่มคะแนนให้กับนักเรียน
    Teacher.prototype.assignGrade = function (student, grade) {
        student.addGrade(grade); // เพิ่มคะแนนให้กับนักเรียน
        $("#assignmentList").append("<li>".concat(this.name, " assigned grade ").concat(grade, " to ").concat(student.name, "</li>"));
    };
    // Static Method สำหรับคืนค่าจำนวนครูทั้งหมดในระบบ
    Teacher.totalTeachers = function () {
        return Teacher.totalTeachersCount; // คืนค่าจำนวนครูที่ถูกสร้างขึ้น
    };
    Teacher.totalTeachersCount = 0; // ตัวแปรเก็บจำนวนครูทั้งหมด
    return Teacher;
}());
// ส่วนของคลาส Student ยังคงเหมือนเดิม
var Student = /** @class */ (function () {
    function Student(name, age) {
        this.name = name;
        this.age = age;
        this.grades = [];
        Student.totalStudentsCount++; // เพิ่มจำนวน Student ในระบบ
    }
    Student.prototype.addGrade = function (grade) {
        this.grades.push(grade);
    };
    Student.prototype.getAverageGrade = function () {
        var total = this.grades.reduce(function (acc, curr) { return acc + curr; }, 0);
        return this.grades.length ? total / this.grades.length : 0;
    };
    Student.prototype.getLatestGrade = function () {
        return this.grades.length > 0 ? this.grades[this.grades.length - 1] : null;
    };
    Student.totalStudents = function () {
        return Student.totalStudentsCount;
    };
    Student.totalStudentsCount = 0; // ตัวแปรเก็บจำนวนนักเรียนทั้งหมด
    return Student;
}());
// อาร์เรย์สำหรับเก็บข้อมูลนักเรียนและครู
var students = [];
var teachers = [];
$(document).ready(function () {
    // ฟังก์ชันเพิ่มครู
    $("#teacherForm").on("submit", function (event) {
        event.preventDefault();
        var teacherName = $("#teacherName").val();
        var teacherAge = parseInt($("#teacherAge").val(), 10);
        var teacherSubject = $("#teacherSubject").val();
        if (teacherName && !isNaN(teacherAge) && teacherSubject) {
            var newTeacher = new Teacher(teacherName, teacherAge, teacherSubject);
            teachers.push(newTeacher);
            $("#teacherSelect").append("<option value=\"".concat(teachers.length - 1, "\">").concat(teacherName, " (").concat(teacherSubject, ")</option>"));
            $("#teacherList").append("<li>".concat(teacherName, " - Subject: ").concat(teacherSubject, ", Age: ").concat(teacherAge, "</li>"));
            alert("Teacher added successfully!");
            // อัปเดตจำนวนครูในหน้าเว็บ
            updateTeacherCount();
        }
    });
    // ฟังก์ชันเพิ่มนักเรียน
    $("#studentForm").on("submit", function (event) {
        event.preventDefault();
        var studentName = $("#studentName").val();
        var studentAge = parseInt($("#studentAge").val(), 10);
        if (studentName && !isNaN(studentAge)) {
            var newStudent = new Student(studentName, studentAge);
            students.push(newStudent);
            $("#studentSelect").append("<option value=\"".concat(students.length - 1, "\">").concat(studentName, "</option>"));
            $("#studentList").append("<li>".concat(studentName, " - Age: ").concat(studentAge, "</li>"));
            alert("Student added successfully!");
            // อัปเดตจำนวนนักเรียนในหน้าเว็บ
            updateStudentCount();
        }
    });
    // ฟังก์ชันให้ครูเลือกให้เกรดนักเรียน
    $("#assignGradeForm").on("submit", function (event) {
        event.preventDefault();
        var selectedTeacherIndex = parseInt($("#teacherSelect").val(), 10);
        var selectedStudentIndex = parseInt($("#studentSelect").val(), 10);
        var grade = parseInt($("#grade").val(), 10);
        if (!isNaN(selectedTeacherIndex) && !isNaN(selectedStudentIndex) && !isNaN(grade)) {
            var teacher = teachers[selectedTeacherIndex];
            var student = students[selectedStudentIndex];
            teacher.assignGrade(student, grade);
            updateAverageGradeDisplay();
            updateTopStudentsDisplay();
        }
    });
    // อัปเดตจำนวนครูและนักเรียนในหน้าเว็บตอนโหลดครั้งแรก
    updateTeacherCount();
    updateStudentCount();
});
// ฟังก์ชันอัปเดตจำนวนครูในหน้าเว็บ
function updateTeacherCount() {
    $("#teacherCount").text(Teacher.totalTeachers());
}
// ฟังก์ชันอัปเดตจำนวนนักเรียนในหน้าเว็บ
function updateStudentCount() {
    $("#studentCount").text(Student.totalStudents());
}
// ฟังก์ชันคำนวณและอัพเดตเกรดเฉลี่ยทั้งหมด
function updateAverageGradeDisplay() {
    if (students.length > 0) {
        var totalGrades = students.reduce(function (acc, student) { return acc + student.getAverageGrade(); }, 0);
        var averageGrade = totalGrades / students.length;
        $("#averageGrade").text(averageGrade.toFixed(2));
    }
    else {
        $("#averageGrade").text("-");
    }
}
// ฟังก์ชันแสดง Top Students
function updateTopStudentsDisplay() {
    var topStudents = students.filter(function (student) { return student.getLatestGrade() !== null && student.getLatestGrade() >= 75; });
    $("#topStudentsList").empty();
    topStudents.forEach(function (student) {
        $("#topStudentsList").append("<li>Top student ".concat(student.name, " graded ").concat(student.getLatestGrade(), " point</li>"));
    });
}
