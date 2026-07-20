const fs = require('fs');
const path = require('path');

const topicsData = {
  "General": [
    "Reading books every day improves focus and expands your vocabulary.",
    "Effective time management is a crucial skill for personal and professional success.",
    "Critical thinking involves the objective analysis and evaluation of an issue.",
    "Drinking enough water is essential for maintaining good health and high energy levels.",
    "A balanced diet rich in vegetables and fruits supports a strong immune system.",
    "Regular physical exercise helps reduce stress and improves cardiovascular health.",
    "Learning a new language can enhance cognitive flexibility and delay the onset of dementia.",
    "Taking short breaks during work can significantly increase overall productivity.",
    "Meditation and mindfulness practices are proven to reduce anxiety and promote emotional well-being.",
    "Sleep is vital for memory consolidation and physical recovery after a long day.",
    "Setting clear, achievable goals is the first step toward long-term success.",
    "Reading diverse viewpoints fosters empathy and broadens your understanding of the world."
  ],
  "Indian Geography": [
    "India is the seventh-largest country by total area in the world.",
    "It is bounded by the Indian Ocean on the south, the Arabian Sea on the southwest, and the Bay of Bengal on the southeast.",
    "The Himalayas, the world's highest mountain range, form the northern border of the country.",
    "The Ganges is the longest river in India and is considered holy by millions.",
    "The Thar Desert, also known as the Great Indian Desert, forms a natural boundary between India and Pakistan.",
    "The Deccan Plateau makes up the majority of the southern part of the country.",
    "Kanchenjunga is the highest mountain peak situated entirely within India.",
    "The Western Ghats are a biodiversity hotspot recognized by UNESCO.",
    "Chilika Lake in Odisha is the largest coastal lagoon in India and the second largest in the world.",
    "Majuli in Assam is the largest river island in the world, located in the Brahmaputra River."
  ],
  "World Geography": [
    "The Pacific Ocean is the largest and deepest of Earth's oceanic divisions.",
    "Mount Everest, located in the Himalayas, is the Earth's highest mountain above sea level.",
    "The Amazon River is considered the largest river by discharge volume of water in the world.",
    "Russia is the largest country in the world by surface area, spanning Eastern Europe and Northern Asia.",
    "The Sahara is the largest hot desert in the world, covering much of North Africa.",
    "Greenland is the world's largest island that is not a continent.",
    "The Nile River is traditionally considered the longest river in the world.",
    "The Andes is the longest continental mountain range in the world, located in South America.",
    "Lake Baikal in Russia is the deepest and oldest freshwater lake in the world.",
    "The Great Barrier Reef in Australia is the world's largest coral reef system."
  ],
  "Indian History": [
    "The Indus Valley Civilization was one of the world's earliest major urban settlements.",
    "Emperor Ashoka ruled the Maurya Empire and promoted the spread of Buddhism across ancient Asia.",
    "The Gupta Empire is often described as the Golden Age of India due to extensive inventions and discoveries.",
    "The Mughal Empire, established in 1526, brought significant changes to Indian architecture and administration.",
    "The Indian Rebellion of 1857 was a major uprising against the rule of the British East India Company.",
    "Mahatma Gandhi led the non-violent freedom movement that eventually resulted in India's independence in 1947.",
    "The Indian National Congress, founded in 1885, was the first modern nationalist movement to emerge in the British Empire.",
    "The partition of India in 1947 led to the creation of two independent dominions, India and Pakistan.",
    "Dr. B.R. Ambedkar was the principal architect of the Constitution of India.",
    "The Chola Dynasty was one of the longest-ruling dynasties in the history of southern India."
  ],
  "Indian Polity": [
    "The Constitution of India is the longest written national constitution in the world.",
    "It was adopted by the Constituent Assembly on November 26, 1949, and came into effect on January 26, 1950.",
    "India is a Sovereign, Socialist, Secular, Democratic Republic with a parliamentary system of government.",
    "The President of India is the ceremonial head of state and the supreme commander of the armed forces.",
    "The Prime Minister of India is the head of government and exercises most executive power.",
    "The Parliament of India is bicameral, consisting of the Rajya Sabha and the Lok Sabha.",
    "The Supreme Court of India is the highest judicial forum and final court of appeal under the Constitution.",
    "Fundamental Rights guarantee civil liberties such that all Indians can lead their lives in peace as citizens of India.",
    "The Directive Principles of State Policy are guidelines for the framing of laws by the government.",
    "Panchayati Raj is the system of local self-government of villages in rural India."
  ],
  "Indian Economy": [
    "The Indian economy is characterized as a middle income developing market economy.",
    "It is the world's fifth-largest economy by nominal GDP and the third-largest by purchasing power parity.",
    "The service sector accounts for more than half of India's GDP and remains the fastest growing sector.",
    "Agriculture employs a significant portion of the Indian workforce despite its declining share in the GDP.",
    "The Reserve Bank of India, established in 1935, is India's central bank and regulatory body.",
    "The introduction of the Goods and Services Tax (GST) in 2017 was a major reform in India's indirect tax structure.",
    "Information technology and business process outsourcing are among the fastest-growing industries in India.",
    "Foreign direct investment has been a crucial driver of economic growth and modernization in India.",
    "The green revolution in India led to an increase in agricultural production, especially in Haryana and Punjab.",
    "Economic liberalization in 1991 transformed India into a rapidly growing market-based economy."
  ],
  "Science": [
    "DNA, or deoxyribonucleic acid, is the hereditary material in humans and almost all other organisms.",
    "Photosynthesis is the process by which green plants and some other organisms use sunlight to synthesize nutrients from carbon dioxide and water.",
    "Gravity is a natural phenomenon by which all things with mass or energy are brought toward one another.",
    "The periodic table organizes all discovered chemical elements in rows and columns according to increasing atomic number.",
    "Mitochondria are often referred to as the powerhouses of the cell because they generate most of the cell's supply of adenosine triphosphate.",
    "Newton's laws of motion laid the foundation for classical mechanics, describing the relationship between a body and the forces acting upon it.",
    "Evolution by natural selection, formulated by Charles Darwin, is a key mechanism of biological evolution.",
    "The speed of light in a vacuum is exactly 299,792,458 metres per second, a fundamental constant of nature.",
    "Vaccines train the immune system to recognize and combat pathogens, preventing severe infectious diseases.",
    "Quantum mechanics is a fundamental theory in physics that provides a description of the physical properties of nature at the scale of atoms and subatomic particles."
  ],
  "Environment": [
    "Climate change refers to long-term shifts in temperatures and weather patterns, largely driven by human activities.",
    "Deforestation, the clearing of forests, contributes significantly to global greenhouse gas emissions.",
    "Biodiversity encompasses the variety and variability of life on Earth, crucial for resilient ecosystems.",
    "Ozone layer depletion was a major environmental concern until the Montreal Protocol phased out ozone-depleting substances.",
    "Renewable energy sources, such as solar and wind power, are essential for reducing reliance on fossil fuels.",
    "Plastic pollution in oceans poses a severe threat to marine life and ecosystems globally.",
    "Wetlands act as natural water purifiers and provide critical habitats for many species of birds and fish.",
    "Sustainable agriculture aims to meet society's present food needs without compromising the ability of future generations to meet their own needs.",
    "Air pollution, caused by industrial emissions and vehicle exhaust, is a leading environmental health risk.",
    "Conservation biology is the scientific study of nature and of Earth's biodiversity with the aim of protecting species and their habitats."
  ],
  "Computer Awareness": [
    "A Central Processing Unit (CPU) is the electronic circuitry that executes instructions comprising a computer program.",
    "Random Access Memory (RAM) is a form of computer memory that can be read and changed in any order, typically used to store working data.",
    "An operating system is system software that manages computer hardware, software resources, and provides common services for computer programs.",
    "A computer network is a set of computers sharing resources located on or provided by network nodes.",
    "The Internet is the global system of interconnected computer networks that uses the Internet protocol suite to communicate between networks and devices.",
    "A database is an organized collection of data, generally stored and accessed electronically from a computer system.",
    "HTML (HyperText Markup Language) is the standard markup language for documents designed to be displayed in a web browser.",
    "Cybersecurity is the practice of protecting systems, networks, and programs from digital attacks.",
    "Cloud computing is the on-demand availability of computer system resources, especially data storage and computing power, without direct active management by the user.",
    "Open-source software is computer software that is released under a license in which the copyright holder grants users the rights to use, study, change, and distribute the software."
  ],
  "Technology": [
    "The smartphone revolutionized communication by combining a mobile phone with a computer, camera, and internet access.",
    "Blockchain is a decentralized, distributed, and often public, digital ledger consisting of records called blocks that are used to record transactions.",
    "5G is the fifth generation technology standard for broadband cellular networks, offering faster speeds and lower latency.",
    "The Internet of Things (IoT) describes the network of physical objects embedded with sensors, software, and other technologies for the purpose of connecting and exchanging data.",
    "Augmented reality (AR) is an interactive experience of a real-world environment where the objects that reside in the real world are enhanced by computer-generated perceptual information.",
    "Virtual reality (VR) is a simulated experience that can be similar to or completely different from the real world.",
    "3D printing is the construction of a three-dimensional object from a CAD model or a digital 3D model.",
    "Autonomous vehicles, or self-driving cars, are capable of sensing their environment and moving safely with little or no human input.",
    "CRISPR is a family of DNA sequences found in the genomes of prokaryotic organisms, used as a powerful tool for editing genomes.",
    "Quantum computing is a rapidly-emerging technology that harnesses the laws of quantum mechanics to solve problems too complex for classical computers."
  ],
  "Artificial Intelligence": [
    "Artificial intelligence (AI) is intelligence demonstrated by machines, as opposed to the natural intelligence displayed by animals including humans.",
    "Machine learning is a subset of AI that involves training algorithms to learn patterns and make predictions from data.",
    "Neural networks are computing systems vaguely inspired by the biological neural networks that constitute animal brains.",
    "Natural language processing (NLP) is a subfield of linguistics, computer science, and AI concerned with the interactions between computers and human language.",
    "Computer vision is an interdisciplinary scientific field that deals with how computers can gain high-level understanding from digital images or videos.",
    "Deep learning is part of a broader family of machine learning methods based on artificial neural networks with representation learning.",
    "Generative AI refers to algorithms that can be used to create new content, including audio, code, images, text, simulations, and videos.",
    "Reinforcement learning is an area of machine learning concerned with how intelligent agents ought to take actions in an environment in order to maximize the notion of cumulative reward.",
    "Expert systems are computer systems that emulate the decision-making ability of a human expert.",
    "Turing test, developed by Alan Turing, is a test of a machine's ability to exhibit intelligent behavior equivalent to, or indistinguishable from, that of a human."
  ],
  "Literature": [
    "William Shakespeare is widely regarded as the greatest writer in the English language and the world's pre-eminent dramatist.",
    "The Iliad and the Odyssey are two of the major ancient Greek epic poems attributed to Homer.",
    "Don Quixote by Miguel de Cervantes is often considered the first modern European novel and a foundational work of Western literature.",
    "Pride and Prejudice by Jane Austen is a classic novel that critiques the British landed gentry at the end of the 18th century.",
    "1984 by George Orwell is a dystopian social science fiction novel and cautionary tale about the dangers of totalitarianism.",
    "To Kill a Mockingbird by Harper Lee is a novel renowned for its warmth and humor, despite dealing with serious issues of rape and racial inequality.",
    "One Hundred Years of Solitude by Gabriel García Márquez is a landmark work of magical realism.",
    "The Great Gatsby by F. Scott Fitzgerald is often described as the quintessential novel of the Jazz Age.",
    "Mahabharata is one of the two major Sanskrit epics of ancient India, the other being the Ramayana.",
    "Rabindranath Tagore was a Bengali polymath who reshaped Bengali literature and music, and became the first non-European to win the Nobel Prize in Literature in 1913."
  ],
  "Space": [
    "The Milky Way is the galaxy that contains our Solar System, with the name describing the galaxy's appearance from Earth.",
    "The Sun is the star at the center of the Solar System, and is by far the most important source of energy for life on Earth.",
    "Jupiter is the largest planet in the Solar System, a gas giant with a mass more than two and a half times that of all the other planets combined.",
    "A black hole is a region of spacetime where gravity is so strong that nothing, no particles or even electromagnetic radiation such as light, can escape from it.",
    "The Apollo 11 mission in 1969 was the first spaceflight that landed humans on the Moon.",
    "The Hubble Space Telescope is a space telescope that was launched into low Earth orbit in 1990 and remains in operation.",
    "Mars is the fourth planet from the Sun and the second-smallest planet in the Solar System, often referred to as the Red Planet.",
    "An exoplanet is a planet outside the Solar System, with thousands discovered since the first confirmed detection in 1992.",
    "The International Space Station (ISS) is a modular space station in low Earth orbit, serving as a microgravity and space environment research laboratory.",
    "A supernova is a powerful and luminous stellar explosion, occurring during the last evolutionary stages of a massive star."
  ],
  "Sports": [
    "The Olympic Games are considered the world's foremost sports competition with more than 200 nations participating.",
    "Football, or soccer, is the world's most popular sport in terms of fans and participation.",
    "Cricket is a bat-and-ball game played between two teams of eleven players, enormously popular in India, Australia, and England.",
    "Tennis is a racket sport that can be played individually against a single opponent or between two teams of two players each.",
    "Basketball was invented in 1891 by Dr. James Naismith in Springfield, Massachusetts, and has grown into a global sport.",
    "The FIFA World Cup is an international association football competition contested by the senior men's national teams of the members of FIFA.",
    "Athletics is a collection of sporting events that involve competitive running, jumping, throwing, and walking.",
    "Swimming is an individual or team racing sport that requires the use of one's entire body to move through water.",
    "Chess is a recreational and competitive board game played between two players on a checkered board.",
    "The Tour de France is an annual men's multiple-stage bicycle race primarily held in France, considered the most prestigious cycling race."
  ]
};

