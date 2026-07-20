export type ExamCategory = "SSC" | "RRB" | "Andaman Administration";

export interface ExamDetail {
  id: string;
  organization: ExamCategory;
  name: string;
  about: string;
  postsCovered: string[];
  speedRequirement: number; // WPM
  duration: number; // Minutes
  language: string;
  pattern: string;
  passingCriteria: string;
  permissibleErrors: number; // Percentage
  preparationTips: string[];
  minimumAccuracy: number;
  instructions: string[];
  typingRules: string[];
}

export const examProfiles: ExamDetail[] = [
  // SSC
  {
    id: "ssc_cgl_dest",
    organization: "SSC",
    name: "SSC CGL DEST",
    about: "The Data Entry Speed Test (DEST) is a qualifying typing test conducted by the Staff Selection Commission as part of the Combined Graduate Level (CGL) examination. It assesses the candidate's data entry speed and accuracy, which is crucial for specific posts.",
    postsCovered: ["Tax Assistant (Central Excise & Income Tax)", "Other specific posts requiring DEST"],
    speedRequirement: 27,
    duration: 15,
    language: "English",
    pattern: "Candidates are required to type an English passage of approximately 2000 key depressions in 15 minutes on a computer.",
    passingCriteria: "UR: 5% permissible errors, OBC/EWS/SC/ST/PwD/ESM: 7% permissible errors.",
    permissibleErrors: 5,
    minimumAccuracy: 95,
    preparationTips: [
      "Practice continuously for 15-minute intervals to build stamina.",
      "Focus intensely on accuracy first; speed naturally follows.",
      "Get accustomed to typing administrative and governmental texts."
    ],
    instructions: [
      "Read all instructions carefully.",
      "The timer begins after clicking Start Exam.",
      "Your performance will be shown after submission.",
      "Do not refresh the page."
    ],
    typingRules: [
      "Accuracy is highly important.",
      "Backspace is allowed during the typing test.",
      "Internet interruption may end the test prematurely."
    ]
  },
  {
    id: "ssc_chsl_typing",
    organization: "SSC",
    name: "SSC CHSL Typing Test",
    about: "The Typing Test is a mandatory qualifying skill test for candidates who have cleared the initial tiers of the Combined Higher Secondary Level (CHSL) examination.",
    postsCovered: ["Lower Division Clerk (LDC)", "Junior Secretariat Assistant (JSA)", "Postal Assistant (PA)", "Sorting Assistant (SA)"],
    speedRequirement: 35,
    duration: 10,
    language: "English / Hindi",
    pattern: "English: 35 WPM (10,500 KDPH). Hindi: 30 WPM (9000 KDPH). Duration is 10 minutes (15 minutes for visually handicapped candidates).",
    passingCriteria: "UR: 7% permissible errors, Reserved Categories: 10% permissible errors.",
    permissibleErrors: 7,
    minimumAccuracy: 93,
    preparationTips: [
      "Practice touch typing without looking at the keyboard.",
      "Simulate the actual test environment with a 10-minute timer.",
      "Familiarize yourself with special characters and capitalization commonly used in official documents."
    ],
    instructions: [
      "Read all instructions carefully.",
      "The timer begins after clicking Start Exam.",
      "Your performance will be shown after submission.",
      "Do not refresh the page."
    ],
    typingRules: [
      "Accuracy is highly important.",
      "Backspace is allowed during the typing test.",
      "Internet interruption may end the test prematurely."
    ]
  },
  {
    id: "ssc_mts_typing",
    organization: "SSC",
    name: "SSC MTS (Typing Posts)",
    about: "While SSC Multi-Tasking Staff (MTS) is generally a non-typing exam, certain specific departments and roles under the MTS recruitment drive sometimes require a typing proficiency test.",
    postsCovered: ["Specific MTS roles that mandate typing skills"],
    speedRequirement: 30, // typically if required
    duration: 10,
    language: "English / Hindi",
    pattern: "Typing test (if applicable) is qualifying in nature.",
    passingCriteria: "Typically similar to CHSL (7-10% permissible errors). Official notification must be verified.",
    permissibleErrors: 7,
    minimumAccuracy: 93,
    preparationTips: [
      "Master the home row keys and maintain proper posture.",
      "Focus on reducing backspace usage to maintain rhythm."
    ],
    instructions: [
      "Read all instructions carefully.",
      "The timer begins after clicking Start Exam.",
      "Your performance will be shown after submission.",
      "Do not refresh the page."
    ],
    typingRules: [
      "Accuracy is highly important.",
      "Backspace is allowed during the typing test.",
      "Internet interruption may end the test prematurely."
    ]
  },

  // RRB
  {
    id: "rrb_junior_clerk",
    organization: "RRB",
    name: "RRB Junior Clerk cum Typist",
    about: "The RRB Typing Skill Test (TST) is a qualifying exam for the Junior Clerk cum Typist post. Candidates must pass this stage without the aid of spell check or editing tools.",
    postsCovered: ["Junior Clerk cum Typist"],
    speedRequirement: 30,
    duration: 10,
    language: "English / Hindi",
    pattern: "Candidates must type 30 WPM in English or 25 WPM in Hindi on a personal computer. Editing tools and spell check facilities are disabled.",
    passingCriteria: "Qualifying nature. 5% mistakes are ignored. Above 5%, 10 words are deducted from the total words typed for every mistake.",
    permissibleErrors: 5,
    minimumAccuracy: 95,
    preparationTips: [
      "Practice strictly without using the backspace key if possible, or minimize its use, as some Railway exams disable it.",
      "Ensure steady, consistent typing rather than bursts of speed.",
      "Read ahead in the text to avoid pausing."
    ],
    instructions: [
      "Read all instructions carefully.",
      "The timer begins after clicking Start Exam.",
      "Your performance will be shown after submission.",
      "Do not refresh the page."
    ],
    typingRules: [
      "Editing tools and spell check facilities are disabled.",
      "5% mistakes are exempt; penalty formula applies for errors above 5%.",
      "Backspace functionality may be disabled depending on the exact RRB zone."
    ]
  },
  {
    id: "rrb_accounts_clerk",
    organization: "RRB",
    name: "RRB Accounts Clerk cum Typist",
    about: "This typing test is identical in format to the Junior Clerk test, specifically aimed at candidates applying for the Accounts Clerk cum Typist role in Indian Railways.",
    postsCovered: ["Accounts Clerk cum Typist"],
    speedRequirement: 30,
    duration: 10,
    language: "English / Hindi",
    pattern: "30 WPM in English or 25 WPM in Hindi. Spell check and editing tools are disabled.",
    passingCriteria: "Qualifying in nature. 5% mistakes are exempt; penalty formula applies for errors above 5%.",
    permissibleErrors: 5,
    minimumAccuracy: 95,
    preparationTips: [
      "Practice with passages containing numbers, dates, and accounting terms.",
      "Maintain a rhythm of 150-175 keystrokes per minute.",
      "Do not panic if you make an error; move on immediately."
    ],
    instructions: [
      "Read all instructions carefully.",
      "The timer begins after clicking Start Exam.",
      "Your performance will be shown after submission.",
      "Do not refresh the page."
    ],
    typingRules: [
      "Editing tools and spell check facilities are disabled.",
      "5% mistakes are exempt; penalty formula applies for errors above 5%.",
      "Backspace functionality may be disabled depending on the exact RRB zone."
    ]
  },
  {
    id: "rrb_time_keeper",
    organization: "RRB",
    name: "RRB Junior Time Keeper",
    about: "The typing skill test for Junior Time Keeper evaluates the typing proficiency necessary for maintaining records and time-keeping in railway operations.",
    postsCovered: ["Junior Time Keeper"],
    speedRequirement: 30,
    duration: 10,
    language: "English / Hindi",
    pattern: "30 WPM in English or 25 WPM in Hindi on a computer without editing tools.",
    passingCriteria: "Qualifying in nature with standard RRB typing test penalty rules (5% exemption).",
    permissibleErrors: 5,
    minimumAccuracy: 95,
    preparationTips: [
      "Focus on accuracy over extreme speed.",
      "Familiarize yourself with the exact penalty calculation (1 mistake = 10 words deducted) to understand the importance of accuracy."
    ],
    instructions: [
      "Read all instructions carefully.",
      "The timer begins after clicking Start Exam.",
      "Your performance will be shown after submission.",
      "Do not refresh the page."
    ],
    typingRules: [
      "Editing tools and spell check facilities are disabled.",
      "5% mistakes are exempt; penalty formula applies for errors above 5%.",
      "Backspace functionality may be disabled depending on the exact RRB zone."
    ]
  },

  // Andaman Administration
  {
    id: "andaman_chsl_typing",
    organization: "Andaman Administration",
    name: "Andaman CHSL Typing Posts",
    about: "The Andaman & Nicobar Administration conducts typing tests for various clerical posts recruited through their Combined Higher Secondary Level examination.",
    postsCovered: ["Lower Division Clerk (LDC)", "Other Group C clerical posts"],
    speedRequirement: 35,
    duration: 10,
    language: "English / Hindi",
    pattern: "35 WPM in English or 30 WPM in Hindi on Computer (35 WPM corresponds to 10500 KDPH).",
    passingCriteria: "Qualifying nature as per standard government norms.",
    permissibleErrors: 5,
    minimumAccuracy: 95,
    preparationTips: [
      "Practice typing official letters, notifications, and administrative jargon.",
      "Maintain strict concentration for the full 10 minutes."
    ],
    instructions: [
      "Read all instructions carefully.",
      "The timer begins after clicking Start Exam.",
      "Your performance will be shown after submission.",
      "Do not refresh the page."
    ],
    typingRules: [
      "Accuracy is highly important.",
      "Backspace is allowed during the typing test.",
      "Internet interruption may end the test prematurely."
    ]
  },
  {
    id: "andaman_matric_typing",
    organization: "Andaman Administration",
    name: "Common Matriculation Level Typing",
    about: "Typing test for posts recruited under the Common Matriculation Level exams of the A&N Administration that require basic computer operation and typing skills.",
    postsCovered: ["Various Matriculation level clerical/record-keeping posts"],
    speedRequirement: 30,
    duration: 10,
    language: "English",
    pattern: "Usually 30 WPM in English on Computer.",
    passingCriteria: "Qualifying nature.",
    permissibleErrors: 5,
    minimumAccuracy: 95,
    preparationTips: [
      "Focus on building a solid foundation of touch typing.",
      "Practice daily for at least 30 minutes.",
      "Ensure high accuracy (above 95%) during practice sessions."
    ],
    instructions: [
      "Read all instructions carefully.",
      "The timer begins after clicking Start Exam.",
      "Your performance will be shown after submission.",
      "Do not refresh the page."
    ],
    typingRules: [
      "Accuracy is highly important.",
      "Backspace is allowed during the typing test.",
      "Internet interruption may end the test prematurely."
    ]
  }
];
