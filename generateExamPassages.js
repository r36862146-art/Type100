const fs = require('fs');
const path = require('path');

const examProfiles = [
  { id: "ssc_cgl_dest", speedRequirement: 27, duration: 15 },
  { id: "ssc_chsl_typing", speedRequirement: 35, duration: 10 },
  { id: "ssc_mts_typing", speedRequirement: 30, duration: 10 },
  { id: "rrb_junior_clerk", speedRequirement: 30, duration: 10 },
  { id: "rrb_accounts_clerk", speedRequirement: 30, duration: 10 },
  { id: "rrb_time_keeper", speedRequirement: 30, duration: 10 },
  { id: "andaman_chsl_typing", speedRequirement: 35, duration: 10 },
  { id: "andaman_matric_typing", speedRequirement: 30, duration: 10 }
];

const setIds = ["1", "2", "3"];

const vocabulary = {
  administrative: [
    "department", "commission", "secretary", "administrative", "government",
    "regulation", "compliance", "authority", "official", "notification",
    "circular", "memorandum", "committee", "development", "infrastructure",
    "implementation", "provision", "document", "resolution", "framework",
    "policy", "assessment", "evaluation", "procedure", "guidelines",
    "amendment", "jurisdiction", "allocation", "expenditure", "revenue"
  ],
  filler: [
    "the", "of", "and", "in", "to", "a", "is", "for", "with", "as", "by", "on", 
    "this", "be", "which", "are", "from", "has", "that", "it", "an", "was",
    "will", "have", "not", "but", "their", "all", "can", "should", "must"
  ]
};

const hardModifiers = [
  "(1)", "(a)", "(i)", "[Note]", "1998", "2023", "Sec.", "No.", "Vol.", "e.g.,",
  "Rs. 50,000/-", "10%", "F.No. 12/34/2021-Estt.", "viz.", "etc.", "&", "w.e.f."
];

function generateSentence(isMock) {
  let sentenceLength = Math.floor(Math.random() * 10) + 10; // 10 to 20 words
  let words = [];
  
  for (let i = 0; i < sentenceLength; i++) {
    if (Math.random() > 0.4) {
      words.push(vocabulary.filler[Math.floor(Math.random() * vocabulary.filler.length)]);
    } else {
      words.push(vocabulary.administrative[Math.floor(Math.random() * vocabulary.administrative.length)]);
    }
  }

  // Capitalize first word
  words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
  
  // Occasional comma
  if (Math.random() > 0.5) {
    let commaIndex = Math.floor(words.length / 2);
    words[commaIndex] = words[commaIndex] + ",";
  }

  // If mock test, randomly inject hard modifiers to mimic real exam papers
  if (isMock) {
    let numModifiers = Math.floor(Math.random() * 3) + 1;
    for (let i = 0; i < numModifiers; i++) {
      let insertIndex = Math.floor(Math.random() * (words.length - 1)) + 1;
      let modifier = hardModifiers[Math.floor(Math.random() * hardModifiers.length)];
      words.splice(insertIndex, 0, modifier);
    }
  }

  return words.join(" ") + ".";
}

function generatePassage(wordCount, isMock) {
  let passage = "";
  let currentWords = 0;

  while (currentWords < wordCount) {
    let sentence = generateSentence(isMock);
    passage += sentence + " ";
    currentWords += sentence.split(" ").length;
  }

  return passage.trim();
}

function processExamDatasets() {
  const targetDir = path.join(__dirname, 'src', 'data', 'exam_passages');
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  examProfiles.forEach(exam => {
    // Add a 10% buffer so the user doesn't run out of text
    const requiredWords = Math.ceil(exam.speedRequirement * exam.duration * 1.1);
    const items = [];

    // Generate 3 Practice Sets
    setIds.forEach(setId => {
      const text = generatePassage(requiredWords, false);
      items.push({
        id: `${exam.id}_practice_${setId}`,
        examId: exam.id,
        examType: "practice",
        examSetId: setId,
        duration: exam.duration,
        targetSpeed: exam.speedRequirement,
        title: `Practice Set ${setId}`,
        text: text
      });
    });

    // Generate 3 Mock Tests
    setIds.forEach(setId => {
      const text = generatePassage(requiredWords, true);
      items.push({
        id: `${exam.id}_mock_${setId}`,
        examId: exam.id,
        examType: "mock",
        examSetId: setId,
        duration: exam.duration,
        targetSpeed: exam.speedRequirement,
        title: `Official Mock Test ${setId}`,
        text: text
      });
    });

    const content = {
      examId: exam.id,
      items: items
    };

    fs.writeFileSync(path.join(targetDir, `${exam.id}.json`), JSON.stringify(content, null, 2));
  });
}

processExamDatasets();
console.log("Exam practice and mock sets generated successfully.");
