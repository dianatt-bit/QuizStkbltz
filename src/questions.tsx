export interface Question {
  question: string;
  options: string[];
  correct_answer: string;
  explanation: string;
}

export interface MockDatabase {
  [category: string]: Question[];
}

export const MOCK_AI_DATABASE: MockDatabase = {
  "Capital Cities in Europe": [
    { question: "What is the capital city of France?", options: ["Marseille", "Paris", "Nice"], correct_answer: "Paris", explanation: "Paris is the capital and most populous city of France." },
    { question: "What is the capital city of Germany?", options: ["Munich", "Berlin", "Hamburg"], correct_answer: "Berlin", explanation: "Berlin is the capital and largest city of Germany." },
    { question: "What is the capital city of Italy?", options: ["Milan", "Florence", "Rome"], correct_answer: "Rome", explanation: "Rome is the capital of Italy and is a globally renowned historic city." },
    { question: "What is the capital city of Spain?", options: ["Barcelona", "Madrid", "Seville"], correct_answer: "Madrid", explanation: "Madrid is the capital city and largest financial center of Spain." },
    { question: "What is the capital city of Poland?", options: ["Krakow", "Warsaw", "Poznań"], correct_answer: "Warsaw", explanation: "Warsaw became the capital city of Poland in 1596." },
    { question: "What is the capital city of Iceland?", options: ["Oslo", "Reykjavik", "Helsinki", "Nuuk"], correct_answer: "Reykjavik", explanation: "Reykjavik is the northernmost capital city of a sovereign state in the world." },
    { question: "Which city is the capital of Austria?", options: ["Sydney", "Vienna", "Canberra", "Salzburg"], correct_answer: "Vienna", explanation: "Vienna is the capital and largest city of Austria, known for its rich musical heritage." },
    { question: "What is the capital city of the Netherlands?", options: ["Rotterdam", "The Hague", "Amsterdam"], correct_answer: "Amsterdam", explanation: "Amsterdam is the official capital, though the government sits in The Hague." },
    { question: "What is the capital city of Belgium?", options: ["Brussels", "Antwerp", "Bruges"], correct_answer: "Brussels", explanation: "Brussels serves as the capital of Belgium and the administrative center of the EU." },
    { question: "What is the capital city of Portugal?", options: ["Porto", "Lisbon", "Braga"], correct_answer: "Lisbon", explanation: "Lisbon is the capital and largest city of Portugal, one of the oldest cities in Western Europe." },
    { question: "Which of these cities is the capital of Turkey?", options: ["Istanbul", "Ankara", "Izmir"], correct_answer: "Ankara", explanation: "Ankara became the capital in 1923 with the founding of the Republic of Turkey." },
    { question: "What is the capital city of Greece?", options: ["Thessaloniki", "Athens", "Patras"], correct_answer: "Athens", explanation: "Athens is the capital of Greece and one of the world's oldest cities, with recorded history spanning over 3,400 years." },
    { question: "What is the capital city of Sweden?", options: ["Gothenburg", "Malmö", "Stockholm"], correct_answer: "Stockholm", explanation: "Stockholm is the capital of Sweden, comprising 14 islands connected by more than 50 bridges." },
    { question: "What is the capital city of Norway?", options: ["Bergen", "Oslo", "Trondheim"], correct_answer: "Oslo", explanation: "Oslo has been the capital city of Norway since the reign of King Haakon V around the year 1300." }
  ],
  "Capital Cities in the World": [
    { question: "What is the capital city of Japan?", options: ["Kyoto", "Tokyo", "Hiroshima"], correct_answer: "Tokyo", explanation: "Tokyo is the bustling capital city and economic hub of Japan." },
    { question: "What is the capital city of Egypt?", options: ["Alexandria", "Cairo", "Giza"], correct_answer: "Cairo", explanation: "Cairo is the capital of Egypt and the largest metropolitan area in the Arab world." },
    { question: "What is the capital city of Australia?", options: ["Sydney", "Melbourne", "Canberra"], correct_answer: "Canberra", explanation: "Canberra was founded as a compromise site between rivals Sydney and Melbourne in 1908." },
    { question: "What is the capital city of Canada?", options: ["Toronto", "Ottawa", "Montreal"], correct_answer: "Ottawa", explanation: "Ottawa was selected as the capital city of Canada by Queen Victoria in 1857." },
    { question: "What is the capital city of Brazil?", options: ["Rio de Janeiro", "Brasília", "Salvador"], correct_answer: "Brasília", explanation: "Brasília is a planned city that officially replaced Rio de Janeiro as the capital in 1960." },
    { question: "What is the capital city of Argentina?", options: ["Buenos Aires", "Córdoba", "Rosario"], correct_answer: "Buenos Aires", explanation: "Buenos Aires became the official autonomous capital city of Argentina in 1880." },
    { question: "What is the capital city of India?", options: ["Mumbai", "New Delhi", "Kolkata"], correct_answer: "New Delhi", explanation: "New Delhi was designed by British architects and officially inaugurated as the capital in 1931." },
    { question: "What is the capital city of South Africa?", options: ["Johannesburg", "Pretoria", "Durban"], correct_answer: "Pretoria", explanation: "Pretoria is the administrative capital, while Cape Town is legislative and Bloemfontein is judicial." },
    { question: "What is the capital city of New Zealand?", options: ["Auckland", "Wellington", "Christchurch"], correct_answer: "Wellington", explanation: "Wellington replaced Auckland as the capital city in 1865 to be more centrally located." },
    { question: "What is the capital city of Mexico?", options: ["Guadalajara", "Mexico City", "Monterrey"], correct_answer: "Mexico City", explanation: "Mexico City is the capital of Mexico and the most populous city in North America." },
    { question: "What is the capital city of South Korea?", options: ["Busan", "Incheon", "Seoul"], correct_answer: "Seoul", explanation: "Seoul has been the capital city of Korea for over 600 years since the Joseon Dynasty." },
    { question: "What is the capital city of China?", options: ["Shanghai", "Beijing", "Guangzhou"], correct_answer: "Beijing", explanation: "Beijing is the capital of the People's Republic of China, with history dating back three millennia." },
    { question: "What is the capital city of Thailand?", options: ["Phuket", "Bangkok", "Chiang Mai"], correct_answer: "Bangkok", explanation: "Bangkok, known locally as Krung Thep Maha Nakhon, is the capital city of Thailand." },
    { question: "What is the capital city of Kenya?", options: ["Mombasa", "Nairobi", "Kisumu"], correct_answer: "Nairobi", explanation: "Nairobi grew from a simple rail depot founded in 1899 to become Kenya's capital city." }
  ],
  "Highest Mountains in Each Continent": [
    { question: "What is the highest mountain in Asia?", options: ["K2", "Mount Everest", "Kangchenjunga"], correct_answer: "Mount Everest", explanation: "Mount Everest is the highest mountain in both Asia and the entire world." },
    { question: "What is the highest mountain in Africa?", options: ["Mount Kenya", "Mount Kilimanjaro", "Mount Stanley"], correct_answer: "Mount Kilimanjaro", explanation: "Mount Kilimanjaro is the highest mountain on the African continent." },
    { question: "What is the highest mountain in North America?", options: ["Mount Logan", "Mount Denali", "Mount Rainier"], correct_answer: "Mount Denali", explanation: "Mount Denali is located in Alaska and is the highest mountain peak in North America." },
    { question: "What is the highest mountain in South America?", options: ["Mount Aconcagua", "Ojos del Salado", "Mount Huascarán"], correct_answer: "Mount Aconcagua", explanation: "Mount Aconcagua in Argentina is the highest peak in both South America and the Western Hemisphere." },
    { question: "What is the highest mountain in Europe?", options: ["Mount Blanc", "Mount Elbrus", "Mount Olympus"], correct_answer: "Mount Elbrus", explanation: "Mount Elbrus, located in Russia, is the highest mountain peak on the European continent." },
    { question: "What is the highest mountain peak in Oceania?", options: ["Mount Kosciuszko", "Puncak Jaya", "Mount Cook"], correct_answer: "Puncak Jaya", explanation: "Puncak Jaya (Carstensz Pyramid) in Indonesia is the highest continental island peak in Oceania." },
    { question: "What is the highest mountain peak in Antarctica?", options: ["Mount Vinson", "Mount Tyree", "Mount Shinn"], correct_answer: "Mount Vinson", explanation: "Mount Vinson is the highest peak in Antarctica, sitting in the Sentinel Range at 4,892 metres." },
    { question: "In which mountain range is the active volcano Mount Vesuvius located?", options: ["Alps", "Apennines", "Pyrenees"], correct_answer: "Apennines", explanation: "Mount Vesuvius is a composite volcano located on the Gulf of Naples, part of the Apennine range." },
    { question: "What is the highest mountain peak in the United Kingdom?", options: ["Snowdon", "Ben Nevis", "Scafell Pike"], correct_answer: "Ben Nevis", explanation: "Ben Nevis is the highest mountain in the UK, located in the Lochaber area of the Scottish Highlands." },
    { question: "Which mountain range separates Europe from Asia?", options: ["Ural Mountains", "Andes Mountains", "Himalayas"], correct_answer: "Ural Mountains", explanation: "The Ural Mountains run north to south through western Russia and form a natural boundary between Europe and Asia." },
    { question: "What is the second highest mountain peak in the world?", options: ["K2", "Makalu", "Dhaulagiri"], correct_answer: "K2", explanation: "K2, located on the China–Pakistan border, is the second highest peak and is known as the Savage Mountain." },
    { question: "Which mountain range runs along the western coast of South America?", options: ["The Rockies", "The Andes", "The Alps"], correct_answer: "The Andes", explanation: "The Andes extend roughly 7,000 kilometres along the western coast of South America." },
    { question: "In which country is Mount Fuji located?", options: ["China", "South Korea", "Japan"], correct_answer: "Japan", explanation: "Mount Fuji is an active stratovolcano located about 100 kilometres southwest of Tokyo." },
    { question: "What is the name of the famous flat-topped mountain overlooking Cape Town, South Africa?", options: ["Lion's Head", "Table Mountain", "Signal Hill"], correct_answer: "Table Mountain", explanation: "Table Mountain is a prominent flat plateau landmark overlooking Cape Town." }
  ],
  "Key Historic Buildings in Europe": [
    { question: "In which country is the Eiffel Tower located?", options: ["Italy", "Spain", "France"], correct_answer: "France", explanation: "The Eiffel Tower is a world-famous historic landmark located in Paris, France." },
    { question: "In which country is the Colosseum located?", options: ["Greece", "Italy", "France"], correct_answer: "Italy", explanation: "The ancient Colosseum amphitheatre is located in Rome, Italy." },
    { question: "In which country is the Big Ben clock tower located?", options: ["Ireland", "United Kingdom", "Netherlands"], correct_answer: "United Kingdom", explanation: "Big Ben is the nickname for the Great Bell of the striking clock at the Palace of Westminster in London." },
    { question: "In which country is the Parthenon temple located?", options: ["Italy", "Greece", "Turkey"], correct_answer: "Greece", explanation: "The Parthenon is a former temple on the Athenian Acropolis in Greece, dedicated to the goddess Athena." },
    { question: "In which country is the Sagrada Família church located?", options: ["Portugal", "France", "Spain"], correct_answer: "Spain", explanation: "The Sagrada Família is a historic, ongoing architectural masterpiece designed by Antoni Gaudí in Barcelona, Spain." },
    { question: "In which city can you find the famous leaning tower?", options: ["Rome", "Pisa", "Florence"], correct_answer: "Pisa", explanation: "The Leaning Tower of Pisa is the campanile, or freestanding bell tower, of Pisa Cathedral." },
    { question: "In which country is the ancient palace of Versailles located?", options: ["United Kingdom", "Germany", "France"], correct_answer: "France", explanation: "The Palace of Versailles was the principal royal residence of France from 1682 until the French Revolution." },
    { question: "Where is the famous Bran Castle, often linked to Dracula, located?", options: ["Hungary", "Romania", "Bulgaria"], correct_answer: "Romania", explanation: "Bran Castle is located near Bran in Romania, a national monument and landmark in Transylvania." },
    { question: "In which city is the famous St. Basil's Cathedral located?", options: ["Saint Petersburg", "Moscow", "Kiev"], correct_answer: "Moscow", explanation: "St. Basil's Cathedral is located in the Red Square of Moscow, Russia, known for its colorful onion domes." },
    { question: "In which European capital city would you find the historic Brandenburg Gate?", options: ["Vienna", "Berlin", "Amsterdam"], correct_answer: "Berlin", explanation: "The Brandenburg Gate is an 18th-century neoclassical triumphal arch in Berlin." },
    { question: "In which country can you visit the ancient monument of Stonehenge?", options: ["Scotland", "Ireland", "England"], correct_answer: "England", explanation: "Stonehenge is a prehistoric megalithic monument on Salisbury Plain in Wiltshire, England." },
    { question: "Where is the famous Acropolis located?", options: ["Rome", "Athens", "Cairo"], correct_answer: "Athens", explanation: "The Acropolis of Athens is an ancient citadel located on a rocky outcrop above the city of Athens." },
    { question: "In which city is the historic Louvre Museum located?", options: ["London", "Paris", "Berlin"], correct_answer: "Paris", explanation: "The Louvre is the world's largest art museum, housed in the Louvre Palace in Paris, France." },
    { question: "In which country is the historic Neuschwanstein Castle located?", options: ["Austria", "Switzerland", "Germany"], correct_answer: "Germany", explanation: "Neuschwanstein Castle is a 19th-century historicist palace on a rugged hill in Bavaria, Germany." }
  ],
  "Anatomy": [
    { question: "What is the main organ responsible for pumping blood through the body?", options: ["Lungs", "Brain", "Heart"], correct_answer: "Heart", explanation: "The heart is a muscular organ that pumps blood continuously through the circulatory system." },
    { question: "Which hard structures make up the skeletal framework of the human body?", options: ["Muscles", "Bones", "Skin"], correct_answer: "Bones", explanation: "Adult humans have 206 bones that protect internal organs and support the body structure." },
    { question: "Which organ do we use to breathe air into our body?", options: ["Lungs", "Stomach", "Liver"], correct_answer: "Lungs", explanation: "The lungs extract oxygen from the air we breathe and transfer it into our bloodstream." },
    { question: "What covers and protects the outside of the entire human body?", options: ["Hair", "Skin", "Nails"], correct_answer: "Skin", explanation: "Skin is the largest organ of the human body and acts as our primary protective barrier." },
    { question: "Which organ is responsible for thinking and controlling body movements?", options: ["Heart", "Liver", "Brain"], correct_answer: "Brain", explanation: "The brain acts as the central control unit of the human nervous system." },
    { question: "What is the smallest bone in the human body?", options: ["Stapes (Stirrup)", "Incus", "Malleus"], correct_answer: "Stapes (Stirrup)", explanation: "The stapes bone is located inside the middle ear and measures only 3 millimetres." },
    { question: "What is the master gland of the endocrine system?", options: ["Thyroid gland", "Adrenal gland", "Pituitary gland"], correct_answer: "Pituitary gland", explanation: "The pituitary gland produces hormones that control many other endocrine glands." },
    { question: "Which type of blood cells are responsible for fighting infections?", options: ["Red blood cells", "White blood cells", "Platelets"], correct_answer: "White blood cells", explanation: "White blood cells (leukocytes) protect the body against infectious diseases and foreign invaders." },
    { question: "What is the technical name for the human kneecap?", options: ["Patella", "Femur", "Tibia"], correct_answer: "Patella", explanation: "The patella is a thick, circular-triangular bone that articulates with the femur and protects the knee joint." },
    { question: "Which organ produces the digestive fluid known as bile?", options: ["Gallbladder", "Stomach", "Liver"], correct_answer: "Liver", explanation: "The liver constantly produces bile, which is then stored and concentrated in the gallbladder." },
    { question: "What is the hardest substance in the human body?", options: ["Bone", "Tooth Enamel", "Cartilage"], correct_answer: "Tooth Enamel", explanation: "Tooth enamel is the highly mineralized tissue protecting teeth against chewing pressures." },
    { question: "Which component gives red blood cells their distinct color?", options: ["Plasma", "Hemoglobin", "Platelets"], correct_answer: "Hemoglobin", explanation: "Hemoglobin is an iron-rich protein molecule that bonds with oxygen inside red blood cells." },
    { question: "How many chambers does a healthy human heart contain?", options: ["Two", "Three", "Four"], correct_answer: "Four", explanation: "The human heart is split into two upper atria and two lower muscular ventricles." },
    { question: "What is the main function of the human large intestine?", options: ["Protein digestion", "Water absorption", "Bile storage"], correct_answer: "Water absorption", explanation: "The large intestine absorbs remaining liquids and processes unusable food waste into solids." }
  ],
  "Maths": [
    { question: "What is 5 + 7?", options: ["11", "12", "13"], correct_answer: "12", explanation: "Adding 5 and 7 together results in a total sum of 12." },
    { question: "What is 3 multiplied by 4?", options: ["7", "12", "14"], correct_answer: "12", explanation: "3 times 4 means adding 3 four times, which equals 12." },
    { question: "What is 20 + 30?", options: ["40", "50", "60"], correct_answer: "50", explanation: "Adding two tens and three tens gives you exactly five tens, or 50." },
    { question: "What is 10 multiplied by 5?", options: ["15", "45", "50"], correct_answer: "50", explanation: "Multiplying any number by 10 shifts its digit place, so 5 becomes 50." },
    { question: "What is 8 - 3?", options: ["4", "5", "6"], correct_answer: "5", explanation: "Subtracting 3 from 8 leaves a remaining balance of 5." },
    { question: "What is the value of 7 cubed (7³)?", options: ["49", "243", "343"], correct_answer: "343", explanation: "7 multiplied by 7 is 49, and 49 multiplied by 7 equals 343." },
    { question: "What is the mathematical term for a straight line that touches a circle at only one point?", options: ["Chord", "Radius", "Tangent"], correct_answer: "Tangent", explanation: "A tangent is a straight line that touches the outer curve of a circle at a single unique point." },
    { question: "How many degrees are there in a complete circle?", options: ["180°", "270°", "360°"], correct_answer: "360°", explanation: "A full rotation or a complete circle contains exactly 360 degrees." },
    { question: "What is the square root of 225?", options: ["13", "14", "15"], correct_answer: "15", explanation: "15 multiplied by itself (15 x 15) equals 225." },
    { question: "What is the value of the mathematical constant Pi (π) rounded to two decimal places?", options: ["3.12", "3.14", "3.16"], correct_answer: "3.14", explanation: "Pi represents the ratio of a circle's circumference to its diameter, starting as 3.14159..." },
    { question: "What is the square root of 144?", options: ["10", "12", "14"], correct_answer: "12", explanation: "12 multiplied by 12 equals exactly 144." },
    { question: "What do you call a triangle where all three sides are equal in length?", options: ["Isosceles", "Scalene", "Equilateral"], correct_answer: "Equilateral", explanation: "Equilateral triangles have three congruent sides and identical 60-degree internal angles." },
    { question: "What is the value of 5 factorial (5!)?", options: ["25", "60", "120"], correct_answer: "120", explanation: "5 factorial is calculated as 5 × 4 × 3 × 2 × 1 = 120." },
    { question: "How many sides does a regular heptagon have?", options: ["Six", "Seven", "Eight"], correct_answer: "Seven", explanation: "A heptagon is a polygon defined by seven sides and seven vertices." }
  ]
};
