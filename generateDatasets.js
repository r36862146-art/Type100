const fs = require('fs');
const path = require('path');

const learningTopicsData = {
  "General": [
    "Reading books every day improves focus and expands your vocabulary immensely.",
    "Effective time management is a crucial skill for personal and professional success.",
    "Critical thinking involves the objective analysis and evaluation of a complex issue.",
    "Drinking enough water is essential for maintaining good health and high energy levels.",
    "A balanced diet rich in vegetables and fruits supports a strong immune system.",
    "Regular physical exercise helps reduce stress and improves cardiovascular health.",
    "Learning a new language can enhance cognitive flexibility and delay the onset of dementia.",
    "Taking short breaks during work can significantly increase overall productivity.",
    "Meditation and mindfulness practices are proven to reduce anxiety and promote emotional well-being.",
    "Sleep is vital for memory consolidation and physical recovery after a long day.",
    "Setting clear, achievable goals is the first step toward long-term success.",
    "Reading diverse viewpoints fosters empathy and broadens your understanding of the world.",
    "Consistency in small daily habits often leads to massive improvements over time.",
    "Financial literacy is the foundation for a secure and prosperous adult life.",
    "Volunteering for a community cause can significantly boost your overall happiness and purpose.",
    "Active listening is the most underrated but essential component of effective communication.",
    "Continuous learning throughout life is required to adapt to a rapidly changing world.",
    "Staying hydrated improves cognitive function, memory recall, and overall brain performance.",
    "Journaling daily can help clarify thoughts and reduce mental clutter.",
    "Empathy is a vital leadership trait that fosters trust and collaboration in teams."
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
    "The Chola Dynasty was one of the longest-ruling dynasties in the history of southern India.",
    "Chandragupta Maurya founded the Maurya Empire by overthrowing the Nanda Dynasty.",
    "The Battle of Plassey in 1757 established company rule in Bengal.",
    "Shivaji established the Maratha Empire, which became the dominant power in 18th-century India.",
    "The Vijayanagara Empire successfully resisted Islamic invasions in South India for over two centuries.",
    "Rani Lakshmibai of Jhansi became a symbol of resistance during the Indian Rebellion of 1857.",
    "The Quit India Movement was a civil disobedience movement launched by Gandhi in 1942.",
    "The Harappan civilization is known for its impressive urban planning and drainage systems.",
    "Akbar the Great is remembered for his policies of religious tolerance and centralized administration.",
    "The Jallianwala Bagh massacre of 1919 deeply shocked the nation and catalyzed the freedom struggle.",
    "The Swadeshi movement encouraged the boycott of British goods to promote Indian industries."
  ],
  "World History": [
    "The Egyptian civilization flourished along the Nile River and built the monumental pyramids.",
    "The Roman Empire at its peak controlled the entire Mediterranean basin and most of Western Europe.",
    "The Renaissance was a period of European cultural, artistic, political, and economic rebirth following the Middle Ages.",
    "The Industrial Revolution marked a major turning point in history, transitioning from hand production to machines.",
    "World War I, which began in 1914, resulted in the collapse of several major empires including the Ottoman and Austro-Hungarian.",
    "The French Revolution of 1789 profoundly altered the course of modern history, triggering the global decline of absolute monarchies.",
    "The Cold War was a period of geopolitical tension between the Soviet Union and the United States.",
    "The discovery of the Americas by Christopher Columbus in 1492 initiated widespread global exchange and colonization.",
    "The fall of the Berlin Wall in 1989 symbolized the end of the Cold War and led to the reunification of Germany.",
    "The Magna Carta, signed in 1215, established the principle that everyone is subject to the law, even the king.",
    "The ancient Greek city-states laid the foundations for Western philosophy, science, and democracy.",
    "The Mongol Empire, founded by Genghis Khan, became the largest contiguous land empire in history.",
    "The Black Death was a devastating global epidemic of bubonic plague that struck Europe and Asia in the 1300s.",
    "The American Revolution established the United States and influenced democratic movements globally.",
    "The Enlightenment was an intellectual movement that emphasized reason, individualism, and skepticism of traditional authority.",
    "The Russian Revolution of 1917 dismantled the Tsarist autocracy and led to the rise of the Soviet Union.",
    "The colonization of Africa by European powers in the late 19th century profoundly reshaped the continent's borders.",
    "The signing of the Treaty of Versailles formally ended World War I but sowed the seeds for future conflicts.",
    "The invention of the printing press by Johannes Gutenberg revolutionized the spread of information.",
    "The Apollo 11 moon landing in 1969 was a major milestone in human space exploration."
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
    "Majuli in Assam is the largest river island in the world, located in the Brahmaputra River.",
    "The Andaman and Nicobar Islands are a union territory of India located at the juncture of the Bay of Bengal and the Andaman Sea.",
    "The Aravalli Range is one of the oldest fold mountain systems in the world.",
    "The Brahmaputra river originates in Tibet and flows through Arunachal Pradesh and Assam.",
    "Sundarbans is the largest mangrove forest in the world, located in the delta region of the Bay of Bengal.",
    "The Narmada and Tapti are the major west-flowing rivers in peninsular India.",
    "The Eastern Ghats run parallel to the eastern coastal plains of India.",
    "The Rann of Kutch in Gujarat is renowned for its seasonal salt marsh landscape.",
    "Lakshadweep is a tropical archipelago of 36 atolls and coral reefs in the Laccadive Sea.",
    "The Malabar Coast in southwestern India receives the first heavy rains of the southwest monsoon.",
    "The Godavari is the second longest river in India after the Ganga and is often called the Dakshin Ganga."
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
    "The Great Barrier Reef in Australia is the world's largest coral reef system.",
    "The Marianas Trench in the western Pacific Ocean is the deepest oceanic trench on Earth.",
    "Antarctica is the coldest, driest, and windiest continent, containing most of the world's freshwater.",
    "The Equator is an imaginary line that divides the Earth into the Northern and Southern Hemispheres.",
    "The Amazon Rainforest is the world's largest tropical rainforest, famous for its unparalleled biodiversity.",
    "Vatican City is the smallest independent state in the world by both area and population.",
    "The Dead Sea, bordered by Jordan and Israel, is one of the world's saltiest bodies of water.",
    "The Prime Meridian is the line of 0 degrees longitude, which passes through Greenwich, England.",
    "The Ring of Fire is a path along the Pacific Ocean characterized by active volcanoes and frequent earthquakes.",
    "The Mediterranean Sea is almost completely enclosed by land, bounded by Europe, Africa, and Asia.",
    "The Gobi Desert in East Asia spans parts of northern China and southern Mongolia."
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
    "Panchayati Raj is the system of local self-government of villages in rural India.",
    "The Election Commission of India is an autonomous constitutional authority responsible for administering election processes.",
    "The Chief Minister is the elected head of government of a state in India.",
    "The Comptroller and Auditor General (CAG) is an independent authority that audits all receipts and expenditures of the government.",
    "The Rajya Sabha, or Council of States, is the upper house of the bicameral Parliament of India.",
    "The Lok Sabha, or House of the People, is the lower house whose members are directly elected by citizens.",
    "The Right to Information (RTI) Act empowers citizens to seek information from public authorities, promoting transparency.",
    "The Governor acts as the constitutional head of a state, appointed by the President of India.",
    "The Anti-Defection Law was introduced in the Tenth Schedule of the Constitution to prevent political defections.",
    "The Finance Commission is constituted periodically to allocate tax revenues between the central and state governments.",
    "The Preamble to the Constitution declares the fundamental values and guiding principles of the Indian republic."
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
    "Economic liberalization in 1991 transformed India into a rapidly growing market-based economy.",
    "The Bombay Stock Exchange (BSE) is the oldest stock exchange in Asia, located on Dalal Street.",
    "The NITI Aayog serves as the premier policy think tank of the Government of India, replacing the Planning Commission.",
    "Micro, Small and Medium Enterprises (MSMEs) play a crucial role in providing employment and boosting exports.",
    "The Special Economic Zones (SEZs) act aims to promote exports, investment, and employment generation.",
    "Financial inclusion initiatives like PMJDY aim to provide affordable access to financial services for all citizens.",
    "India is one of the world's largest generic drug providers and has a booming pharmaceutical industry.",
    "The demographic dividend refers to the economic growth potential stemming from India's large working-age population.",
    "Insolvency and Bankruptcy Code (IBC) was enacted to consolidate laws relating to reorganization and insolvency resolution.",
    "The manufacturing sector is being actively promoted through the 'Make in India' initiative to boost domestic production.",
    "India's foreign exchange reserves act as a buffer against economic shocks and help stabilize the currency."
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
    "Quantum mechanics is a fundamental theory in physics that provides a description of the physical properties of nature at the scale of atoms and subatomic particles.",
    "An atom is the smallest unit of ordinary matter that forms a chemical element, consisting of a nucleus surrounded by electrons.",
    "Cell division is the process by which a parent cell divides into two or more daughter cells for growth and repair.",
    "Antibiotics are medicines that help stop infections caused by bacteria, though they are ineffective against viruses.",
    "The theory of general relativity, published by Albert Einstein, describes gravity as a geometric property of space and time.",
    "Genetics is the study of genes, genetic variation, and heredity in living organisms.",
    "Enzymes are biological catalysts that speed up chemical reactions in living organisms.",
    "Plate tectonics is the scientific theory that describes the large-scale motion of the Earth's lithosphere.",
    "Radioactivity is the spontaneous emission of radiation from an unstable atomic nucleus.",
    "The states of matter most commonly observed in everyday life are solid, liquid, gas, and plasma.",
    "A virus is a submicroscopic infectious agent that replicates only inside the living cells of an organism."
  ],
  "Environment": [
    "Climate change refers to long-term shifts in temperatures and weather patterns, largely driven by human activities.",
    "Deforestation, the clearing of forests, contributes significantly to global greenhouse gas emissions.",
    "Biodiversity encompasses the variety and variability of life on Earth, crucial for resilient ecosystems.",
    "Ozone layer depletion was a major environmental concern until the Montreal Protocol phased out ozone-depleting substances.",
    "Renewable energy sources, such as solar and wind power, are essential for reducing reliance on fossil fuels.",
    "Plastic pollution in oceans poses a severe threat to marine life and ecosystems globally.",
    "Wetlands act as natural water purifiers and provide critical habitats for many species of birds and fish.",
    "Sustainable agriculture aims to meet society's present food needs without compromising the ability of future generations.",
    "Air pollution, caused by industrial emissions and vehicle exhaust, is a leading environmental health risk.",
    "Conservation biology is the scientific study of nature and of Earth's biodiversity with the aim of protecting species.",
    "The greenhouse effect is the process by which radiation from a planet's atmosphere warms its surface to a temperature above what it would be without its atmosphere.",
    "Endangered species are populations of organisms which are at risk of becoming extinct because they are either few in numbers or threatened by changing environmental conditions.",
    "Ocean acidification, caused by increased carbon dioxide absorption, threatens the survival of coral reefs and marine ecosystems.",
    "Composting is the natural process of recycling organic matter, such as leaves and food scraps, into a valuable fertilizer.",
    "Afforestation is the establishment of a forest or stand of trees in an area where there was no previous tree cover.",
    "Water scarcity involves water stress, water shortage or deficits, and water crisis affecting regions globally.",
    "The carbon footprint is the total amount of greenhouse gases that are generated by our actions.",
    "E-waste, or electronic waste, refers to discarded electrical or electronic devices which pose serious health and environmental hazards.",
    "Agroforestry integrates trees and shrubs into crop and animal farming systems to create environmental, economic, and social benefits.",
    "Urban sprawl is the uncontrolled expansion of urban areas, often resulting in increased traffic, pollution, and loss of green space."
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
    "Open-source software is computer software that is released under a license in which the copyright holder grants users the rights to use, study, change, and distribute the software.",
    "A motherboard is the main printed circuit board found in general purpose computers and other expandable systems.",
    "Malware is any software intentionally designed to cause disruption to a computer, server, client, or computer network.",
    "A Graphical User Interface (GUI) allows users to interact with electronic devices through graphical icons and audio indicator such as primary notation.",
    "An IP address is a numerical label assigned to each device connected to a computer network that uses the Internet Protocol for communication.",
    "A web browser is a software application for accessing information on the World Wide Web.",
    "Cache memory is a small-sized type of volatile computer memory that provides high-speed data access to a processor.",
    "A firewall is a network security system that monitors and controls incoming and outgoing network traffic based on predetermined security rules.",
    "Encryption is the process of encoding information in such a way that only authorized parties can access it.",
    "An algorithm is a finite sequence of well-defined, computer-implementable instructions, typically to solve a class of specific problems.",
    "A compiler is a computer program that translates computer code written in one programming language into another language."
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
    "Quantum computing is a rapidly-emerging technology that harnesses the laws of quantum mechanics to solve problems too complex for classical computers.",
    "Biometrics involves the measurement and statistical analysis of people's unique physical and behavioral characteristics for identification.",
    "Nanotechnology is the manipulation of matter on an atomic, molecular, and supramolecular scale for industrial purposes.",
    "Drones, or unmanned aerial vehicles (UAVs), are aircraft without a human pilot on board, operated via remote control or autonomous systems.",
    "Wearable technology incorporates electronic technologies or computers into items of clothing and accessories.",
    "Renewable energy technologies, such as solar panels and wind turbines, harness naturally replenishing resources to generate power.",
    "Smart home technology allows homeowners to control appliances, thermostats, lights, and other devices remotely using a smartphone or tablet.",
    "Cyber-physical systems (CPS) integrate sensing, computation, control and networking into physical objects and infrastructure.",
    "Edge computing is a distributed computing paradigm that brings computation and data storage closer to the location where it is needed.",
    "The metaverse is a hypothesized iteration of the internet, supporting persistent online 3-D virtual environments through conventional personal computing.",
    "Synthetic biology is a multidisciplinary area of research that seeks to create new biological parts, devices, and systems."
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
    "Turing test, developed by Alan Turing, is a test of a machine's ability to exhibit intelligent behavior equivalent to, or indistinguishable from, that of a human.",
    "Large language models (LLMs) are AI systems trained on massive amounts of text data to understand and generate human-like language.",
    "Supervised learning is a machine learning paradigm where the algorithm is trained on labeled data.",
    "Unsupervised learning is a type of machine learning that looks for previously undetected patterns in a data set with no pre-existing labels.",
    "Robotics intersects with AI to create intelligent machines capable of performing tasks autonomously in complex environments.",
    "AI alignment is the research field aiming to steer AI systems towards their designers' intended goals and human values.",
    "Facial recognition is a biometric technology that uses AI to identify or verify a person from a digital image or a video frame.",
    "Predictive analytics uses statistical algorithms and machine learning techniques to identify the likelihood of future outcomes based on historical data.",
    "Explainable AI (XAI) refers to methods and techniques in the application of artificial intelligence such that the results of the solution can be understood by humans.",
    "Chatbots are software applications that use AI and NLP to understand customer questions and automate responses to them.",
    "Algorithmic bias occurs when an AI system reflects implicit values of the humans who are involved in coding, collecting, selecting, or using data."
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
    "Rabindranath Tagore was a Bengali polymath who reshaped Bengali literature and music, and became the first non-European to win the Nobel Prize in Literature in 1913.",
    "The Divine Comedy by Dante Alighieri is widely considered the pre-eminent work in Italian literature and one of the greatest works of world literature.",
    "Moby-Dick by Herman Melville is a foundational work of American literature, depicting the obsessive quest of Captain Ahab for revenge.",
    "Frankenstein by Mary Shelley is considered an early example of science fiction, exploring themes of creation and responsibility.",
    "The Catcher in the Rye by J.D. Salinger is a defining novel of teenage alienation and angst.",
    "Midnight's Children by Salman Rushdie deals with India's transition from British colonialism to independence and partition.",
    "Jane Eyre by Charlotte Brontë revolutionized prose fiction by being the first to focus on its protagonist's moral and spiritual development.",
    "Crime and Punishment by Fyodor Dostoevsky focuses on the mental anguish and moral dilemmas of an impoverished ex-student.",
    "The Canterbury Tales by Geoffrey Chaucer is a collection of 24 stories that played a crucial role in popularizing the English vernacular.",
    "Things Fall Apart by Chinua Achebe provides a profound depiction of pre-colonial life in the southeastern part of Nigeria.",
    "The Tale of Genji, written by Murasaki Shikibu in the early 11th century, is often referred to as the world's first novel."
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
    "A supernova is a powerful and luminous stellar explosion, occurring during the last evolutionary stages of a massive star.",
    "The Big Bang theory is the prevailing cosmological model explaining the existence of the observable universe from the earliest known periods through its subsequent large-scale evolution.",
    "Dark matter is a hypothetical form of matter thought to account for approximately 85% of the matter in the universe.",
    "Venus is the second planet from the Sun and is Earth's closest planetary neighbor.",
    "Saturn is the sixth planet from the Sun and the second-largest in the Solar System, best known for its prominent ring system.",
    "A comet is an icy, small Solar System body that, when passing close to the Sun, warms and begins to release gases, a process called outgassing.",
    "The asteroid belt is a torus-shaped region in the Solar System, located roughly between the orbits of the planets Jupiter and Mars.",
    "Light-year is a unit of length used to express astronomical distances and is equivalent to about 9.46 trillion kilometers.",
    "Neil Armstrong became the first person to walk on the Moon, famously declaring it 'one small step for man, one giant leap for mankind.'",
    "A galaxy is a gravitationally bound system of stars, stellar remnants, interstellar gas, dust, and dark matter.",
    "The James Webb Space Telescope, launched in 2021, is designed to conduct infrared astronomy and is the most powerful space telescope ever built."
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
    "The Tour de France is an annual men's multiple-stage bicycle race primarily held in France, considered the most prestigious cycling race.",
    "Baseball is a bat-and-ball game played between two opposing teams who take turns batting and fielding.",
    "Rugby union is a contact team sport that originated in England in the first half of the 19th century.",
    "Golf is a club-and-ball sport in which players use various clubs to hit balls into a series of holes on a course in as few strokes as possible.",
    "Badminton is a racket sport played using rackets to hit a shuttlecock across a net.",
    "Boxing is a combat sport in which two people, usually wearing protective gloves, throw punches at each other for a predetermined amount of time.",
    "Volleyball is a team sport in which two teams of six players are separated by a net.",
    "Formula One is the highest class of international racing for open-wheel single-seater formula racing cars.",
    "Gymnastics is a sport that includes physical exercises requiring balance, strength, flexibility, agility, coordination, and endurance.",
    "Wimbledon is the oldest tennis tournament in the world and is widely regarded as the most prestigious.",
    "Table tennis, also known as ping-pong, is a sport in which two or four players hit a lightweight ball back and forth across a table using small rackets."
  ],
  "General Knowledge": [
    "The Nobel Prize is a set of annual international awards bestowed in several categories by Swedish and Norwegian institutions.",
    "The United Nations (UN) is an intergovernmental organization whose stated purposes are to maintain international peace and security.",
    "The World Health Organization (WHO) is a specialized agency of the United Nations responsible for international public health.",
    "The Mariana Trench is the deepest oceanic trench on Earth, located in the western Pacific Ocean.",
    "Mount Everest is Earth's highest mountain above sea level, located in the Mahalangur Himal sub-range of the Himalayas.",
    "The Amazon Rainforest is a moist broadleaf tropical rainforest in the Amazon biome that covers most of the Amazon basin of South America.",
    "The Great Wall of China is a series of fortifications that were built across the historical northern borders of ancient Chinese states.",
    "The Colosseum in Rome is the largest ancient amphitheater ever built, and is still the largest standing amphitheater in the world today.",
    "The Taj Mahal is an ivory-white marble mausoleum on the right bank of the river Yamuna in the Indian city of Agra.",
    "Machu Picchu is a 15th-century Inca citadel located in the Eastern Cordillera of southern Peru on a 2,430-meter mountain ridge.",
    "The Vatican City is an independent city-state enclaved within Rome, Italy, and is the smallest state in the world by both area and population.",
    "The Louvre, or the Louvre Museum, is the world's most-visited art museum, and a historic monument in Paris, France.",
    "The Mona Lisa is a half-length portrait painting by Italian artist Leonardo da Vinci, considered an archetypal masterpiece of the Italian Renaissance.",
    "The Statue of Liberty is a colossal neoclassical sculpture on Liberty Island in New York Harbor in New York City, in the United States.",
    "The Eiffel Tower is a wrought-iron lattice tower on the Champ de Mars in Paris, France, named after the engineer Gustave Eiffel.",
    "The Sahara is a desert on the African continent, the largest hot desert in the world, and the third-largest desert overall.",
    "The Nile is a major north-flowing river in northeastern Africa, historically considered the longest river in the world.",
    "The Pacific Ring of Fire is a major area in the basin of the Pacific Ocean where many earthquakes and volcanic eruptions occur.",
    "The International Monetary Fund (IMF) is an international financial institution working to foster global monetary cooperation and secure financial stability.",
    "The World Bank is an international financial institution that provides loans and grants to the governments of low- and middle-income countries."
  ]
};

