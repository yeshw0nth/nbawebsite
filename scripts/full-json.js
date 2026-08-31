const fs = require('fs');
const path = require('path');

const data = [
  {
    "Criterion": "Criterion 1: Outcome-based Curriculum",
    "Marks": 120,
    "Sub-Criteria": [
      {
        "Title": "1.1. Vision, Mission and Program Educational Objectives (PEOs)",
        "Marks": 35,
        "Sub-Sub-Criteria": [
          {
            "Title": "1.1.1. State the Vision and Mission of the Institute and the Department",
            "Marks": 5,
            "Guidelines_and_Exhibits": {
              "Evaluation_Guidelines": "A. Availability of the vision and mission statements of the Department (01)\nB. Appropriateness and relevance of the statements (02)\nC. Consistency of the Department vision and mission statements with the Institute Vision and Mission (02)",
              "Exhibits_Context_to_be_Observed_Assessed": "A. Vision and Mission Statements of both the Department and the Institute\nB. Correctness from definition perspective\nC. Consistency between Institute and Department statements"
            }
          },
          {
            "Title": "1.1.2. State PEOs of the Program",
            "Marks": 5,
            "Guidelines_and_Exhibits": {
              "Evaluation_Guidelines": "Listing of the Program Educational Objectives (3 to 5) of the program under consideration and their appropriateness",
              "Exhibits_Context_to_be_Observed_Assessed": " Availability & correctness of the PEOs statements"
            }
          },
          {
            "Title": "1.1.3. Process of Defining Vision, Mission and PEOs",
            "Marks": 10,
            "Guidelines_and_Exhibits": {
              "Evaluation_Guidelines": "A. Description of the process involved in defining the Vision, Mission of the Department (06)\nB. Description of the process involved in defining the PEOs of the program (04)",
              "Exhibits_Context_to_be_Observed_Assessed": " Documentary evidence demonstrating the process ensuring effective participation of internal and external stakeholders, along with effective process implementation."
            }
          },
          {
            "Title": "1.1.4. Dissemination of Vision, Mission and PEOs",
            "Marks": 5,
            "Guidelines_and_Exhibits": {
              "Evaluation_Guidelines": "A. Adequacy in respect of publication & dissemination (03)\nB. Process of dissemination among stakeholders (02)",
              "Exhibits_Context_to_be_Observed_Assessed": "A. Adequacy: Department vision, mission, and PEOs should be available on the Institute website under the relevant program link. Additionally, they should be posted on department notice boards, HoD’s chamber. Furthermore, they should be included in department-level documents and the course of study.\nB. Process of dissemination: Documentary evidence outlining the process ensuring awareness among internal and external stakeholders, including effective implementation."
            }
          },
          {
            "Title": "1.1.5. Mapping of PEOs with Mission",
            "Marks": 10,
            "Guidelines_and_Exhibits": {
              "Evaluation_Guidelines": "A. Preparation of a matrix of PEOs and mission statement (05)\nB. Consistency/justification of correlation parameters of the above matrix (05)",
              "Exhibits_Context_to_be_Observed_Assessed": "A. Availability of a matrix containing PEOs and Mission.\nB. Documentary evidence for justification for each statement mapped in the matrix."
            }
          }
        ]
      },
      {
        "Title": "1.2 Curriculum Structure and Features",
        "Marks": 30,
        "Sub-Sub-Criteria": [
          {
            "Title": "1.2.1. State the Process for Developing/ Revising the Program Curriculum",
            "Marks": 10,
            "Guidelines_and_Exhibits": {
              "Evaluation_Guidelines": "Periodic review through search conferences/curriculum development workshops, identifying job roles etc., taking into account the POs and PSOs. Involvement of the industry in this process.",
              "Exhibits_Context_to_be_Observed_Assessed": " Documentary evidence demonstrating the process by which the program curriculum evolves and undergoes periodic review, taking into consideration POs and PSOs."
            }
          },
          {
            "Title": "1.2.2. Curriculum Structure",
            "Marks": 10,
            "Guidelines_and_Exhibits": {
              "Evaluation_Guidelines": "Courses required for the degree program and distribution of learning hours assigned in terms of attaining POs and PSOs.",
              "Exhibits_Context_to_be_Observed_Assessed": " Documentary evidence of the courses, including teaching methods and the number of credits, within the program curriculum"
            }
          },
          {
            "Title": "1.2.3. Components of Curriculum",
            "Marks": 5,
            "Guidelines_and_Exhibits": {
              "Evaluation_Guidelines": "Verify curricular components for the attainment of POs and PSOs",
              "Exhibits_Context_to_be_Observed_Assessed": " Documentary evidence of Curriculum components."
            }
          },
          {
            "Title": "1.2.4. Strategies for Education Reforms",
            "Marks": 5,
            "Guidelines_and_Exhibits": {
              "Evaluation_Guidelines": "Curriculum design in terms of various educational reforms such as multidisciplinary and interdisciplinary approaches, multi-point entry/exit options, academic bank of credits, skill based courses, and recognition of prior learning, etc.",
              "Exhibits_Context_to_be_Observed_Assessed": " Evidence of the action plan for NEP 2020, state education policy, etc., including their implementations. Additionally, map activities in curriculum design with multidisciplinary and interdisciplinary programs, the establishment of an academic bank of credits system, and APAAR, etc."
            }
          }
        ]
      },
      {
        "Title": "1.3. PO, PSO and their Mapping with Courses",
        "Marks": 20,
        "Sub-Sub-Criteria": [
          {
            "Title": "1.3.1 POs and PSOs",
            "Marks": 5,
            "Guidelines_and_Exhibits": {
              "Evaluation_Guidelines": "Listing of the Program Specific Outcomes (up to 3) of the program under consideration and their appropriateness",
              "Exhibits_Context_to_be_Observed_Assessed": ""
            }
          },
          {
            "Title": "1.3.2 Mapping between the Courses and POs/PSOs",
            "Marks": 15,
            "Guidelines_and_Exhibits": {
              "Evaluation_Guidelines": "Justification of mapping between courses and POs and PSOs",
              "Exhibits_Context_to_be_Observed_Assessed": " Availability & correctness of the PSOs statements\n Documentary evidence of mapping of all courses with POs/PSOs"
            }
          }
        ]
      },
      {
        "Title": "1.4. Course Outcomes and Course Articulation Matrix",
        "Marks": 30,
        "Sub-Sub-Criteria": [
          {
            "Title": "1.4.1. Course Outcome (Semester Wise)",
            "Marks": 15,
            "Guidelines_and_Exhibits": {
              "Evaluation_Guidelines": "Availability of appropriate COs for every course",
              "Exhibits_Context_to_be_Observed_Assessed": " Documentary evidence of appropriateness of the CO statements."
            }
          },
          {
            "Title": "1.4.2. Course Articulation Matrix",
            "Marks": 15,
            "Guidelines_and_Exhibits": {
              "Evaluation_Guidelines": "Availability of Course Articulation Matrix and its appropriateness in terms of level of correlation.",
              "Exhibits_Context_to_be_Observed_Assessed": " Documentary evidence of justification of appropriateness of mapping of COs and correlation levels with various POs and PSOs"
            }
          }
        ]
      },
      {
        "Title": "1.5. Program Articulation Matrix",
        "Marks": 5,
        "Sub-Sub-Criteria": [
          {
            "Title": "1.5. Program Articulation Matrix",
            "Marks": 5,
            "Guidelines_and_Exhibits": {
              "Evaluation_Guidelines": "Availability of Mapping of Courses and POs/ PSOs",
              "Exhibits_Context_to_be_Observed_Assessed": " Documentary evidence of Articulation Matrix and relevance"
            }
          }
        ]
      }
    ]
  },
  {
    "Criterion": "Criterion 2: Outcome Based Teaching Learning",
    "Marks": 120,
    "Sub-Criteria": [
      {
        "Title": "2.1. Describe Processes Followed to Ensure Quality of Teaching & Learning",
        "Marks": 20,
        "Sub-Sub-Criteria": [
          {
            "Title": "2.1. Describe Processes Followed to Ensure Quality of Teaching & Learning",
            "Marks": 20,
            "Guidelines_and_Exhibits": {
              "Evaluation_Guidelines": "A. Adherence to the Academic Calendar (02)\nB. Pedagogical Initiatives (05)\nC. Support students based on their ability (04)\nD. Quality of Classroom Teaching (04)\nE. Conduct of Experiments (05)",
              "Exhibits_Context_to_be_Observed_Assessed": "A. Academic Calendar and its effective implementation.\nB. Documentary evidence of supporting the implementation of pedagogical initiatives, such as real-life examples, collaborative learning, ICT supported learning, and interactive classrooms.\nC. Documentary evidence of tailored resources, differentiated instruction, and individualized attention to meet their unique learning needs\nD. Classroom ambience and efforts to keep students engaged (also to be verified during interaction with the students).\nE. Quality of laboratory experience concerning conducting experiments, recording observations, analysis, etc. (also to be verified during interaction with the students)."
            }
          }
        ]
      },
      {
        "Title": "2.2. Quality of Student Capstone Project",
        "Marks": 25,
        "Sub-Sub-Criteria": [
          {
            "Title": "2.2. Quality of Student Capstone Project",
            "Marks": 25,
            "Guidelines_and_Exhibits": {
              "Evaluation_Guidelines": "A. Identification of capstone/major project and allocation of guides (05)\nB. Types and relevance of the capstone/major project and their contribution towards the attainment of POs and PSOs (06)\nC. Continuous monitoring process (04)\nD. Quality of completed projects/working models/prototypes in relation to environment, sustainability, safety, ethics and cost (10)",
              "Exhibits_Context_to_be_Observed_Assessed": "A. Capstone/major project identification and guide/ supervisor allocation process\nB. Projects classification (application, product, research, review, etc.), incorporating factors such as environment, safety, ethics, cost, standards, and mapping with POs and PSOs.\nC. Process for continuous monitoring (Meeting records with guide and its frequency etc.,)\nD. Quality of projects, working models, or prototypes incorporating factors such as environment, safety, ethics, cost, standards, and mapping with POs and PSOs."
            }
          }
        ]
      },
      {
        "Title": "2.3. Internship/Industrial Training",
        "Marks": 10,
        "Sub-Sub-Criteria": [
          {
            "Title": "2.3. Internship/Industrial Training",
            "Marks": 10,
            "Guidelines_and_Exhibits": {
              "Evaluation_Guidelines": "A. Process of Internship/Industrial training for students (03)\nB. Mapping of Industrial training/internships with POs and PSOs (04)\nC. Student feedback on training/internships and its analysis (03)",
              "Exhibits_Context_to_be_Observed_Assessed": "A. Documentary evidence of process of internship/ industrial training for students, number of students participated, relevant training areas, documented visit report, with a duration of not less than 2 weeks for the industrial training/internship.\nB. Documentary evidence of mapping of internship and training programs for students to POs and PSOs\nC. Documentary evidence of student feedback on industrial training and its analysis and actions taken."
            }
          }
        ]
      },
      {
        "Title": "2.4. Seminar and Mini/Micro Projects",
        "Marks": 10,
        "Sub-Sub-Criteria": [
          {
            "Title": "2.4. Seminar and Mini/Micro Projects",
            "Marks": 10,
            "Guidelines_and_Exhibits": {
              "Evaluation_Guidelines": "A. Mapping of Seminars presented by the students with POs and PSOs (05)\nB. Mapping of the mini/micro project and their contribution with POs and PSOs (05)",
              "Exhibits_Context_to_be_Observed_Assessed": "A. Documentary evidence of seminars presented by the students\nB. Documentary evidence of Mini/micro projects and their mapping with POs and PSOs."
            }
          }
        ]
      },
      {
        "Title": "2.5. Case Studies and Real-Life Examples",
        "Marks": 10,
        "Sub-Sub-Criteria": [
          {
            "Title": "2.5. Case Studies and Real-Life Examples",
            "Marks": 10,
            "Guidelines_and_Exhibits": {
              "Evaluation_Guidelines": "Use of case studies and real-life examples in teaching and their mapping with POs and PSOs.",
              "Exhibits_Context_to_be_Observed_Assessed": " Documentary evidences of case studies and real-life examples and its mapping with POs and PSOs."
            }
          }
        ]
      },
      {
        "Title": "2.6. SWAYAM/NPTEL/MOOC/Self Learning",
        "Marks": 10,
        "Sub-Sub-Criteria": [
          {
            "Title": "2.6. SWAYAM/NPTEL/MOOC/Self Learning",
            "Marks": 10,
            "Guidelines_and_Exhibits": {
              "Evaluation_Guidelines": "A. Number of students obtained MOOCs certification through platforms like SWAYAM/NPTEL, etc and their mapping with POs and PSOs (07).\nB. Scope for self-learning & facilities and its use. (03)",
              "Exhibits_Context_to_be_Observed_Assessed": "A. Documentary evidence of number of students cleared MOOCs\nB. Evidence for Self-learning."
            }
          }
        ]
      },
      {
        "Title": "2.7. Solving Complex Engineering Problems Incorporating Sustainability Goals",
        "Marks": 20,
        "Sub-Sub-Criteria": [
          {
            "Title": "2.7. Solving Complex Engineering Problems Incorporating Sustainability Goals",
            "Marks": 20,
            "Guidelines_and_Exhibits": {
              "Evaluation_Guidelines": "List of complex engineering problems from different courses/activities/mini projects, etc. along with the targeted SDGs.",
              "Exhibits_Context_to_be_Observed_Assessed": " Documentary evidences of solving complex engineering problems targeting SDGs"
            }
          }
        ]
      },
      {
        "Title": "2.8. Steps Taken for Enhancing Industry Institute Partnerships",
        "Marks": 15,
        "Sub-Sub-Criteria": [
          {
            "Title": "2.8. Steps Taken for Enhancing Industry Institute Partnerships",
            "Marks": 15,
            "Guidelines_and_Exhibits": {
              "Evaluation_Guidelines": "A. Industry involvement in the partial delivery of any regular courses for students (05)\nB. Industry offered courses/training (04)\nC. Industry-supported laboratories (03)\nD. Impact analysis and actions taken thereof (03)",
              "Exhibits_Context_to_be_Observed_Assessed": "A. Documentary evidence of industry involvement in the partial delivery of any regular courses.\nB. Documentary evidence of industry offered courses/training\nC. Types of industries, types of labs, objectives, utilization, and effectiveness.\nD. Analysis and actions taken as a result."
            }
          }
        ]
      }
    ]
  },
  {
    "Criterion": "Criterion 3: Outcome-Based Assessment",
    "Marks": 120,
    "Sub-Criteria": [
      {
        "Title": "3.1. Evaluation of Continuous Assessment",
        "Marks": 10,
        "Sub-Sub-Criteria": [
          {
            "Title": "3.1. Evaluation of Continuous Assessment",
            "Marks": 10,
            "Guidelines_and_Exhibits": {
              "Evaluation_Guidelines": "A. Process for setting and evaluation of internal semester question paper (02)\nB. Quality of questions, appropriateness of mapping with the COs (03)\nC. Assessment of COs coverage (03)",
              "Exhibits_Context_to_be_Observed_Assessed": "Process documentation and mapping evidence."
            }
          }
        ]
      },
      {
        "Title": "3.2. Evaluation of Semester End Exam",
        "Marks": 10,
        "Sub-Sub-Criteria": [
          {
            "Title": "3.2. Evaluation of Semester End Exam",
            "Marks": 10,
            "Guidelines_and_Exhibits": {
              "Evaluation_Guidelines": "A. Process for setting and evaluation (03)\nB. Quality of questions (05)",
              "Exhibits_Context_to_be_Observed_Assessed": "Process and mapping evidence."
            }
          }
        ]
      },
      {
        "Title": "3.3. Evaluation of Laboratory Work",
        "Marks": 10,
        "Sub-Sub-Criteria": [
          {
            "Title": "3.3. Evaluation of Laboratory Work",
            "Marks": 10,
            "Guidelines_and_Exhibits": {
              "Evaluation_Guidelines": "A. Evaluation of experiments (05)\nB. Use of Rubrics (05)",
              "Exhibits_Context_to_be_Observed_Assessed": "Rubrics evidence."
            }
          }
        ]
      },
      {
        "Title": "3.4. Evaluation of Industrial Training",
        "Marks": 10,
        "Sub-Sub-Criteria": [
          {
            "Title": "3.4. Evaluation of Industrial Training",
            "Marks": 10,
            "Guidelines_and_Exhibits": {
              "Evaluation_Guidelines": "A. Relevance of internships (04)\nB. Rubrics used for assessing student industrial training (06)",
              "Exhibits_Context_to_be_Observed_Assessed": "Rubrics evidence."
            }
          }
        ]
      },
      {
        "Title": "3.5. Evaluation of Projects",
        "Marks": 20,
        "Sub-Sub-Criteria": [
          {
            "Title": "3.5. Evaluation of Projects",
            "Marks": 20,
            "Guidelines_and_Exhibits": {
              "Evaluation_Guidelines": "A. Rubrics used for assessing complexity (10)\nB. Rubrics used for assessing team work (10)",
              "Exhibits_Context_to_be_Observed_Assessed": "Rubrics evidence."
            }
          }
        ]
      },
      {
        "Title": "3.6. Evidence of Addressing Sustainable Development Goals",
        "Marks": 10,
        "Sub-Sub-Criteria": [
          {
            "Title": "3.6. Evidence of Addressing Sustainable Development Goals",
            "Marks": 10,
            "Guidelines_and_Exhibits": {
              "Evaluation_Guidelines": "Evidence of Addressing SDGs",
              "Exhibits_Context_to_be_Observed_Assessed": "Student project activities."
            }
          }
        ]
      },
      {
        "Title": "3.7. Attainment of Course Outcomes",
        "Marks": 25,
        "Sub-Sub-Criteria": [
          {
            "Title": "3.7.1. Describe the Assessment Tools",
            "Marks": 5,
            "Guidelines_and_Exhibits": {
              "Evaluation_Guidelines": "A. List of assessment tools (02)\nB. The quality/relevance (03)",
              "Exhibits_Context_to_be_Observed_Assessed": "Documentary evidence."
            }
          },
          {
            "Title": "3.7.2. Record the Attainment of Course Outcomes",
            "Marks": 20,
            "Guidelines_and_Exhibits": {
              "Evaluation_Guidelines": "Verification of the attainment levels",
              "Exhibits_Context_to_be_Observed_Assessed": "Methodology to define set levels."
            }
          }
        ]
      },
      {
        "Title": "3.8. Attainment of Program Outcomes",
        "Marks": 25,
        "Sub-Sub-Criteria": [
          {
            "Title": "3.8.1. Provide Results of Evaluation",
            "Marks": 25,
            "Guidelines_and_Exhibits": {
              "Evaluation_Guidelines": "A. Verification of documents (10)\nB. Assessment of overall levels (15)",
              "Exhibits_Context_to_be_Observed_Assessed": "Documentary evidence."
            }
          }
        ]
      }
    ]
  },
  {
    "Criterion": "Criterion 4: Students' Performance",
    "Marks": 120,
    "Sub-Criteria": [
      {
        "Title": "4.1. Enrolment Ratio",
        "Marks": 20,
        "Sub-Sub-Criteria": [
          {
            "Title": "4.1. Enrolment Ratio",
            "Marks": 20,
            "Guidelines_and_Exhibits": {
              "Evaluation_Guidelines": "A. >= 90% students (20)\nB. >= 80% (17)",
              "Exhibits_Context_to_be_Observed_Assessed": "Data verification."
            }
          }
        ]
      },
      {
        "Title": "4.2. Success Rate",
        "Marks": 15,
        "Sub-Sub-Criteria": [
          {
            "Title": "4.2. Success Rate",
            "Marks": 15,
            "Guidelines_and_Exhibits": {
              "Evaluation_Guidelines": "Success Rate SR=B/A",
              "Exhibits_Context_to_be_Observed_Assessed": "Data verification."
            }
          }
        ]
      },
      {
        "Title": "4.3. Academic Performance First Year",
        "Marks": 10,
        "Sub-Sub-Criteria": [
          {
            "Title": "4.3. Academic Performance First Year",
            "Marks": 10,
            "Guidelines_and_Exhibits": {
              "Evaluation_Guidelines": "API computation",
              "Exhibits_Context_to_be_Observed_Assessed": "Data verification."
            }
          }
        ]
      },
      {
        "Title": "4.4. Academic Performance Second Year",
        "Marks": 10,
        "Sub-Sub-Criteria": [
          {
            "Title": "4.4. Academic Performance Second Year",
            "Marks": 10,
            "Guidelines_and_Exhibits": {
              "Evaluation_Guidelines": "API computation",
              "Exhibits_Context_to_be_Observed_Assessed": "Data verification."
            }
          }
        ]
      },
      {
        "Title": "4.5. Academic Performance Third Year",
        "Marks": 10,
        "Sub-Sub-Criteria": [
          {
            "Title": "4.5. Academic Performance Third Year",
            "Marks": 10,
            "Guidelines_and_Exhibits": {
              "Evaluation_Guidelines": "API computation",
              "Exhibits_Context_to_be_Observed_Assessed": "Data verification."
            }
          }
        ]
      },
      {
        "Title": "4.6. Placement, Higher Studies",
        "Marks": 30,
        "Sub-Sub-Criteria": [
          {
            "Title": "4.6. Placement, Higher Studies",
            "Marks": 30,
            "Guidelines_and_Exhibits": {
              "Evaluation_Guidelines": "Placement index (P)",
              "Exhibits_Context_to_be_Observed_Assessed": "Data verification."
            }
          }
        ]
      },
      {
        "Title": "4.7. Professional Activities",
        "Marks": 25,
        "Sub-Sub-Criteria": [
          {
            "Title": "4.7.1. Professional Societies",
            "Marks": 5,
            "Guidelines_and_Exhibits": {
              "Evaluation_Guidelines": "Availability of activities (02)",
              "Exhibits_Context_to_be_Observed_Assessed": "Documentary evidence."
            }
          },
          {
            "Title": "4.7.2. Student's Participations",
            "Marks": 10,
            "Guidelines_and_Exhibits": {
              "Evaluation_Guidelines": "Participation state level (03)",
              "Exhibits_Context_to_be_Observed_Assessed": "Documentary evidence."
            }
          },
          {
            "Title": "4.7.3. Publication of Journals",
            "Marks": 5,
            "Guidelines_and_Exhibits": {
              "Evaluation_Guidelines": "Quality and relevance (03)",
              "Exhibits_Context_to_be_Observed_Assessed": "Documentary evidence."
            }
          },
          {
            "Title": "4.7.4. Student Publications",
            "Marks": 5,
            "Guidelines_and_Exhibits": {
              "Evaluation_Guidelines": "Journal papers (02)",
              "Exhibits_Context_to_be_Observed_Assessed": "Documentary evidence."
            }
          }
        ]
      }
    ]
  },
  {
    "Criterion": "Criterion 5: Faculty Information",
    "Marks": 100,
    "Sub-Criteria": [
      {
        "Title": "5.1. Student-Faculty Ratio",
        "Marks": 30,
        "Sub-Sub-Criteria": [
          {
            "Title": "5.1. Student-Faculty Ratio",
            "Marks": 30,
            "Guidelines_and_Exhibits": {
              "Evaluation_Guidelines": "SFR < 15 - 30 Marks",
              "Exhibits_Context_to_be_Observed_Assessed": "Data verification."
            }
          }
        ]
      },
      {
        "Title": "5.2. Faculty Qualification",
        "Marks": 25,
        "Sub-Sub-Criteria": [
          {
            "Title": "5.2. Faculty Qualification",
            "Marks": 25,
            "Guidelines_and_Exhibits": {
              "Evaluation_Guidelines": "Faculty qualification index (FQI)",
              "Exhibits_Context_to_be_Observed_Assessed": "Documentary evidence."
            }
          }
        ]
      },
      {
        "Title": "5.3. Faculty Cadre Proportion",
        "Marks": 25,
        "Sub-Sub-Criteria": [
          {
            "Title": "5.3. Faculty Cadre Proportion",
            "Marks": 25,
            "Guidelines_and_Exhibits": {
              "Evaluation_Guidelines": "Cadre marks calculation",
              "Exhibits_Context_to_be_Observed_Assessed": "Documentary evidence."
            }
          }
        ]
      },
      {
        "Title": "5.4. Visiting/Adjunct Faculty",
        "Marks": 10,
        "Sub-Sub-Criteria": [
          {
            "Title": "5.4. Visiting/Adjunct Faculty",
            "Marks": 10,
            "Guidelines_and_Exhibits": {
              "Evaluation_Guidelines": "Provision of visiting faculty",
              "Exhibits_Context_to_be_Observed_Assessed": "Documentary evidence."
            }
          }
        ]
      },
      {
        "Title": "5.5. Faculty Retention",
        "Marks": 10,
        "Sub-Sub-Criteria": [
          {
            "Title": "5.5. Faculty Retention",
            "Marks": 10,
            "Guidelines_and_Exhibits": {
              "Evaluation_Guidelines": "Retention calculation",
              "Exhibits_Context_to_be_Observed_Assessed": "Documentary evidence."
            }
          }
        ]
      }
    ]
  },
  {
    "Criterion": "Criterion 6: Faculty Contributions",
    "Marks": 120,
    "Sub-Criteria": [
      {
        "Title": "6.1. Professional Development Activities",
        "Marks": 60,
        "Sub-Sub-Criteria": [
          {
            "Title": "6.1.1. Memberships",
            "Marks": 5,
            "Guidelines_and_Exhibits": {
              "Evaluation_Guidelines": "Memberships in Professional Societies",
              "Exhibits_Context_to_be_Observed_Assessed": "Documentary evidence."
            }
          },
          {
            "Title": "6.1.2. Faculty as Resource Persons",
            "Marks": 10,
            "Guidelines_and_Exhibits": {
              "Evaluation_Guidelines": "Served as resource persons",
              "Exhibits_Context_to_be_Observed_Assessed": "Documentary evidence."
            }
          },
          {
            "Title": "6.1.3. Development of SWAYAM",
            "Marks": 7,
            "Guidelines_and_Exhibits": {
              "Evaluation_Guidelines": "Faculty involvement",
              "Exhibits_Context_to_be_Observed_Assessed": "Documentary evidence."
            }
          },
          {
            "Title": "6.1.4. Certification of MOOCs",
            "Marks": 8,
            "Guidelines_and_Exhibits": {
              "Evaluation_Guidelines": "Percentage obtained",
              "Exhibits_Context_to_be_Observed_Assessed": "Documentary evidence."
            }
          },
          {
            "Title": "6.1.5. FDP Organized",
            "Marks": 10,
            "Guidelines_and_Exhibits": {
              "Evaluation_Guidelines": "Duration of FDP",
              "Exhibits_Context_to_be_Observed_Assessed": "Documentary evidence."
            }
          },
          {
            "Title": "6.1.6. Faculty Support",
            "Marks": 10,
            "Guidelines_and_Exhibits": {
              "Evaluation_Guidelines": "Percentage supporting",
              "Exhibits_Context_to_be_Observed_Assessed": "Documentary evidence."
            }
          },
          {
            "Title": "6.1.7. Faculty Internship",
            "Marks": 10,
            "Guidelines_and_Exhibits": {
              "Evaluation_Guidelines": "Percentage undergone",
              "Exhibits_Context_to_be_Observed_Assessed": "Documentary evidence."
            }
          }
        ]
      },
      {
        "Title": "6.2. Research and Development Activities",
        "Marks": 60,
        "Sub-Sub-Criteria": [
          {
            "Title": "6.2.1. Academic Research",
            "Marks": 10,
            "Guidelines_and_Exhibits": {
              "Evaluation_Guidelines": "Publications",
              "Exhibits_Context_to_be_Observed_Assessed": "Documentary evidence."
            }
          },
          {
            "Title": "6.2.2. Ph.D. Student Details",
            "Marks": 5,
            "Guidelines_and_Exhibits": {
              "Evaluation_Guidelines": "Students enrolled",
              "Exhibits_Context_to_be_Observed_Assessed": "Documentary evidence."
            }
          },
          {
            "Title": "6.2.3. Development Activities",
            "Marks": 10,
            "Guidelines_and_Exhibits": {
              "Evaluation_Guidelines": "Patents granted",
              "Exhibits_Context_to_be_Observed_Assessed": "Documentary evidence."
            }
          },
          {
            "Title": "6.2.4. Sponsored Research",
            "Marks": 15,
            "Guidelines_and_Exhibits": {
              "Evaluation_Guidelines": "Amount >20 Lacs",
              "Exhibits_Context_to_be_Observed_Assessed": "Documentary evidence."
            }
          },
          {
            "Title": "6.2.5. Consultancy Work",
            "Marks": 15,
            "Guidelines_and_Exhibits": {
              "Evaluation_Guidelines": "Consultancy amount",
              "Exhibits_Context_to_be_Observed_Assessed": "Documentary evidence."
            }
          },
          {
            "Title": "6.2.6. Institution Seed Money",
            "Marks": 5,
            "Guidelines_and_Exhibits": {
              "Evaluation_Guidelines": "Amount received",
              "Exhibits_Context_to_be_Observed_Assessed": "Documentary evidence."
            }
          }
        ]
      }
    ]
  },
  {
    "Criterion": "Criterion 7: Facilities and Technical Support",
    "Marks": 100,
    "Sub-Criteria": [
      {
        "Title": "7.1. Adequate and Well-Equipped Laboratories",
        "Marks": 40,
        "Sub-Sub-Criteria": [
          {
            "Title": "7.1. Adequate and Well-Equipped Laboratories",
            "Marks": 40,
            "Guidelines_and_Exhibits": {
              "Evaluation_Guidelines": "A. Adequate and well-equipped (15)",
              "Exhibits_Context_to_be_Observed_Assessed": "Documentary evidence."
            }
          }
        ]
      },
      {
        "Title": "7.2. Additional Facilities",
        "Marks": 20,
        "Sub-Sub-Criteria": [
          {
            "Title": "7.2. Additional Facilities",
            "Marks": 20,
            "Guidelines_and_Exhibits": {
              "Evaluation_Guidelines": "Availability of additional facilities",
              "Exhibits_Context_to_be_Observed_Assessed": "Documentary evidence."
            }
          }
        ]
      },
      {
        "Title": "7.3. Maintenance of Laboratories",
        "Marks": 10,
        "Sub-Sub-Criteria": [
          {
            "Title": "7.3. Maintenance of Laboratories",
            "Marks": 10,
            "Guidelines_and_Exhibits": {
              "Evaluation_Guidelines": "Maintenance policy",
              "Exhibits_Context_to_be_Observed_Assessed": "Documentary evidence."
            }
          }
        ]
      },
      {
        "Title": "7.4. Safety Measures",
        "Marks": 10,
        "Sub-Sub-Criteria": [
          {
            "Title": "7.4. Safety Measures",
            "Marks": 10,
            "Guidelines_and_Exhibits": {
              "Evaluation_Guidelines": "Basic safety measures",
              "Exhibits_Context_to_be_Observed_Assessed": "Documentary evidence."
            }
          }
        ]
      },
      {
        "Title": "7.5. Project Laboratory",
        "Marks": 20,
        "Sub-Sub-Criteria": [
          {
            "Title": "7.5. Project Laboratory",
            "Marks": 20,
            "Guidelines_and_Exhibits": {
              "Evaluation_Guidelines": "Availability of project laboratories",
              "Exhibits_Context_to_be_Observed_Assessed": "Documentary evidence."
            }
          }
        ]
      }
    ]
  },
  {
    "Criterion": "Criterion 8: Continuous Improvement",
    "Marks": 80,
    "Sub-Criteria": [
      {
        "Title": "8.1. Actions Taken Based on Results",
        "Marks": 40,
        "Sub-Sub-Criteria": [
          {
            "Title": "8.1.1. Actions Taken COs",
            "Marks": 20,
            "Guidelines_and_Exhibits": {
              "Evaluation_Guidelines": "Identification of gaps",
              "Exhibits_Context_to_be_Observed_Assessed": "Documentary evidence."
            }
          },
          {
            "Title": "8.1.2. Actions Taken POs",
            "Marks": 20,
            "Guidelines_and_Exhibits": {
              "Evaluation_Guidelines": "Identification of gaps",
              "Exhibits_Context_to_be_Observed_Assessed": "Documentary evidence."
            }
          }
        ]
      },
      {
        "Title": "8.2. Academic Audit",
        "Marks": 15,
        "Sub-Sub-Criteria": [
          {
            "Title": "8.2. Academic Audit",
            "Marks": 15,
            "Guidelines_and_Exhibits": {
              "Evaluation_Guidelines": "Availability of external academic audit",
              "Exhibits_Context_to_be_Observed_Assessed": "Documentary evidence."
            }
          }
        ]
      },
      {
        "Title": "8.3. Improvement in Faculty",
        "Marks": 15,
        "Sub-Sub-Criteria": [
          {
            "Title": "8.3. Improvement in Faculty",
            "Marks": 15,
            "Guidelines_and_Exhibits": {
              "Evaluation_Guidelines": "Improvement in the no. faculty",
              "Exhibits_Context_to_be_Observed_Assessed": "Documentary evidence."
            }
          }
        ]
      },
      {
        "Title": "8.4. Improvement in Academic Performance",
        "Marks": 10,
        "Sub-Sub-Criteria": [
          {
            "Title": "8.4. Improvement in Academic Performance",
            "Marks": 10,
            "Guidelines_and_Exhibits": {
              "Evaluation_Guidelines": "API improvement",
              "Exhibits_Context_to_be_Observed_Assessed": "Documentary evidence."
            }
          }
        ]
      }
    ]
  },
  {
    "Criterion": "Criterion 9: Student Support System",
    "Marks": 120,
    "Sub-Criteria": [
      {
        "Title": "9.1. First Year Student-Faculty Ratio",
        "Marks": 5,
        "Sub-Sub-Criteria": [
          {
            "Title": "9.1. First Year Student-Faculty Ratio",
            "Marks": 5,
            "Guidelines_and_Exhibits": {
              "Evaluation_Guidelines": "> 90% of faculty members",
              "Exhibits_Context_to_be_Observed_Assessed": "Documentary evidence."
            }
          }
        ]
      },
      {
        "Title": "9.2. Mentoring System",
        "Marks": 5,
        "Sub-Sub-Criteria": [
          {
            "Title": "9.2. Mentoring System",
            "Marks": 5,
            "Guidelines_and_Exhibits": {
              "Evaluation_Guidelines": "Mentoring system-implementation",
              "Exhibits_Context_to_be_Observed_Assessed": "Documentary evidence."
            }
          }
        ]
      },
      {
        "Title": "9.3. Feedback Analysis",
        "Marks": 10,
        "Sub-Sub-Criteria": [
          {
            "Title": "9.3.1. Feedback on Teaching",
            "Marks": 5,
            "Guidelines_and_Exhibits": {
              "Evaluation_Guidelines": "Feedback questionnaire used",
              "Exhibits_Context_to_be_Observed_Assessed": "Documentary evidence."
            }
          },
          {
            "Title": "9.3.2. Feedback on Facilities",
            "Marks": 5,
            "Guidelines_and_Exhibits": {
              "Evaluation_Guidelines": "Feedback questionnaire used",
              "Exhibits_Context_to_be_Observed_Assessed": "Documentary evidence."
            }
          }
        ]
      },
      {
        "Title": "9.4. Training and Placement Support",
        "Marks": 10,
        "Sub-Sub-Criteria": [
          {
            "Title": "9.4. Training and Placement Support",
            "Marks": 10,
            "Guidelines_and_Exhibits": {
              "Evaluation_Guidelines": "Facilities of training",
              "Exhibits_Context_to_be_Observed_Assessed": "Documentary evidence."
            }
          }
        ]
      },
      {
        "Title": "9.5. Start-up and Entrepreneurship",
        "Marks": 5,
        "Sub-Sub-Criteria": [
          {
            "Title": "9.5. Start-up and Entrepreneurship",
            "Marks": 5,
            "Guidelines_and_Exhibits": {
              "Evaluation_Guidelines": "Availability of entrepreneurship cell",
              "Exhibits_Context_to_be_Observed_Assessed": "Documentary evidence."
            }
          }
        ]
      },
      {
        "Title": "9.6. Governance and Transparency",
        "Marks": 25,
        "Sub-Sub-Criteria": [
          {
            "Title": "9.6.1. Availability of Strategic Plan",
            "Marks": 10,
            "Guidelines_and_Exhibits": {
              "Evaluation_Guidelines": "Availability of strategic plan",
              "Exhibits_Context_to_be_Observed_Assessed": "Documentary evidence."
            }
          },
          {
            "Title": "9.6.2. Governing Body",
            "Marks": 10,
            "Guidelines_and_Exhibits": {
              "Evaluation_Guidelines": "Composition of BoG",
              "Exhibits_Context_to_be_Observed_Assessed": "Documentary evidence."
            }
          },
          {
            "Title": "9.6.3. Transparency",
            "Marks": 5,
            "Guidelines_and_Exhibits": {
              "Evaluation_Guidelines": "Mandatory disclosure",
              "Exhibits_Context_to_be_Observed_Assessed": "Documentary evidence."
            }
          }
        ]
      },
      {
        "Title": "9.7. Budget Allocation",
        "Marks": 12,
        "Sub-Sub-Criteria": [
          {
            "Title": "9.7. Budget Allocation",
            "Marks": 12,
            "Guidelines_and_Exhibits": {
              "Evaluation_Guidelines": "Quantum of budget",
              "Exhibits_Context_to_be_Observed_Assessed": "Documentary evidence."
            }
          }
        ]
      },
      {
        "Title": "9.8. Program Specific Budget",
        "Marks": 8,
        "Sub-Sub-Criteria": [
          {
            "Title": "9.8. Program Specific Budget",
            "Marks": 8,
            "Guidelines_and_Exhibits": {
              "Evaluation_Guidelines": "Quantum of budget allocation",
              "Exhibits_Context_to_be_Observed_Assessed": "Documentary evidence."
            }
          }
        ]
      },
      {
        "Title": "9.9. Quality of Learning Resources",
        "Marks": 5,
        "Sub-Sub-Criteria": [
          {
            "Title": "9.9. Quality of Learning Resources",
            "Marks": 5,
            "Guidelines_and_Exhibits": {
              "Evaluation_Guidelines": "Availability of relevant resources",
              "Exhibits_Context_to_be_Observed_Assessed": "Documentary evidence."
            }
          }
        ]
      },
      {
        "Title": "9.10. E-Governance",
        "Marks": 5,
        "Sub-Sub-Criteria": [
          {
            "Title": "9.10. E-Governance",
            "Marks": 5,
            "Guidelines_and_Exhibits": {
              "Evaluation_Guidelines": "E-governance initiatives",
              "Exhibits_Context_to_be_Observed_Assessed": "Documentary evidence."
            }
          }
        ]
      },
      {
        "Title": "9.11. Initiatives SDGs",
        "Marks": 10,
        "Sub-Sub-Criteria": [
          {
            "Title": "9.11. Initiatives SDGs",
            "Marks": 10,
            "Guidelines_and_Exhibits": {
              "Evaluation_Guidelines": "Policy and implementation",
              "Exhibits_Context_to_be_Observed_Assessed": "Documentary evidence."
            }
          }
        ]
      },
      {
        "Title": "9.12. Innovative Educational Initiatives",
        "Marks": 5,
        "Sub-Sub-Criteria": [
          {
            "Title": "9.12. Innovative Educational Initiatives",
            "Marks": 5,
            "Guidelines_and_Exhibits": {
              "Evaluation_Guidelines": "Initiatives taken",
              "Exhibits_Context_to_be_Observed_Assessed": "Documentary evidence."
            }
          }
        ]
      },
      {
        "Title": "9.13. Faculty Performance Appraisal",
        "Marks": 10,
        "Sub-Sub-Criteria": [
          {
            "Title": "9.13. Faculty Performance Appraisal",
            "Marks": 10,
            "Guidelines_and_Exhibits": {
              "Evaluation_Guidelines": "Performance appraisal",
              "Exhibits_Context_to_be_Observed_Assessed": "Documentary evidence."
            }
          }
        ]
      },
      {
        "Title": "9.14. Outreach Activities",
        "Marks": 5,
        "Sub-Sub-Criteria": [
          {
            "Title": "9.14. Outreach Activities",
            "Marks": 5,
            "Guidelines_and_Exhibits": {
              "Evaluation_Guidelines": "Initiatives taken towards outreach",
              "Exhibits_Context_to_be_Observed_Assessed": "Documentary evidence."
            }
          }
        ]
      }
    ]
  }
];

function generateUniqueIds(criteria) {
  return criteria.map((criterion, cIdx) => {
    const cId = `c${cIdx + 1}`;
    
    return {
      id: cId,
      Criterion: criterion.Criterion,
      Marks: criterion.Marks,
      "Sub-Criteria": criterion["Sub-Criteria"].map((sub, sIdx) => {
        const sId = `${cId}-s${sIdx + 1}`;
        
        return {
          id: sId,
          Title: sub.Title,
          Marks: sub.Marks,
          "Sub-Sub-Criteria": sub["Sub-Sub-Criteria"]?.map((ss, ssIdx) => {
            const ssId = `${sId}-ss${ssIdx + 1}`;
            
            return {
              id: ssId,
              Title: ss.Title,
              Marks: ss.Marks,
              Guidelines_and_Exhibits: ss.Guidelines_and_Exhibits
            };
          }) || []
        };
      })
    };
  });
}

const outputPath = path.join(__dirname, '../src/data/guidelines.json');
fs.writeFileSync(outputPath, JSON.stringify(generateUniqueIds(data), null, 2));
console.log("Written full JSON to " + outputPath);