const timers = [15, 30, 60, 90, 120];
const difficulties = ["easy", "medium", "hard"];

function slugify(text) {
  return text.toLowerCase().replace(/\s+/g, '_');
}

// Generate text from facts matching the target word count
function generateText(topic, targetWordCount) {
  const facts = topicsData[topic] || topicsData["General"];
  let text = "";
  let currentWords = 0;
  
  // Shuffle facts array
  const shuffledFacts = [...facts].sort(() => 0.5 - Math.random());
  let factIndex = 0;
  
  while (currentWords < targetWordCount) {
    if (factIndex >= shuffledFacts.length) factIndex = 0; // wrap around if needed
    const fact = shuffledFacts[factIndex];
    text += fact + " ";
    currentWords += fact.split(' ').length;
    factIndex++;
  }
  
  return text.trim();
}

const dir = path.join(__dirname, 'src', 'data', 'learning', 'en');
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

Object.keys(topicsData).forEach(topic => {
  const items = [];
  
  difficulties.forEach(diff => {
    timers.forEach(timer => {
      // Calculate target word count based on timer and difficulty
      // Average typing speeds: easy (30 wpm), medium (50 wpm), hard (70 wpm)
      let wpm = 50;
      if (diff === 'easy') wpm = 30;
      if (diff === 'hard') wpm = 70;
      
      const targetWordCount = Math.ceil((wpm / 60) * timer);
      
      const generatedText = generateText(topic, targetWordCount);
      const actualWordCount = generatedText.split(' ').length;
      
      items.push({
        id: `${slugify(topic)}_${diff}_${timer}_01`,
        topic: topic,
        difficulty: diff,
        suitableTimers: [timer],
        estimatedWords: actualWordCount,
        title: `Concepts in ${topic}`,
        text: generatedText,
        keywords: [slugify(topic), diff, "study"]
      });
    });
  });

  const content = {
    topic: topic,
    items: items
  };

  fs.writeFileSync(path.join(dir, `${slugify(topic)}.json`), JSON.stringify(content, null, 2));
});

console.log("Fact-based educational content generated successfully!");