const practiceTopicsData = {
  "Daily life": [
    "I usually wake up early in the morning and start my day with a cup of hot coffee.",
    "Preparing a healthy breakfast is an important part of my daily morning routine.",
    "Commuting to work can be stressful, but listening to a good podcast makes it better.",
    "Organizing my workspace helps me stay focused and productive throughout the day.",
    "Taking a short walk during lunch break is a great way to clear my mind and stretch my legs.",
    "After work, I like to relax by reading a book or watching an episode of my favorite show.",
    "Cooking dinner at home allows me to control the ingredients and eat healthier meals.",
    "Spending time with family in the evening is the highlight of my typical weekday.",
    "Doing household chores might be boring, but a clean house feels incredibly satisfying.",
    "Establishing a consistent bedtime routine ensures I get enough restful sleep every night."
  ],
  "Productivity": [
    "Using a task management app helps me prioritize my most important daily assignments.",
    "The Pomodoro technique is an effective method for maintaining high levels of concentration.",
    "Breaking large projects into smaller, manageable tasks makes them feel less overwhelming.",
    "Eliminating digital distractions is crucial for achieving deep and meaningful work sessions.",
    "Setting specific deadlines creates a sense of urgency that prevents unnecessary procrastination.",
    "Taking regular breaks actually improves overall efficiency and prevents creative burnout.",
    "Delegating tasks to capable team members frees up time for strategic planning and higher-level thinking.",
    "Reviewing your progress at the end of each week provides valuable insights for future improvement.",
    "Maintaining a tidy environment significantly reduces cognitive load and boosts mental clarity.",
    "Learning to say no to non-essential requests is a superpower for protecting your valuable time."
  ],
  "Technology": [
    "Smartphones have fundamentally changed the way we communicate and access information daily.",
    "Cloud computing allows users to store and access their data from anywhere in the world seamlessly.",
    "Artificial intelligence is rapidly transforming various industries, from healthcare to customer service.",
    "Cybersecurity measures are increasingly important to protect sensitive personal and financial data online.",
    "Virtual reality offers immersive experiences that are revolutionizing gaming and professional training.",
    "The rise of remote work was heavily facilitated by advancements in video conferencing software.",
    "Learning basic coding skills is becoming as essential as reading and writing in the modern era.",
    "Open-source software encourages global collaboration and accelerates technological innovation.",
    "Wearable devices can accurately track physical activity, heart rate, and sleep patterns for better health.",
    "Blockchain technology provides a secure and decentralized way to verify and record digital transactions."
  ],
  "Nature": [
    "Walking through a dense forest provides a sense of peace and connection to the natural world.",
    "The sound of ocean waves crashing against the shore is incredibly soothing and therapeutic.",
    "Watching a vibrant sunset paints the sky in breathtaking shades of orange, pink, and purple.",
    "Mountains offer stunning panoramic views and a humbling perspective on our place in the universe.",
    "A gentle rain shower can make the air smell remarkably fresh and revitalize the surrounding flora.",
    "Observing wildlife in its natural habitat is a fascinating and deeply rewarding experience.",
    "Springtime brings a burst of color as flowers bloom and trees regain their vibrant green leaves.",
    "Stargazing on a clear, dark night reveals the awe-inspiring vastness of the milky way galaxy.",
    "The rhythmic changing of the seasons reminds us of the continuous cycle of life and renewal.",
    "Protecting fragile ecosystems is essential for maintaining the incredible biodiversity of our planet."
  ],
  "Communication": [
    "Effective communication requires not just speaking clearly, but also listening actively and attentively.",
    "Non-verbal cues like body language and eye contact convey powerful messages during a conversation.",
    "Expressing gratitude regularly strengthens relationships and fosters a positive and supportive environment.",
    "Constructive feedback, when delivered with empathy, is a valuable tool for personal and professional growth.",
    "Asking open-ended questions encourages deeper dialogue and shows genuine interest in the other person.",
    "Being mindful of tone of voice can completely alter how a message is received and interpreted.",
    "Clear and concise writing is essential for conveying complex ideas in a professional setting.",
    "Public speaking is a skill that improves significantly with consistent practice and adequate preparation.",
    "Navigating difficult conversations requires patience, emotional intelligence, and a willingness to compromise.",
    "Digital communication is convenient, but it often lacks the nuance and warmth of face-to-face interaction."
  ],
  "Travel": [
    "Exploring new cities allows you to experience diverse cultures, cuisines, and architectural styles.",
    "Packing light makes traveling significantly easier and reduces the stress of managing heavy luggage.",
    "Learning a few basic phrases in the local language shows respect and goes a long way with residents.",
    "Traveling independently builds confidence and teaches valuable problem-solving skills in unfamiliar situations.",
    "Trying local street food is often the best way to authentically experience a region's culinary heritage.",
    "Getting lost in a historic neighborhood can lead to unexpected and delightful discoveries.",
    "Documenting your journey through photography helps preserve precious memories for years to come.",
    "Jet lag can be challenging, but adjusting to the local schedule immediately helps mitigate its effects.",
    "Interacting with fellow travelers in hostels can lead to meaningful friendships and shared adventures.",
    "Returning home after a long trip often brings a renewed appreciation for familiar comforts and routines."
  ],
  "Health": [
    "Maintaining a balanced diet provides the necessary nutrients for sustained energy and overall well-being.",
    "Regular cardiovascular exercise strengthens the heart and significantly reduces the risk of chronic diseases.",
    "Adequate hydration is essential for optimal physical performance, digestion, and cognitive function.",
    "Prioritizing sleep allows the body to repair itself and consolidates memory and learning from the day.",
    "Practicing mindfulness or meditation is an effective strategy for managing stress and reducing anxiety.",
    "Stretching daily improves flexibility, range of motion, and helps prevent muscle strains and injuries.",
    "Limiting processed foods and added sugars can have a profound positive impact on long-term health.",
    "Routine medical check-ups can detect potential health issues early when they are most treatable.",
    "Spending time outdoors in the sunlight helps the body produce vitamin D and regulates circadian rhythms.",
    "Mental health is just as important as physical health and requires intentional care and attention."
  ],
  "Motivation": [
    "Success is rarely accidental; it is the result of consistent effort, perseverance, and a willingness to learn.",
    "Embracing failure as a valuable learning opportunity is crucial for personal growth and eventual triumph.",
    "Setting ambitious but achievable goals provides direction and a measurable sense of progress.",
    "Surrounding yourself with positive, driven individuals can significantly elevate your own ambitions and mindset.",
    "Visualizing your desired outcome can increase focus and reinforce your commitment to the process.",
    "Motivation gets you started, but discipline and deeply ingrained habits are what keep you going.",
    "Celebrating small victories along the way builds momentum and maintains enthusiasm for long-term projects.",
    "Overcoming self-doubt requires acknowledging your fears and taking courageous action despite them.",
    "Reading biographies of successful people can provide powerful inspiration and practical strategies for overcoming adversity.",
    "Remembering your fundamental 'why' can provide the necessary fuel to push through difficult and uninspiring days."
  ],
  "Business": [
    "Building a successful business requires a clear value proposition and a deep understanding of the target market.",
    "Excellent customer service is often the most significant differentiator in a crowded and competitive industry.",
    "Effective leadership involves inspiring a team, delegating responsibility, and fostering a collaborative culture.",
    "Careful financial planning and cash flow management are the lifeblood of any sustainable enterprise.",
    "Adaptability is essential for survival in a rapidly changing economic and technological landscape.",
    "Networking and building strong professional relationships can open doors to unexpected and lucrative opportunities.",
    "Marketing is not just about selling; it's about telling a compelling story that resonates with your audience.",
    "Investing in employee training and development yields high returns through increased productivity and retention.",
    "A strong brand identity communicates trust, quality, and consistency to potential and existing customers.",
    "Strategic partnerships can accelerate growth and allow companies to access new markets and capabilities."
  ],
  "General reading": [
    "The quiet atmosphere of a local library provides the perfect sanctuary for focused reading and reflection.",
    "A well-written novel can transport the reader to entirely different worlds and eras of history.",
    "Reading non-fiction expands our understanding of reality, science, history, and human behavior.",
    "The tactile sensation of turning the pages of a physical book remains uniquely satisfying for many readers.",
    "Discussing a recently finished book with friends often reveals new perspectives and deeper interpretations.",
    "Setting aside dedicated time for reading each evening is a wonderful way to wind down before sleep.",
    "Building a personal library is a lifelong pursuit that reflects one's intellectual journey and evolving interests.",
    "Poetry distills complex emotions and profound observations into beautiful, carefully chosen language.",
    "Audiobooks have made it incredibly convenient to consume literature while commuting, exercising, or doing chores.",
    "The smell of old paper and ink evokes a sense of nostalgia and reverence for the written word."
  ]
};

