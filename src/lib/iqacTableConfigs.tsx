import React from "react";
import { textColumn, keyColumn, Column } from "react-datasheet-grid";

export interface IQACTableDefinition {
  title: string;
  category: "Part A: Department Assessment" | "Part B: AAA Department" | "Part C: AAA Institution";
  tableNumber?: number;
  columns: (Column<any, any> & { accessorKey?: string })[];
  defaultRows?: any[];
}

// Custom Select Column for AAA Rating (5-Excellent, 4-Very Good, 3-Good, 2-Average, 0-Incomplete)
export const aaaRatingOptions = [
  { value: "5 - Excellent", label: "5 - Excellent" },
  { value: "4 - Very Good", label: "4 - Very Good" },
  { value: "3 - Good", label: "3 - Good" },
  { value: "2 - Average", label: "2 - Average" },
  { value: "0 - Incomplete", label: "0 - Incomplete" },
];

export const aaaRatingColumn: Column<string | null, any> = {
  component: ({ rowData, setRowData, focus }) => (
    <select
      className="w-full h-full bg-card border-0 outline-none px-2 cursor-pointer text-xs sm:text-sm text-foreground focus:ring-1 focus:ring-accent"
      value={rowData || ""}
      autoFocus={focus}
      onChange={(e) => setRowData(e.target.value)}
    >
      <option value="">-- Select Rating --</option>
      {aaaRatingOptions.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  ),
  deleteValue: () => "",
  copyValue: ({ rowData }) => rowData || "",
  pasteValue: ({ value }) => value || "",
};

export const readOnlyTextColumn: Column<string | null, any> = {
  ...textColumn,
  disabled: true,
};

// Part B: 48 Pre-populated Key Aspects from GPREC IQAC Manual
export const PART_B_KEY_ASPECTS = [
  "Student-Teacher Ratio",
  "Stock Registers & Equipment in Department",
  "Quantity & Quality of Assignments /Mini Projects",
  "Conduct of Tutorial Classes",
  "Conduct of Remedial Classes",
  "Learning materials and software available for the student learning and their use",
  "Conduct of Re-tests",
  "Best Practices in the Department",
  "Budget & Utilization",
  "Process used in defining Vision, Mission, PEO and PSO statements",
  "Methodologies Used to support slow runners and encourage advanced runners and Impact analysis",
  "CO-PO/PSO Mapping of All courses",
  "CO-PO/PSO attainments and Continuous Improvement",
  "Students Admissions",
  "Technical Magazines and Newsletters of Department",
  "Lab maintenance and Safety Measures",
  "Functioning of Class Committees",
  "Syllabus coverage of practical classes",
  "Faculty evaluation by students",
  "Entrepreneurship Development Activities",
  "Faculty Profiles",
  "Attendance of students",
  "Students Projects (Internal & External)",
  "Higher Studies of Students",
  "Evaluation of performance of the students in practical classes",
  "Delivery Details of the content beyond the Syllabus, Activities organized beyond the syllabus",
  "Syllabus coverage as per Course Plan",
  "Use of ICT enabled Teaching & Digital Courses",
  "Evaluation of Internal Examinations",
  "Maintenance of Course Diary",
  "Participation of Faculty in FDPs",
  "Recognition of the Departmental faculty as Research Guides",
  "Participation of Faculty in development of Curriculum",
  "Participation of Faculty in non-academic programs",
  "Faculty Publications",
  "Faculty Patents",
  "Faculty Research Projects",
  "Awards & Achievements of the Faculty",
  "Course Files",
  "Evaluation of performance of students in internal examinations",
  "Conduct of bridge courses",
  "Conduct of expert talks, industry interaction etc for students",
  "Co-curricular and extra-curricular activities for students",
  "Placements of the Departmental students",
  "Students' feedback on curriculum coverage by HoD",
  "Students' feedback on infrastructural facilities",
  "Feedback from other stakeholders such as Parents, Alumni and Industry",
  "Summer internships and Industry Internships",
];

// Part C: 34 Pre-populated Key Aspects from GPREC IQAC Manual
export const PART_C_KEY_ASPECTS = [
  "Faculty Recruitment",
  "Finance Audit",
  "Student-Teacher Ratio of College",
  "University Approvals",
  "AICTE Approvals",
  "Institute MoUs",
  "Budget Allocation and Its Procedure",
  "Academic Schedules",
  "First Year Faculty Ratio",
  "Course files of First Year Courses",
  "Co-PO attainment of First year Courses",
  "Publication of First Year faculty",
  "First year students attendance File",
  "Website Maintenance",
  "Students Mentoring",
  "Anti Ragging Cell",
  "Women Cell",
  "Conducting Internal Examination Procedures",
  "Conducting External Examination Procedures",
  "Results Declaration Procedure",
  "Academic Results",
  "Formation of Governing Council Body",
  "Formation of Academic Council Body",
  "Formation of BOS",
  "Common BOS minutes",
  "Minutes of CAC",
  "Students Representative Meetings",
  "Admissions",
  "Library Facilities Including Journals, Books, Magazines etc..",
  "Institute Scholarships",
  "Games & Sports",
  "IIC & ED Cell Activities",
  "Best Practices by Institute",
  "Strategic Plan of the Institute",
];

export const iqacTableConfigs: Record<string, IQACTableDefinition> = {
  // 1. Faculty Posts
  table_1_faculty_posts: {
    title: "Table 1: Faculty Posts Sanctioned, Filled and Vacant",
    category: "Part A: Department Assessment",
    tableNumber: 1,
    columns: [
      { ...keyColumn("position", textColumn), title: "Faculty Position", accessorKey: "position" },
      { ...keyColumn("sanctioned", textColumn), title: "Sanctioned as per Norms", accessorKey: "sanctioned" },
      { ...keyColumn("filled", textColumn), title: "Filled", accessorKey: "filled" },
      { ...keyColumn("vacant", textColumn), title: "Vacant", accessorKey: "vacant" },
    ],
    defaultRows: [
      { position: "Professor", sanctioned: "", filled: "", vacant: "" },
      { position: "Associate Professor", sanctioned: "", filled: "", vacant: "" },
      { position: "Assistant Professor", sanctioned: "", filled: "", vacant: "" },
      { position: "Total", sanctioned: "", filled: "", vacant: "" },
    ],
  },

  // 2. Faculty Profile
  table_2_faculty_profile: {
    title: "Table 2: Faculty Profile",
    category: "Part A: Department Assessment",
    tableNumber: 2,
    columns: [
      { ...keyColumn("name", textColumn), title: "Name of the Faculty", accessorKey: "name" },
      { ...keyColumn("designation", textColumn), title: "Designation", accessorKey: "designation" },
      { ...keyColumn("qualifications", textColumn), title: "Qualifications", accessorKey: "qualifications" },
      { ...keyColumn("dojInstitute", textColumn), title: "Date of Joining", accessorKey: "dojInstitute" },
      { ...keyColumn("dojPresentPost", textColumn), title: "Date of Appt. in Present Post", accessorKey: "dojPresentPost" },
      { ...keyColumn("teachingExperience", textColumn), title: "Teaching Experience (Yrs)", accessorKey: "teachingExperience" },
      { ...keyColumn("natureOfAppointment", textColumn), title: "Nature of Appt. (Regular/Adhoc)", accessorKey: "natureOfAppointment" },
    ],
  },

  // 3. Visiting / Adjunct Faculty
  table_3_visiting_faculty: {
    title: "Table 3: List of Visiting / Adjunct Faculty / Emeritus Professors",
    category: "Part A: Department Assessment",
    tableNumber: 3,
    columns: [
      { ...keyColumn("name", textColumn), title: "Name", accessorKey: "name" },
      { ...keyColumn("designation", textColumn), title: "Designation", accessorKey: "designation" },
      { ...keyColumn("dateOfAppointment", textColumn), title: "Date of Appointment", accessorKey: "dateOfAppointment" },
      { ...keyColumn("qualifications", textColumn), title: "Qualifications", accessorKey: "qualifications" },
      { ...keyColumn("experience", textColumn), title: "Experience (Teaching/Research/Industry)", accessorKey: "experience" },
    ],
  },

  // 4. Visiting Faculty Classes
  table_4_visiting_faculty_classes: {
    title: "Table 4: Classes Taken by Visiting / Adjunct / Emeritus Professors",
    category: "Part A: Department Assessment",
    tableNumber: 4,
    columns: [
      { ...keyColumn("slNo", textColumn), title: "Sl No", accessorKey: "slNo" },
      { ...keyColumn("name", textColumn), title: "Name", accessorKey: "name" },
      { ...keyColumn("courseTitle", textColumn), title: "Course Title", accessorKey: "courseTitle" },
      { ...keyColumn("semester", textColumn), title: "Class / Semester", accessorKey: "semester" },
      { ...keyColumn("classesTaken", textColumn), title: "Number of Classes Taken", accessorKey: "classesTaken" },
    ],
  },

  // 5. Technical and Administrative Staff
  table_5_support_staff: {
    title: "Table 5: Academic (Technical) and Administrative Support Staff",
    category: "Part A: Department Assessment",
    tableNumber: 5,
    columns: [
      { ...keyColumn("slNo", textColumn), title: "Sl No", accessorKey: "slNo" },
      { ...keyColumn("position", textColumn), title: "Position", accessorKey: "position" },
      { ...keyColumn("sanctioned", textColumn), title: "Sanctioned Posts", accessorKey: "sanctioned" },
      { ...keyColumn("filled", textColumn), title: "Filled", accessorKey: "filled" },
      { ...keyColumn("vacant", textColumn), title: "Vacant", accessorKey: "vacant" },
    ],
  },

  // 6. Thrust Areas of Research
  table_6_research_thrust_areas: {
    title: "Table 6: Thrust Areas of Research Identified by the Department",
    category: "Part A: Department Assessment",
    tableNumber: 6,
    columns: [
      { ...keyColumn("slNo", textColumn), title: "Sl No", accessorKey: "slNo" },
      { ...keyColumn("facultyName", textColumn), title: "Name of the Faculty", accessorKey: "facultyName" },
      { ...keyColumn("researchArea", textColumn), title: "Area of Research", accessorKey: "researchArea" },
    ],
  },

  // 7. Special Research Laboratories
  table_7_special_laboratories: {
    title: "Table 7: Special Research Laboratories in the Department",
    category: "Part A: Department Assessment",
    tableNumber: 7,
    columns: [
      { ...keyColumn("slNo", textColumn), title: "Sl No", accessorKey: "slNo" },
      { ...keyColumn("labName", textColumn), title: "Laboratory Name", accessorKey: "labName" },
      { ...keyColumn("equipment", textColumn), title: "Key Equipment / Facilities", accessorKey: "equipment" },
      { ...keyColumn("focus", textColumn), title: "Research Focus / Application", accessorKey: "focus" },
    ],
  },

  // 8. Budget and Expenditure
  table_8_budget_expenditure: {
    title: "Table 8: Budget and Expenditure Details",
    category: "Part A: Department Assessment",
    tableNumber: 8,
    columns: [
      { ...keyColumn("year", textColumn), title: "Year", accessorKey: "year" },
      { ...keyColumn("itemDetails", textColumn), title: "Details of Item", accessorKey: "itemDetails" },
      { ...keyColumn("proposed", textColumn), title: "Budget Proposed", accessorKey: "proposed" },
      { ...keyColumn("sanctioned", textColumn), title: "Budget Sanctioned", accessorKey: "sanctioned" },
      { ...keyColumn("actualExpenditure", textColumn), title: "Total Actual Expenditure", accessorKey: "actualExpenditure" },
    ],
  },

  // 9. Research Publications
  table_9_publications: {
    title: "Table 9: Research Publications of the Faculty",
    category: "Part A: Department Assessment",
    tableNumber: 9,
    columns: [
      { ...keyColumn("slNo", textColumn), title: "Sl No", accessorKey: "slNo" },
      { ...keyColumn("facultyName", textColumn), title: "Name of the Faculty", accessorKey: "facultyName" },
      { ...keyColumn("title", textColumn), title: "Title of the Publication", accessorKey: "title" },
      { ...keyColumn("isCorresponding", textColumn), title: "Corresponding Author (Y/N)", accessorKey: "isCorresponding" },
      { ...keyColumn("allAuthors", textColumn), title: "Names of All Authors", accessorKey: "allAuthors" },
      { ...keyColumn("journal", textColumn), title: "Journal Published", accessorKey: "journal" },
      { ...keyColumn("issn", textColumn), title: "ISBN / ISSN No.", accessorKey: "issn" },
      { ...keyColumn("impactFactor", textColumn), title: "Impact Factor", accessorKey: "impactFactor" },
      { ...keyColumn("citations", textColumn), title: "No. of Citations", accessorKey: "citations" },
      { ...keyColumn("incomeGenerated", textColumn), title: "Income Generated (Details)", accessorKey: "incomeGenerated" },
    ],
  },

  // 10. Patents Filed / Granted
  table_10_patents: {
    title: "Table 10: Patents Filed / Granted",
    category: "Part A: Department Assessment",
    tableNumber: 10,
    columns: [
      { ...keyColumn("slNo", textColumn), title: "Sl No", accessorKey: "slNo" },
      { ...keyColumn("facultyName", textColumn), title: "Name of the Faculty", accessorKey: "facultyName" },
      { ...keyColumn("title", textColumn), title: "Title of the Patent", accessorKey: "title" },
      { ...keyColumn("piOrCoi", textColumn), title: "PI or Co-I", accessorKey: "piOrCoi" },
      { ...keyColumn("allInvestigators", textColumn), title: "Applicants / Co-Investigators", accessorKey: "allInvestigators" },
      { ...keyColumn("status", textColumn), title: "Filed / Granted", accessorKey: "status" },
      { ...keyColumn("date", textColumn), title: "Date of Filing / Grant", accessorKey: "date" },
      { ...keyColumn("authority", textColumn), title: "Patent Authority", accessorKey: "authority" },
      { ...keyColumn("incomeGenerated", textColumn), title: "Income Generated", accessorKey: "incomeGenerated" },
    ],
  },

  // 11. Research Projects
  table_11_projects: {
    title: "Table 11: Research Projects (External and In-House)",
    category: "Part A: Department Assessment",
    tableNumber: 11,
    columns: [
      { ...keyColumn("slNo", textColumn), title: "Sl No", accessorKey: "slNo" },
      { ...keyColumn("facultyName", textColumn), title: "Name of the Faculty", accessorKey: "facultyName" },
      { ...keyColumn("title", textColumn), title: "Title of the Project", accessorKey: "title" },
      { ...keyColumn("allInvestigators", textColumn), title: "Names of All Investigators", accessorKey: "allInvestigators" },
      { ...keyColumn("piOrCoi", textColumn), title: "PI or Co-I", accessorKey: "piOrCoi" },
      { ...keyColumn("sanctionLetter", textColumn), title: "Letter No. & Date of Sanction", accessorKey: "sanctionLetter" },
      { ...keyColumn("fundingAgency", textColumn), title: "Funding Agency", accessorKey: "fundingAgency" },
      { ...keyColumn("duration", textColumn), title: "Duration", accessorKey: "duration" },
      { ...keyColumn("amount", textColumn), title: "Total Amount Sanctioned", accessorKey: "amount" },
      { ...keyColumn("progress", textColumn), title: "Progress of Project (in brief)", accessorKey: "progress" },
    ],
  },

  // 12. Professional Memberships
  table_12_professional_memberships: {
    title: "Table 12: Professional / Academic / Scientific Bodies Memberships",
    category: "Part A: Department Assessment",
    tableNumber: 12,
    columns: [
      { ...keyColumn("slNo", textColumn), title: "Sl No", accessorKey: "slNo" },
      { ...keyColumn("facultyName", textColumn), title: "Name of the Faculty", accessorKey: "facultyName" },
      { ...keyColumn("bodyName", textColumn), title: "Name of Professional Body", accessorKey: "bodyName" },
      { ...keyColumn("membershipType", textColumn), title: "Type of Membership (Life/Fellow/etc)", accessorKey: "membershipType" },
      { ...keyColumn("dateAcquired", textColumn), title: "Date of Acquiring", accessorKey: "dateAcquired" },
      { ...keyColumn("membershipNumber", textColumn), title: "Membership Number", accessorKey: "membershipNumber" },
      { ...keyColumn("period", textColumn), title: "Period of Membership", accessorKey: "period" },
    ],
  },

  // 13. Editorial Boards
  table_13_editorial_boards: {
    title: "Table 13: Member / Reviewer in Editorial Boards",
    category: "Part A: Department Assessment",
    tableNumber: 13,
    columns: [
      { ...keyColumn("slNo", textColumn), title: "Sl No", accessorKey: "slNo" },
      { ...keyColumn("facultyName", textColumn), title: "Name of Faculty", accessorKey: "facultyName" },
      { ...keyColumn("journalName", textColumn), title: "Name of Journal", accessorKey: "journalName" },
      { ...keyColumn("role", textColumn), title: "Member or Reviewer", accessorKey: "role" },
      { ...keyColumn("dateAcquired", textColumn), title: "Date of Acquiring", accessorKey: "dateAcquired" },
      { ...keyColumn("grantLetter", textColumn), title: "Letter No. & Date", accessorKey: "grantLetter" },
      { ...keyColumn("period", textColumn), title: "Period of Membership", accessorKey: "period" },
    ],
  },

  // 14. Guest Lectures Delivered
  table_14_guest_lectures_delivered: {
    title: "Table 14: Guest Lectures Delivered Outside the Institute",
    category: "Part A: Department Assessment",
    tableNumber: 14,
    columns: [
      { ...keyColumn("slNo", textColumn), title: "Sl No", accessorKey: "slNo" },
      { ...keyColumn("facultyName", textColumn), title: "Name of Faculty", accessorKey: "facultyName" },
      { ...keyColumn("invitedInstitute", textColumn), title: "Invited Institute", accessorKey: "invitedInstitute" },
      { ...keyColumn("topic", textColumn), title: "Topic Delivered", accessorKey: "topic" },
      { ...keyColumn("date", textColumn), title: "Date of Lecture", accessorKey: "date" },
    ],
  },

  // 15. Sessional Convener
  table_15_sessional_convener: {
    title: "Table 15: Departmental Faculty Acted as Sessional Convener / Chair",
    category: "Part A: Department Assessment",
    tableNumber: 15,
    columns: [
      { ...keyColumn("slNo", textColumn), title: "Sl No", accessorKey: "slNo" },
      { ...keyColumn("facultyName", textColumn), title: "Name of Faculty", accessorKey: "facultyName" },
      { ...keyColumn("programName", textColumn), title: "Name of Program", accessorKey: "programName" },
      { ...keyColumn("role", textColumn), title: "Session / Role Acted", accessorKey: "role" },
      { ...keyColumn("date", textColumn), title: "Date of Program", accessorKey: "date" },
    ],
  },

  // 16. Administrative Responsibilities
  table_16_administrative_responsibilities: {
    title: "Table 16: Non-Academic Programs & Administrative Responsibilities",
    category: "Part A: Department Assessment",
    tableNumber: 16,
    columns: [
      { ...keyColumn("slNo", textColumn), title: "Sl No", accessorKey: "slNo" },
      { ...keyColumn("facultyName", textColumn), title: "Name of Faculty", accessorKey: "facultyName" },
      { ...keyColumn("responsibility", textColumn), title: "Administrative Responsibility", accessorKey: "responsibility" },
      { ...keyColumn("period", textColumn), title: "Period", accessorKey: "period" },
    ],
  },

  // 17. Faculty Awards
  table_17_faculty_awards: {
    title: "Table 17: Awards, Recognitions & Achievements of Faculty",
    category: "Part A: Department Assessment",
    tableNumber: 17,
    columns: [
      { ...keyColumn("slNo", textColumn), title: "Sl No", accessorKey: "slNo" },
      { ...keyColumn("facultyName", textColumn), title: "Name of Faculty", accessorKey: "facultyName" },
      { ...keyColumn("awardName", textColumn), title: "Name / Description of Award", accessorKey: "awardName" },
      { ...keyColumn("conferredBy", textColumn), title: "Conferred Organization", accessorKey: "conferredBy" },
      { ...keyColumn("purpose", textColumn), title: "Purpose of Award", accessorKey: "purpose" },
      { ...keyColumn("date", textColumn), title: "Date Conferred", accessorKey: "date" },
      { ...keyColumn("contribution", textColumn), title: "Award Contribution", accessorKey: "contribution" },
    ],
  },

  // 18. Consultancy Revenue
  table_18_consultancy_revenue: {
    title: "Table 18: Revenue Generated Through Consultancy",
    category: "Part A: Department Assessment",
    tableNumber: 18,
    columns: [
      { ...keyColumn("slNo", textColumn), title: "Sl No", accessorKey: "slNo" },
      { ...keyColumn("agency", textColumn), title: "Agency Hiring Consultancy", accessorKey: "agency" },
      { ...keyColumn("consultant", textColumn), title: "Faculty Consultant", accessorKey: "consultant" },
      { ...keyColumn("nature", textColumn), title: "Nature of Consultancy", accessorKey: "nature" },
      { ...keyColumn("timeSpent", textColumn), title: "Hours / Days Spent", accessorKey: "timeSpent" },
      { ...keyColumn("revenue", textColumn), title: "Revenue Generated (₹)", accessorKey: "revenue" },
    ],
  },

  // 19. Seminars Conducted
  table_19_student_seminars_workshops: {
    title: "Table 19: Seminars / Workshops Conducted for Students",
    category: "Part A: Department Assessment",
    tableNumber: 19,
    columns: [
      { ...keyColumn("slNo", textColumn), title: "Sl No", accessorKey: "slNo" },
      { ...keyColumn("title", textColumn), title: "Name of Seminar / Workshop", accessorKey: "title" },
      { ...keyColumn("convener", textColumn), title: "Convener", accessorKey: "convener" },
      { ...keyColumn("collabAgency", textColumn), title: "Collaborating Agency", accessorKey: "collabAgency" },
      { ...keyColumn("fundingAgency", textColumn), title: "Funding Agency", accessorKey: "fundingAgency" },
      { ...keyColumn("studentsCount", textColumn), title: "No. of Students Participated", accessorKey: "studentsCount" },
      { ...keyColumn("duration", textColumn), title: "Duration / Period", accessorKey: "duration" },
    ],
  },

  // 20. Remedial Classes
  table_20_remedial_classes: {
    title: "Table 20: Remedial Classes Taken for Slow Learners",
    category: "Part A: Department Assessment",
    tableNumber: 20,
    columns: [
      { ...keyColumn("slNo", textColumn), title: "Sl No", accessorKey: "slNo" },
      { ...keyColumn("facultyName", textColumn), title: "Name of Faculty", accessorKey: "facultyName" },
      { ...keyColumn("subject", textColumn), title: "Subject", accessorKey: "subject" },
      { ...keyColumn("semester", textColumn), title: "Class / Semester", accessorKey: "semester" },
      { ...keyColumn("registered", textColumn), title: "Students Registered", accessorKey: "registered" },
      { ...keyColumn("attended", textColumn), title: "Students Attended", accessorKey: "attended" },
    ],
  },

  // 21. FDP Conducted
  table_21_fdp_conducted: {
    title: "Table 21: Faculty Development Programs Conducted by Institute",
    category: "Part A: Department Assessment",
    tableNumber: 21,
    columns: [
      { ...keyColumn("slNo", textColumn), title: "Sl No", accessorKey: "slNo" },
      { ...keyColumn("title", textColumn), title: "Name of FDP", accessorKey: "title" },
      { ...keyColumn("convener", textColumn), title: "Convener", accessorKey: "convener" },
      { ...keyColumn("collabAgency", textColumn), title: "Collaborating Agency", accessorKey: "collabAgency" },
      { ...keyColumn("fundingAgency", textColumn), title: "Funding Agency", accessorKey: "fundingAgency" },
      { ...keyColumn("facultyCount", textColumn), title: "Faculty Participated", accessorKey: "facultyCount" },
      { ...keyColumn("duration", textColumn), title: "Duration / Period", accessorKey: "duration" },
    ],
  },

  // 22. FDP Participated
  table_22_fdp_participated: {
    title: "Table 22: Departmental Faculty Participation in External FDPs",
    category: "Part A: Department Assessment",
    tableNumber: 22,
    columns: [
      { ...keyColumn("slNo", textColumn), title: "Sl No", accessorKey: "slNo" },
      { ...keyColumn("title", textColumn), title: "Name of FDP", accessorKey: "title" },
      { ...keyColumn("organizedBy", textColumn), title: "Organized By", accessorKey: "organizedBy" },
      { ...keyColumn("duration", textColumn), title: "Duration / Period", accessorKey: "duration" },
      { ...keyColumn("facultyDeputed", textColumn), title: "Faculty Deputed", accessorKey: "facultyDeputed" },
    ],
  },

  // 23. Guest Lectures by Eminent Speakers
  table_23_eminent_guest_lectures: {
    title: "Table 23: Guest Lectures by Eminent Researchers / Speakers",
    category: "Part A: Department Assessment",
    tableNumber: 23,
    columns: [
      { ...keyColumn("slNo", textColumn), title: "Sl No", accessorKey: "slNo" },
      { ...keyColumn("speakerName", textColumn), title: "Name of Eminent Speaker", accessorKey: "speakerName" },
      { ...keyColumn("topic", textColumn), title: "Topic Delivered", accessorKey: "topic" },
      { ...keyColumn("date", textColumn), title: "Date of Lecture", accessorKey: "date" },
      { ...keyColumn("participants", textColumn), title: "Participants Attended", accessorKey: "participants" },
    ],
  },

  // 24. CRT Programs
  table_24_crt_programs: {
    title: "Table 24: Campus Recruitment Training (CRT) Programs Conducted",
    category: "Part A: Department Assessment",
    tableNumber: 24,
    columns: [
      { ...keyColumn("slNo", textColumn), title: "Sl No", accessorKey: "slNo" },
      { ...keyColumn("programName", textColumn), title: "Program Name", accessorKey: "programName" },
      { ...keyColumn("duration", textColumn), title: "Duration / Period", accessorKey: "duration" },
      { ...keyColumn("facultyContributed", textColumn), title: "Faculty Contributed", accessorKey: "facultyContributed" },
      { ...keyColumn("studentsCount", textColumn), title: "Students Participated", accessorKey: "studentsCount" },
    ],
  },

  // 25. Placement Drives
  table_25_placement_drives: {
    title: "Table 25: Campus Placement Drives Conducted",
    category: "Part A: Department Assessment",
    tableNumber: 25,
    columns: [
      { ...keyColumn("slNo", textColumn), title: "Sl No", accessorKey: "slNo" },
      { ...keyColumn("company", textColumn), title: "Firm / Industry", accessorKey: "company" },
      { ...keyColumn("interviewDate", textColumn), title: "Date of Interviews", accessorKey: "interviewDate" },
      { ...keyColumn("studentDetails", textColumn), title: "Name & Roll No. of Student", accessorKey: "studentDetails" },
      { ...keyColumn("branch", textColumn), title: "Branch", accessorKey: "branch" },
      { ...keyColumn("packageLPA", textColumn), title: "Total Annual Package (LPA)", accessorKey: "packageLPA" },
    ],
  },

  // 26. Webinars
  table_26_webinars_organized: {
    title: "Table 26: Webinars Organized",
    category: "Part A: Department Assessment",
    tableNumber: 26,
    columns: [
      { ...keyColumn("slNo", textColumn), title: "Sl No", accessorKey: "slNo" },
      { ...keyColumn("title", textColumn), title: "Webinar Title", accessorKey: "title" },
      { ...keyColumn("dateTime", textColumn), title: "Date & Time", accessorKey: "dateTime" },
      { ...keyColumn("resourcePerson", textColumn), title: "Resource Person Name", accessorKey: "resourcePerson" },
      { ...keyColumn("organization", textColumn), title: "Organization", accessorKey: "organization" },
      { ...keyColumn("studentsCount", textColumn), title: "Students Participated", accessorKey: "studentsCount" },
      { ...keyColumn("facultyCount", textColumn), title: "Faculty Participated", accessorKey: "facultyCount" },
    ],
  },

  // 27. MoUs
  table_27_mous: {
    title: "Table 27: MoUs Entered Into by the Department",
    category: "Part A: Department Assessment",
    tableNumber: 27,
    columns: [
      { ...keyColumn("slNo", textColumn), title: "Sl No", accessorKey: "slNo" },
      { ...keyColumn("organization", textColumn), title: "Organization Name", accessorKey: "organization" },
      { ...keyColumn("objective", textColumn), title: "Objective of MoU", accessorKey: "objective" },
      { ...keyColumn("period", textColumn), title: "Period of MoU", accessorKey: "period" },
    ],
  },

  // 28. Student Projects
  table_28_student_research_projects: {
    title: "Table 28: Research Projects of the Students",
    category: "Part A: Department Assessment",
    tableNumber: 28,
    columns: [
      { ...keyColumn("slNo", textColumn), title: "Sl No", accessorKey: "slNo" },
      { ...keyColumn("studentName", textColumn), title: "Name of Student", accessorKey: "studentName" },
      { ...keyColumn("title", textColumn), title: "Title of Project", accessorKey: "title" },
      { ...keyColumn("guide", textColumn), title: "Name of Guide", accessorKey: "guide" },
      { ...keyColumn("sanctionLetter", textColumn), title: "Letter No. & Date", accessorKey: "sanctionLetter" },
      { ...keyColumn("agency", textColumn), title: "Funding Agency", accessorKey: "agency" },
      { ...keyColumn("duration", textColumn), title: "Duration", accessorKey: "duration" },
      { ...keyColumn("amount", textColumn), title: "Sanctioned Amount", accessorKey: "amount" },
      { ...keyColumn("outcome", textColumn), title: "Progress / Outcome in brief", accessorKey: "outcome" },
    ],
  },

  // 29. Student Awards
  table_29_student_awards: {
    title: "Table 29: Awards & Achievements of Students",
    category: "Part A: Department Assessment",
    tableNumber: 29,
    columns: [
      { ...keyColumn("slNo", textColumn), title: "Sl No", accessorKey: "slNo" },
      { ...keyColumn("studentName", textColumn), title: "Name of Student", accessorKey: "studentName" },
      { ...keyColumn("awardName", textColumn), title: "Name / Description of Award", accessorKey: "awardName" },
      { ...keyColumn("conferredBy", textColumn), title: "Conferred By", accessorKey: "conferredBy" },
      { ...keyColumn("purpose", textColumn), title: "Purpose of Award", accessorKey: "purpose" },
      { ...keyColumn("date", textColumn), title: "Date Conferred", accessorKey: "date" },
      { ...keyColumn("contribution", textColumn), title: "Award Contribution", accessorKey: "contribution" },
    ],
  },

  // 30. Backlog Details
  table_30_student_backlogs: {
    title: "Table 30: Details of Students with Backlogs",
    category: "Part A: Department Assessment",
    tableNumber: 30,
    columns: [
      { ...keyColumn("slNo", textColumn), title: "Sl No", accessorKey: "slNo" },
      { ...keyColumn("program", textColumn), title: "UG / PG", accessorKey: "program" },
      { ...keyColumn("branchClass", textColumn), title: "Branch and Class", accessorKey: "branchClass" },
      { ...keyColumn("oneBacklog", textColumn), title: "Students with 1 Backlog", accessorKey: "oneBacklog" },
      { ...keyColumn("twoBacklogs", textColumn), title: "Students with 2 Backlogs", accessorKey: "twoBacklogs" },
      { ...keyColumn("moreBacklogs", textColumn), title: "Students with > 2 Backlogs", accessorKey: "moreBacklogs" },
    ],
  },

  // 31. External Seminars
  table_31_student_external_seminars: {
    title: "Table 31: Students Participation in Seminars / Workshops Outside",
    category: "Part A: Department Assessment",
    tableNumber: 31,
    columns: [
      { ...keyColumn("slNo", textColumn), title: "Sl No", accessorKey: "slNo" },
      { ...keyColumn("title", textColumn), title: "Seminar / Workshop Name", accessorKey: "title" },
      { ...keyColumn("organizedBy", textColumn), title: "Organized By", accessorKey: "organizedBy" },
      { ...keyColumn("duration", textColumn), title: "Duration / Period", accessorKey: "duration" },
      { ...keyColumn("studentsCount", textColumn), title: "No. of Students Participated", accessorKey: "studentsCount" },
    ],
  },

  // 32. Industrial Visits
  table_32_industrial_visits: {
    title: "Table 32: Students Industrial Visits",
    category: "Part A: Department Assessment",
    tableNumber: 32,
    columns: [
      { ...keyColumn("slNo", textColumn), title: "Sl No", accessorKey: "slNo" },
      { ...keyColumn("industry", textColumn), title: "Industry Visited", accessorKey: "industry" },
      { ...keyColumn("branch", textColumn), title: "Branch / Class", accessorKey: "branch" },
      { ...keyColumn("studentsCount", textColumn), title: "No. of Students", accessorKey: "studentsCount" },
      { ...keyColumn("visitDate", textColumn), title: "Date of Visit", accessorKey: "visitDate" },
      { ...keyColumn("outcome", textColumn), title: "Brief Outcome of Visit", accessorKey: "outcome" },
    ],
  },

  // 33. Student Activities
  table_33_student_activities: {
    title: "Table 33: Students Co-curricular & Extra-curricular Activities",
    category: "Part A: Department Assessment",
    tableNumber: 33,
    columns: [
      { ...keyColumn("slNo", textColumn), title: "Sl No", accessorKey: "slNo" },
      { ...keyColumn("activity", textColumn), title: "Name of Activity", accessorKey: "activity" },
      { ...keyColumn("dateTime", textColumn), title: "Date & Time", accessorKey: "dateTime" },
      { ...keyColumn("venue", textColumn), title: "Venue", accessorKey: "venue" },
      { ...keyColumn("studentsCount", textColumn), title: "Students Participated", accessorKey: "studentsCount" },
      { ...keyColumn("guests", textColumn), title: "Chief Guests / Resource Persons", accessorKey: "guests" },
    ],
  },

  // 34. Alumni Information
  table_34_alumni_info: {
    title: "Table 34: Alumni Information",
    category: "Part A: Department Assessment",
    tableNumber: 34,
    columns: [
      { ...keyColumn("slNo", textColumn), title: "Sl No", accessorKey: "slNo" },
      { ...keyColumn("alumniName", textColumn), title: "Name of Alumni", accessorKey: "alumniName" },
      { ...keyColumn("yearOfStudy", textColumn), title: "Year of Study", accessorKey: "yearOfStudy" },
      { ...keyColumn("presentPosition", textColumn), title: "Present Position", accessorKey: "presentPosition" },
      { ...keyColumn("visitedGprec", textColumn), title: "Visited GPREC (Y/N)", accessorKey: "visitedGprec" },
      { ...keyColumn("contribution", textColumn), title: "Contribution to Dept / College", accessorKey: "contribution" },
    ],
  },

  // Part B: AAA Committee Department Assessment (48 Key Aspects)
  part_b_department_assessment: {
    title: "Part B: Assessment of the Department by AAA Committee",
    category: "Part B: AAA Department",
    columns: [
      { ...keyColumn("keyAspect", readOnlyTextColumn), title: "Key Aspects", accessorKey: "keyAspect" },
      { ...keyColumn("observations", textColumn), title: "AAA observations", accessorKey: "observations" },
      { ...keyColumn("rating", aaaRatingColumn), title: "AAA Rating (5/4/3/2/0)", accessorKey: "rating" },
      { ...keyColumn("suggestions", textColumn), title: "AAA Suggestions to the Department", accessorKey: "suggestions" },
    ],
    defaultRows: PART_B_KEY_ASPECTS.map((aspect) => ({
      keyAspect: aspect,
      observations: "",
      rating: "",
      suggestions: "",
    })),
  },

  // Part C: AAA Committee Institution Assessment (34 Key Aspects)
  part_c_institution_assessment: {
    title: "Part C: Institution Specific Assessment by AAA Committee",
    category: "Part C: AAA Institution",
    columns: [
      { ...keyColumn("keyAspect", readOnlyTextColumn), title: "Key Aspects", accessorKey: "keyAspect" },
      { ...keyColumn("observations", textColumn), title: "AAA observations", accessorKey: "observations" },
      { ...keyColumn("rating", aaaRatingColumn), title: "AAA Rating (5/4/3/2/0)", accessorKey: "rating" },
      { ...keyColumn("suggestions", textColumn), title: "AAA Suggestions to the GPREC", accessorKey: "suggestions" },
    ],
    defaultRows: PART_C_KEY_ASPECTS.map((aspect) => ({
      keyAspect: aspect,
      observations: "",
      rating: "",
      suggestions: "",
    })),
  },
};

export function getIQACTableConfig(tableIdentifier: string): IQACTableDefinition | undefined {
  return iqacTableConfigs[tableIdentifier];
}