const timers = [15, 30, 60, 90, 120];
const difficulties = ["easy", "medium", "hard"];

function slugify(text) {
  return text.toLowerCase().replace(/\s+/g, '_');
}

// Ensure first letter is capitalized
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Generate text from facts matching the target word count
function generateText(topic, targetWordCount, factsArray) {
  let text = "";
  let currentWords = 0;
  
  // Shuffle facts array for uniqueness
  const shuffledFacts = [...factsArray].sort(() => 0.5 - Math.random());
  let factIndex = 0;
  
  while (currentWords < targetWordCount) {
    if (factIndex >= shuffledFacts.length) {
      // reshuffle if we run out
      shuffledFacts.sort(() => 0.5 - Math.random());
      factIndex = 0;
    }
    const fact = shuffledFacts[factIndex];
    text += fact + " ";
    currentWords += fact.split(' ').length;
    factIndex++;
  }
  
  return text.trim();
}

function processDatasets(dataObj, categoryName, targetDir) {
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  Object.keys(dataObj).forEach(topic => {
    const items = [];
    
    difficulties.forEach(diff => {
      timers.forEach(timer => {
        
        let wpm = 50;
        if (diff === 'easy') wpm = 30;
        if (diff === 'hard') wpm = 75;
        
        // Exact target word count ranges based on user spec
        let targetWordCount = Math.ceil((wpm / 60) * timer);
        if (timer === 15) targetWordCount = 30;
        if (timer === 30) targetWordCount = 60;
        if (timer === 60) targetWordCount = 135;
        if (timer === 90) targetWordCount = 195;
        if (timer === 120) targetWordCount = 270;

        // Generate 10 unique paragraphs per timer/diff combination
        for (let i = 1; i <= 10; i++) {
          const generatedText = generateText(topic, targetWordCount, dataObj[topic]);
          const actualWordCount = generatedText.split(' ').length;
          // estimate reading time at roughly 200 wpm reading speed
          const estimatedReadingTime = Math.ceil((actualWordCount / 200) * 60);
          
          items.push({
            id: `${slugify(topic)}_${diff}_${timer}_${i.toString().padStart(2, '0')}`,
            topic: topic,
            difficulty: diff,
            suitableTimers: [timer],
            estimatedWords: actualWordCount,
            estimatedReadingTime: estimatedReadingTime,
            title: `${capitalize(diff)} ${timer}s ${categoryName} - Part ${i}`,
            text: generatedText,
            keywords: [slugify(topic), diff, categoryName.toLowerCase()]
          });
        }
      });
    });

    const content = {
      topic: topic,
      items: items
    };

    fs.writeFileSync(path.join(targetDir, `${slugify(topic)}.json`), JSON.stringify(content, null, 2));
  });
}

// 1. Generate Learning Data
const learningDir = path.join(__dirname, 'src', 'data', 'learning', 'en');
processDatasets(learningTopicsData, "Learning", learningDir);

// 2. Generate Practice Data
const practiceDir = path.join(__dirname, 'src', 'data', 'practice', 'en');
processDatasets(practiceTopicsData, "Practice", practiceDir);

console.log("3900+ Paragraphs successfully synthesized and written to disk!");
