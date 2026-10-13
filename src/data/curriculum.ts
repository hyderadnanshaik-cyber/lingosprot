// Typed curriculum — shape mirrors the future backend API (GET /curriculum).
// Characters: pip=Firefly, milo=Fox, tara=Turtle, bibi=Cloud, kiko=Chameleon, nova=Astronaut

export type CharacterId = "pip" | "milo" | "tara" | "bibi" | "kiko" | "nova";

export type Exercise =
  | { type: "listen-select"; prompt: string; word: string; options: string[] }
  | { type: "beginning-sound"; prompt: string; word: string; answer: string; options: string[] }
  | { type: "build-word"; prompt: string; word: string; tiles: string[] }
  | { type: "missing-letter"; prompt: string; pattern: string; answer: string; options: string[]; full: string }
  | { type: "arrange"; prompt: string; sentence: string }
  | { type: "read-aloud"; prompt: string; sentence: string }
  | { type: "match-definition"; prompt: string; word: string; definition: string; options: string[] }
  | { type: "fill-blank"; prompt: string; sentence: string; blank: string; answer: string; options: string[] }
  | { type: "poem-rhyme"; prompt: string; title: string; stanzas: string[]; question: string; answer: string; options: string[] }
  | { type: "paragraph-order"; prompt: string; title: string; sentences: string[]; solution: string[] }
  | { type: "grammar-fix"; prompt: string; sentenceWithMistake: string; correctSentence: string; explanation: string; options: string[] };

export type Lesson = {
  id: string;
  title: string;
  skill: string;
  character: CharacterId;
  xp: number;
  exercises: Exercise[];
};

export type Level = {
  id: number;
  name: string;
  blurb: string;
  tone: "primary" | "secondary" | "accent" | "sun";
  lessons: Lesson[];
};

const L = (id: string, title: string, skill: string, character: CharacterId, exercises: Exercise[]): Lesson => ({
  id,
  title,
  skill,
  character,
  xp: 10 + exercises.length * 2,
  exercises,
});

export const LEVELS: Level[] = [
  // ── LEVEL 1: Sound Explorer (Beginner: Alphabet & Letter Recognition) ──────────
  {
    id: 1,
    name: "Sound Explorer",
    blurb: "Hear letters, discover first sounds and short vowels.",
    tone: "primary",
    lessons: [
      L("s-a", "Short Vowel 'A'", "Vowels & Initial Sounds", "pip", [
        { type: "listen-select", prompt: "Listen and tap the word you hear", word: "apple", options: ["apple", "ant", "bag"] },
        { type: "beginning-sound", prompt: "Which sound does this word start with?", word: "ant", answer: "a", options: ["a", "m", "t"] },
        { type: "missing-letter", prompt: "Fill in the missing short vowel 'a'", pattern: "c_t", full: "cat", answer: "a", options: ["a", "o", "i"] },
        { type: "build-word", prompt: "Build the word with short 'a'", word: "bat", tiles: ["t", "b", "a"] },
        { type: "missing-letter", prompt: "Fill in the missing letter", pattern: "h_t", full: "hat", answer: "a", options: ["a", "e", "u"] },
      ]),
      L("s-e", "Short Vowel 'E'", "Vowels & Blending", "pip", [
        { type: "listen-select", prompt: "Listen and tap the word with short 'e'", word: "egg", options: ["egg", "ice", "oak"] },
        { type: "beginning-sound", prompt: "Which vowel sound begins this word?", word: "elephant", answer: "e", options: ["e", "a", "u"] },
        { type: "missing-letter", prompt: "Find the short 'e' vowel sound", pattern: "b_d", full: "bed", answer: "e", options: ["e", "a", "i"] },
        { type: "build-word", prompt: "Spell the word 'pen'", word: "pen", tiles: ["n", "p", "e"] },
        { type: "missing-letter", prompt: "Complete the word 'red'", pattern: "r_d", full: "red", answer: "e", options: ["e", "o", "a"] },
      ]),
      L("s-i", "Short Vowel 'I'", "Vowels & Sounds", "pip", [
        { type: "beginning-sound", prompt: "What letter starts this word?", word: "igloo", answer: "i", options: ["i", "e", "o"] },
        { type: "listen-select", prompt: "Listen closely for short 'i'", word: "pin", options: ["pan", "pin", "pen"] },
        { type: "missing-letter", prompt: "Fill in the vowel 'i'", pattern: "s_t", full: "sit", answer: "i", options: ["i", "e", "a"] },
        { type: "build-word", prompt: "Build the word 'pig'", word: "pig", tiles: ["g", "p", "i"] },
        { type: "missing-letter", prompt: "Which vowel makes 'win'?", pattern: "w_n", full: "win", answer: "i", options: ["i", "u", "o"] },
      ]),
      L("s-o", "Short Vowel 'O'", "Vowels & Word Discovery", "pip", [
        { type: "beginning-sound", prompt: "Which sound begins 'octopus'?", word: "octopus", answer: "o", options: ["o", "a", "u"] },
        { type: "listen-select", prompt: "Listen and tap the word you hear", word: "pot", options: ["pat", "pot", "pit"] },
        { type: "missing-letter", prompt: "Fill in the missing letter for 'dog'", pattern: "d_g", full: "dog", answer: "o", options: ["o", "a", "e"] },
        { type: "build-word", prompt: "Spell 'fox'", word: "fox", tiles: ["x", "o", "f"] },
        { type: "missing-letter", prompt: "Complete 'box'", pattern: "b_x", full: "box", answer: "o", options: ["o", "i", "u"] },
      ]),
      L("s-u", "Short Vowel 'U'", "Vowels & Sounds", "milo", [
        { type: "beginning-sound", prompt: "Which letter starts 'umbrella'?", word: "umbrella", answer: "u", options: ["u", "o", "a"] },
        { type: "listen-select", prompt: "Listen and select 'cup'", word: "cup", options: ["cap", "cup", "cop"] },
        { type: "missing-letter", prompt: "Fill in the missing short vowel 'u'", pattern: "s_n", full: "sun", answer: "u", options: ["u", "a", "o"] },
        { type: "build-word", prompt: "Build the word 'bus'", word: "bus", tiles: ["s", "b", "u"] },
        { type: "missing-letter", prompt: "Complete 'bug'", pattern: "b_g", full: "bug", answer: "u", options: ["u", "e", "i"] },
      ]),
      L("s-vowel-match", "Vowel Challenge: A, E, I, O, U", "Vowel Master", "pip", [
        { type: "missing-letter", prompt: "Is it bat or bet? Listen and fill 'bat'", pattern: "b_t", full: "bat", answer: "a", options: ["a", "e", "i", "o"] },
        { type: "missing-letter", prompt: "Complete 'net' with the correct vowel", pattern: "n_t", full: "net", answer: "e", options: ["e", "a", "u", "o"] },
        { type: "missing-letter", prompt: "Complete 'lip' with the correct vowel", pattern: "l_p", full: "lip", answer: "i", options: ["i", "e", "a", "u"] },
        { type: "missing-letter", prompt: "Complete 'hop' with the correct vowel", pattern: "h_p", full: "hop", answer: "o", options: ["o", "u", "a", "e"] },
        { type: "missing-letter", prompt: "Complete 'nut' with the correct vowel", pattern: "n_t", full: "nut", answer: "u", options: ["u", "a", "e", "i"] },
      ]),
    ],
  },

  // ── LEVEL 2: Phonics Builder (CVC, Consonant Blends, Digraphs & Magic E) ───────
  {
    id: 2,
    name: "Phonics Builder",
    blurb: "Blend sounds into words, master digraphs and silent magic 'E'.",
    tone: "secondary",
    lessons: [
      L("p-vowel-dist", "Short Vowel Traps: Pan vs Pen vs Pin", "Tricky Vowels", "milo", [
        { type: "listen-select", prompt: "Listen carefully: 'pen'", word: "pen", options: ["pan", "pen", "pin", "pun"] },
        { type: "listen-select", prompt: "Listen carefully: 'pin'", word: "pin", options: ["pan", "pen", "pin", "pun"] },
        { type: "listen-select", prompt: "Listen carefully: 'pan'", word: "pan", options: ["pan", "pen", "pin", "pun"] },
        { type: "missing-letter", prompt: "Which vowel makes 'men' (not 'man')?", pattern: "m_n", full: "men", answer: "e", options: ["e", "a", "i", "o"] },
        { type: "build-word", prompt: "Spell the word 'spin'", word: "spin", tiles: ["n", "s", "p", "i"] },
      ]),
      L("p-digraphs", "Quiet and Loud: Sh, Ch, Th", "Digraphs", "milo", [
        { type: "beginning-sound", prompt: "Which sound begins 'ship'?", word: "ship", answer: "sh", options: ["sh", "ch", "th", "wh"] },
        { type: "beginning-sound", prompt: "Which sound begins 'chair'?", word: "chair", answer: "ch", options: ["ch", "sh", "th", "ph"] },
        { type: "beginning-sound", prompt: "Which sound begins 'thumb'?", word: "thumb", answer: "th", options: ["th", "sh", "ch", "wh"] },
        { type: "build-word", prompt: "Build the word 'fish'", word: "fish", tiles: ["sh", "f", "i"] },
        { type: "build-word", prompt: "Build the word 'chop'", word: "chop", tiles: ["p", "ch", "o"] },
        { type: "missing-letter", prompt: "Fill in the missing digraph", pattern: "_ink", full: "think", answer: "th", options: ["th", "sh", "ch"] },
      ]),
      L("p-magic-e", "Magic 'E': Cap to Cape, Kit to Kite", "Long Vowels & Silent E", "pip", [
        { type: "listen-select", prompt: "Listen for the long vowel sound: 'cake'", word: "cake", options: ["cake", "cat", "cap", "cab"] },
        { type: "missing-letter", prompt: "Magic E makes 'a' say its name: c_ke", pattern: "c_ke", full: "cake", answer: "a", options: ["a", "i", "o", "u"] },
        { type: "build-word", prompt: "Turn 'kit' into 'kite' with magic E", word: "kite", tiles: ["e", "k", "i", "t"] },
        { type: "missing-letter", prompt: "Make 'bone' with magic E", pattern: "b_ne", full: "bone", answer: "o", options: ["o", "a", "e", "u"] },
        { type: "build-word", prompt: "Build the word 'tube'", word: "tube", tiles: ["e", "b", "u", "t"] },
        { type: "arrange", prompt: "Order this magic E sentence", sentence: "The kite is in the pine tree" },
      ]),
      L("p-vowel-teams", "Vowel Teams: 'EE', 'EA', 'OA'", "Vowel Digraphs", "milo", [
        { type: "listen-select", prompt: "Listen and tap 'boat'", word: "boat", options: ["boat", "boot", "bait", "beet"] },
        { type: "missing-letter", prompt: "Vowel team 'ee': find the missing sound", pattern: "tr__", full: "tree", answer: "ee", options: ["ee", "ea", "oa", "oo"] },
        { type: "build-word", prompt: "Build 'meat' using vowel team 'ea'", word: "meat", tiles: ["t", "m", "ea"] },
        { type: "build-word", prompt: "Build 'coat' using vowel team 'oa'", word: "coat", tiles: ["t", "c", "oa"] },
        { type: "fill-blank", prompt: "Complete the sentence with a vowel team", sentence: "The green leaf fell from the ___.", blank: "tree", answer: "tree", options: ["tree", "boat", "meat"] },
      ]),
    ],
  },

  // ── LEVEL 3: Word Weaver (Sight Words, Rhyming, Antonyms & Syntax) ──────────────
  {
    id: 3,
    name: "Word Weaver",
    blurb: "Connect words, master opposites, and form proper clauses.",
    tone: "accent",
    lessons: [
      L("w-sent-structure", "Subject & Verb Agreement", "Sentence Building", "tara", [
        { type: "arrange", prompt: "Put the words in correct order", sentence: "The big brown dog barks loudly" },
        { type: "fill-blank", prompt: "Choose the verb that agrees", sentence: "The little bird ___ high in the sky.", blank: "flies", answer: "flies", options: ["flies", "fly", "flying"] },
        { type: "read-aloud", prompt: "Read this sentence with good expression", sentence: "I can see three friendly rabbits in the garden." },
        { type: "arrange", prompt: "Build a complete sentence", sentence: "We like to read books together" },
      ]),
      L("w-antonyms", "Opposite Words (Antonyms)", "Vocabulary Depth", "milo", [
        { type: "match-definition", prompt: "What is the opposite of 'hot'?", word: "cold", definition: "having a low temperature, like ice or snow", options: ["cold", "warm", "wet", "bright"] },
        { type: "match-definition", prompt: "What is the opposite of 'quiet'?", word: "loud", definition: "making a lot of noise", options: ["loud", "soft", "calm", "fast"] },
        { type: "fill-blank", prompt: "Fill in the opposite of 'empty'", sentence: "The glass is completely ___.", blank: "full", answer: "full", options: ["full", "dry", "cold"] },
        { type: "match-definition", prompt: "What is the opposite of 'difficult'?", word: "easy", definition: "simple and not hard to do", options: ["easy", "hard", "heavy", "dark"] },
      ]),
      L("w-rhyme-families", "Word Families & Rhymes (-ake, -ight, -ound)", "Rhyming & Spelling", "milo", [
        { type: "listen-select", prompt: "Which word rhymes with 'cake'?", word: "lake", options: ["lake", "lock", "luck", "leek"] },
        { type: "listen-select", prompt: "Which word rhymes with 'night'?", word: "bright", options: ["bright", "boat", "brick", "blast"] },
        { type: "build-word", prompt: "Spell a word in the -ound family: 'sound'", word: "sound", tiles: ["d", "s", "ou", "n"] },
        { type: "missing-letter", prompt: "Finish the rhyming word: round / b_nd", pattern: "b__nd", full: "bound", answer: "ou", options: ["ou", "oa", "ea"] },
        { type: "arrange", prompt: "Put the rhyming line in order", sentence: "The bright light shone in the night" },
      ]),
    ],
  },

  // ── LEVEL 4: Reading Adventurer (Passages, Inferences, Context Clues) ────────────
  {
    id: 4,
    name: "Reading Adventurer",
    blurb: "Analyze passages, infer feelings, and use context clues.",
    tone: "sun",
    lessons: [
      L("r-story1", "The Secret Treehouse", "Reading Comprehension", "bibi", [
        { type: "read-aloud", prompt: "Read the story opening aloud with Bibi", sentence: "Leo found a wooden ladder leading up to a hidden treehouse." },
        { type: "fill-blank", prompt: "Where did the wooden ladder lead?", sentence: "The ladder led up to a hidden ___.", blank: "treehouse", answer: "treehouse", options: ["treehouse", "cave", "boat", "tunnel"] },
        { type: "match-definition", prompt: "What does 'hidden' mean in this story?", word: "hidden", definition: "kept out of sight where others cannot easily see it", options: ["hidden", "broken", "bright", "tall"] },
        { type: "arrange", prompt: "Put the story event in order", sentence: "Leo climbed carefully up every wooden step" },
      ]),
      L("r-story2", "The Brave Little Fox", "Reading & Inference", "bibi", [
        { type: "read-aloud", prompt: "Read with expression", sentence: "Although the river was wide, Pip took a deep breath and jumped across." },
        { type: "fill-blank", prompt: "How did Pip feel before jumping?", sentence: "Pip was nervous because the river was very ___.", blank: "wide", answer: "wide", options: ["wide", "shallow", "dry", "frozen"] },
        { type: "match-definition", prompt: "What does 'brave' mean?", word: "brave", definition: "showing courage and ready to face danger without fear", options: ["brave", "sleepy", "angry", "clumsy"] },
        { type: "arrange", prompt: "Order the outcome", sentence: "All his woodland friends cheered with joy" },
      ]),
      L("r-story3", "A Rainy Day Adventure", "Context Clues", "bibi", [
        { type: "read-aloud", prompt: "Read aloud clearly", sentence: "Rain tapped gently against the windowpane while Maya opened her favourite mystery book." },
        { type: "fill-blank", prompt: "What sound did the rain make?", sentence: "The rain ___ gently against the windowpane.", blank: "tapped", answer: "tapped", options: ["tapped", "shouted", "crashed", "slept"] },
        { type: "match-definition", prompt: "What is a 'mystery'?", word: "mystery", definition: "something strange or unknown that needs to be solved", options: ["mystery", "recipe", "game", "picture"] },
        { type: "arrange", prompt: "Put the sentence in order", sentence: "Maya curled up with a warm woolen blanket" },
      ]),
    ],
  },

  // ── LEVEL 5: Grammar Garden (Parts of Speech, Tenses, Conjunctions) ─────────────
  {
    id: 5,
    name: "Grammar Garden",
    blurb: "Master past vs present tense, adjectives, adverbs and conjunctions.",
    tone: "secondary",
    lessons: [
      L("g-tenses", "Past, Present & Future Tenses", "Verb Tenses", "kiko", [
        { type: "fill-blank", prompt: "Yesterday: choose the past tense verb", sentence: "Yesterday, she ___ five miles in the morning.", blank: "ran", answer: "ran", options: ["ran", "runs", "run", "running"] },
        { type: "fill-blank", prompt: "Tomorrow: choose the future tense", sentence: "Tomorrow, our class ___ the science museum.", blank: "will visit", answer: "will visit", options: ["will visit", "visited", "visits"] },
        { type: "match-definition", prompt: "Which is the past tense of 'catch'?", word: "caught", definition: "past tense form of the verb catch", options: ["caught", "catched", "catch", "catching"] },
        { type: "arrange", prompt: "Arrange into a past-tense sentence", sentence: "They played football until the sun set" },
      ]),
      L("g-adj-adv", "Adjectives & Adverbs", "Descriptive Words", "kiko", [
        { type: "match-definition", prompt: "Which word is an adverb (how an action is done)?", word: "quickly", definition: "describes an action done with great speed", options: ["quickly", "quick", "quicker", "quickness"] },
        { type: "fill-blank", prompt: "Choose the adjective that describes the noun", sentence: "The ___ kitten napped inside the soft basket.", blank: "playful", answer: "playful", options: ["playful", "playfully", "play", "played"] },
        { type: "fill-blank", prompt: "Choose the adverb describing how he sang", sentence: "He sang ___ during the school concert.", blank: "beautifully", answer: "beautifully", options: ["beautifully", "beauty", "beautiful"] },
        { type: "arrange", prompt: "Put this descriptive sentence together", sentence: "The ferocious lion roared very loudly" },
      ]),
      L("g-conjunctions", "Connecting Ideas: And, But, Because, So", "Conjunctions", "kiko", [
        { type: "fill-blank", prompt: "Join the clauses showing reason", sentence: "We wore raincoats ___ it began to pour heavily.", blank: "because", answer: "because", options: ["because", "or", "so", "but"] },
        { type: "fill-blank", prompt: "Join the clauses showing contrast", sentence: "I wanted to play outside ___ it was too dark.", blank: "but", answer: "but", options: ["but", "and", "because", "so"] },
        { type: "arrange", prompt: "Connect the complete sentence", sentence: "She studied hard so she passed the exam" },
        { type: "fill-blank", prompt: "Choose the conjunction showing addition", sentence: "I packed an apple ___ a sandwich in my bag.", blank: "and", answer: "and", options: ["and", "but", "so", "because"] },
      ]),
    ],
  },

  // ── LEVEL 6: Spelling Studio (Silent Letters, Plurals, Suffixes) ─────────────────
  {
    id: 6,
    name: "Spelling Studio",
    blurb: "Tackle silent letters, irregular plurals, and tricky suffixes.",
    tone: "primary",
    lessons: [
      L("sp-silent", "Silent Letters: Kn, Wr, Mb", "Silent Letters", "nova", [
        { type: "listen-select", prompt: "Listen for the silent 'k': 'knee'", word: "knee", options: ["knee", "nee", "key", "kin"] },
        { type: "missing-letter", prompt: "Spell 'write' with silent 'w'", pattern: "_rite", full: "write", answer: "w", options: ["w", "r", "l", "m"] },
        { type: "build-word", prompt: "Spell the word 'climb' with silent 'b'", word: "climb", tiles: ["b", "m", "c", "l", "i"] },
        { type: "missing-letter", prompt: "Spell 'knife' with silent 'k'", pattern: "_nife", full: "knife", answer: "k", options: ["k", "n", "c", "s"] },
        { type: "listen-select", prompt: "Which spelling is correct for 'thumb'?", word: "thumb", options: ["thumb", "thum", "thome"] },
      ]),
      L("sp-plurals", "Tricky Plurals: -es, -ies, Irregulars", "Plural Endings", "nova", [
        { type: "fill-blank", prompt: "Plural of 'baby' (y changes to ies)", sentence: "Both ___ were sleeping peacefully in the crib.", blank: "babies", answer: "babies", options: ["babies", "babys", "babyies"] },
        { type: "fill-blank", prompt: "Plural of 'leaf' (f changes to ves)", sentence: "The autumn ___ turned bright red and gold.", blank: "leaves", answer: "leaves", options: ["leaves", "leafs", "leafes"] },
        { type: "match-definition", prompt: "What is the plural of 'child'?", word: "children", definition: "more than one young human being", options: ["children", "childs", "childrens"] },
        { type: "build-word", prompt: "Spell the irregular plural 'teeth'", word: "teeth", tiles: ["th", "ee", "t"] },
      ]),
      L("sp-suffixes", "Suffixes: -ful, -less, -ly, -ment", "Word Endings", "nova", [
        { type: "match-definition", prompt: "What does 'careless' mean?", word: "careless", definition: "not showing care or attention", options: ["careless", "careful", "caring", "uncaring"] },
        { type: "fill-blank", prompt: "Add suffix -ful to 'help'", sentence: "She was very ___ when cleaning up the classroom.", blank: "helpful", answer: "helpful", options: ["helpful", "helpless", "helply"] },
        { type: "build-word", prompt: "Spell 'excitement'", word: "excitement", tiles: ["ment", "cite", "ex"] },
        { type: "missing-letter", prompt: "Complete 'hopeless' with suffix", pattern: "hope____", full: "hopeless", answer: "less", options: ["less", "ful", "ment"] },
      ]),
    ],
  },

  // ── LEVEL 7: Speaking Studio (Intonation, Clarity & Complex Phrases) ────────────
  {
    id: 7,
    name: "Speaking Studio",
    blurb: "Master voice modulation, clarity, and paragraph articulation.",
    tone: "accent",
    lessons: [
      L("sp-intonation", "Question vs Statement Intonation", "Voice Melody", "tara", [
        { type: "read-aloud", prompt: "Read with rising pitch at the end for this question", sentence: "Are you excited about the weekend camping trip?" },
        { type: "read-aloud", prompt: "Read firmly with falling pitch for this statement", sentence: "We are leaving tomorrow morning at eight o'clock." },
        { type: "arrange", prompt: "Build an expressive question", sentence: "Why did the little penguin dive into the icy water" },
        { type: "fill-blank", prompt: "Select the polite opening phrase", sentence: "___ I please borrow your green pencil for a moment?", blank: "Could", answer: "Could", options: ["Could", "Must", "Will"] },
      ]),
      L("sp-articulate", "Tongue Twisters & Complex Sounds", "Clear Articulation", "tara", [
        { type: "read-aloud", prompt: "Speak smoothly and clearly without rushing", sentence: "Six slippery snails slid slowly down the slick stone." },
        { type: "read-aloud", prompt: "Emphasize each consonant crisply", sentence: "Fresh fried fish from the cool blue sea." },
        { type: "arrange", prompt: "Put this articulate sentence in order", sentence: "Peter packed plenty of crisp purple plums" },
        { type: "read-aloud", prompt: "Deliver this tongue twister with confidence", sentence: "Blue bright butterflies flutter by beautiful flowers." },
      ]),
    ],
  },

  // ── LEVEL 8: Story Explorer (Multi-Character Dialogues & Sequencing) ────────────
  {
    id: 8,
    name: "Story Explorer",
    blurb: "Decipher complex character motivations, conflict, and resolution.",
    tone: "sun",
    lessons: [
      L("st-mystery", "The Mystery of the Missing Compass", "Story Sequencing", "bibi", [
        { type: "read-aloud", prompt: "Read the mystery clue aloud", sentence: "Nova inspected the control deck and spotted tiny paw prints near the navigation compass." },
        { type: "fill-blank", prompt: "What clue did Nova discover on the deck?", sentence: "Nova found tiny paw prints near the ___.", blank: "compass", answer: "compass", options: ["compass", "engine", "window", "rocket"] },
        { type: "match-definition", prompt: "What is an 'investigation'?", word: "investigation", definition: "a careful search or examination to discover the truth", options: ["investigation", "invention", "instruction", "invitation"] },
        { type: "arrange", prompt: "Order the timeline of events", sentence: "Milo admitted he borrowed the compass to explore the stars" },
      ]),
      L("st-adventure", "Journey to Whispering Peak", "Plot Resolution", "bibi", [
        { type: "read-aloud", prompt: "Narrate the climax with feeling", sentence: "Together, Tara and Kiko reached the summit just as the golden sunrise broke through the mist." },
        { type: "fill-blank", prompt: "What broke through the morning mist?", sentence: "A golden ___ broke through the mountain mist.", blank: "sunrise", answer: "sunrise", options: ["sunrise", "storm", "avalanche", "cloud"] },
        { type: "match-definition", prompt: "What does 'summit' mean?", word: "summit", definition: "the highest point or peak of a mountain", options: ["summit", "valley", "cave", "forest"] },
        { type: "arrange", prompt: "Reconstruct the moral of the adventure", sentence: "Courage and teamwork helped them overcome every steep hill" },
      ]),
    ],
  },

  // ── LEVEL 9: Confident Communicator (Idioms, Debate, Everyday Realism) ──────────
  {
    id: 9,
    name: "Confident Communicator",
    blurb: "Express opinions, understand common idioms, and debate politely.",
    tone: "primary",
    lessons: [
      L("cc-idioms", "Common English Idioms", "Figurative Language", "nova", [
        { type: "match-definition", prompt: "What does 'piece of cake' mean?", word: "piece of cake", definition: "something that is extremely easy and simple to accomplish", options: ["piece of cake", "break a leg", "under the weather"] },
        { type: "fill-blank", prompt: "Choose the idiom meaning 'raining heavily'", sentence: "Take an umbrella because it is raining ___ outside!", blank: "cats and dogs", answer: "cats and dogs", options: ["cats and dogs", "fish and frogs", "birds and bees"] },
        { type: "match-definition", prompt: "What does 'once in a blue moon' mean?", word: "once in a blue moon", definition: "an event that happens very rarely", options: ["once in a blue moon", "spill the beans", "bite the bullet"] },
        { type: "read-aloud", prompt: "Use an idiom in conversation", sentence: "Don't judge a book by its cover until you read the first chapter." },
      ]),
      L("cc-debate", "Polite Opinions & Disagreements", "Expressing Viewpoints", "nova", [
        { type: "read-aloud", prompt: "State your opinion respectfully", sentence: "In my opinion, reading books encourages creativity more than watching television." },
        { type: "fill-blank", prompt: "Choose the polite phrase to disagree", sentence: "___, but I see this situation from a different perspective.", blank: "I understand your point", answer: "I understand your point", options: ["I understand your point", "You are wrong", "That makes no sense"] },
        { type: "arrange", prompt: "Structure a balanced argument", sentence: "While I agree with your idea I think we should plan carefully" },
        { type: "read-aloud", prompt: "Deliver this persuasive conclusion", sentence: "Thank you for listening to my thoughts, and I look forward to hearing your perspective." },
      ]),
    ],
  },

  // ── LEVEL 10: Paragraph Architect (Topic Sentences, Sequencing & Transition Words) ──
  {
    id: 10,
    name: "Paragraph Architect",
    blurb: "Structure engaging paragraphs with clear topic sentences and transitions.",
    tone: "secondary",
    lessons: [
      L("p-structure", "The Anatomy of a Paragraph", "Topic & Supporting Sentences", "bibi", [
        {
          type: "paragraph-order",
          prompt: "Arrange the sentences in logical order (Topic ➔ Detail ➔ Conclusion)",
          title: "How Honeybees Help Flowers",
          sentences: [
            "As they fly between petals, they spread yellow pollen so new plants can grow.",
            "In conclusion, honeybees play a vital role in keeping our world green.",
            "Honeybees are essential helpers in nature because they pollinate blooming flowers.",
            "Inside the hive, bees turn collected sweet nectar into golden honey."
          ],
          solution: [
            "Honeybees are essential helpers in nature because they pollinate blooming flowers.",
            "As they fly between petals, they spread yellow pollen so new plants can grow.",
            "Inside the hive, bees turn collected sweet nectar into golden honey.",
            "In conclusion, honeybees play a vital role in keeping our world green."
          ]
        },
        {
          type: "fill-blank",
          prompt: "Select the most effective transition word showing contrast",
          sentence: "Many people think deserts are lifeless. ___, dozens of unique creatures thrive there.",
          blank: "However",
          answer: "However",
          options: ["However", "Furthermore", "Because", "Likewise"]
        },
        {
          type: "match-definition",
          prompt: "What is a 'topic sentence'?",
          word: "topic sentence",
          definition: "the sentence that introduces the main idea of a paragraph",
          options: ["topic sentence", "concluding sentence", "supporting detail", "rhyme scheme"]
        },
        {
          type: "arrange",
          prompt: "Arrange this cohesive concluding sentence",
          sentence: "For these reasons regular exercise keeps our minds and bodies healthy"
        }
      ]),
      L("p-transitions", "Transition Words & Cohesion", "Paragraph Linking", "kiko", [
        {
          type: "fill-blank",
          prompt: "Choose the transition word that shows sequence",
          sentence: "First, prepare your ingredients. ___, preheat the oven to three hundred degrees.",
          blank: "Next",
          answer: "Next",
          options: ["Next", "Although", "Despite", "Because"]
        },
        {
          type: "fill-blank",
          prompt: "Choose the transition word showing addition",
          sentence: "The museum has ancient dinosaur fossils. ___, it features an interactive space planetarium.",
          blank: "In addition",
          answer: "In addition",
          options: ["In addition", "Instead", "Unless", "Whereas"]
        },
        {
          type: "paragraph-order",
          prompt: "Organize the baking steps into a cohesive procedural paragraph",
          title: "How to Bake Golden Bread",
          sentences: [
            "Baking homemade bread requires patience and accurate timing.",
            "After rising, bake the loaf until the crust turns crisp and golden brown.",
            "First, mix yeast, warm water, and flour into a smooth dough.",
            "Next, knead the dough thoroughly and allow it to double in size."
          ],
          solution: [
            "Baking homemade bread requires patience and accurate timing.",
            "First, mix yeast, warm water, and flour into a smooth dough.",
            "Next, knead the dough thoroughly and allow it to double in size.",
            "After rising, bake the loaf until the crust turns crisp and golden brown."
          ]
        },
        {
          type: "read-aloud",
          prompt: "Read this well-structured persuasive paragraph aloud",
          sentence: "Reading every day expands your imagination, improves vocabulary, and builds confident writing skills."
        }
      ]),
    ],
  },

  // ── LEVEL 11: Poetry & Verse (Stanzas, Rhyme Schemes, Metaphors & Imagery) ────
  {
    id: 11,
    name: "Poetry & Verse",
    blurb: "Analyze rhythm, rhyme schemes, similes, metaphors, and sensory imagery.",
    tone: "sun",
    lessons: [
      L("po-rhyme-meter", "Rhyme Scheme & Stanza Rhythm", "Poetic Structure", "bibi", [
        {
          type: "poem-rhyme",
          prompt: "Analyze the AABB rhyme scheme in this poem",
          title: "The Silver Moon",
          stanzas: [
            "The silver moon begins to rise,",
            "Across the quiet midnight skies.",
            "The sleepy owls begin to peep,",
            "While all the forest falls asleep."
          ],
          question: "Which word rhymes with 'rise' in the first stanza?",
          answer: "skies",
          options: ["skies", "peep", "moon", "asleep"]
        },
        {
          type: "poem-rhyme",
          prompt: "Analyze the ABAB rhyme scheme",
          title: "The Autumn Wind",
          stanzas: [
            "The golden leaves begin to fall,",
            "The morning breeze is sharp and chill.",
            "A crow gives out a noisy call,",
            "Across the silent misty hill."
          ],
          question: "Which line ending rhymes with 'chill'?",
          answer: "hill",
          options: ["hill", "call", "fall", "misty"]
        },
        {
          type: "match-definition",
          prompt: "What is a 'stanza' in poetry?",
          word: "stanza",
          definition: "a group of lines forming a distinct unit in a poem",
          options: ["stanza", "paragraph", "chapter", "chorus"]
        },
        {
          type: "read-aloud",
          prompt: "Recite these rhythmic lines with poetic cadence",
          sentence: "Dancing shadows on the lawn, disappear before the dawn."
        }
      ]),
      L("po-figurative", "Similes, Metaphors & Personification", "Figurative Language", "bibi", [
        {
          type: "match-definition",
          prompt: "Which phrase is a simile (compares using 'as' or 'like')?",
          word: "as brave as a lion",
          definition: "a comparison using like or as to emphasize courage",
          options: ["as brave as a lion", "the moon was cheese", "the wind screamed", "time is money"]
        },
        {
          type: "match-definition",
          prompt: "Which poetic device gives human qualities to nature?",
          word: "personification",
          definition: "attributing human actions or traits to non-human things",
          options: ["personification", "alliteration", "onomatopoeia", "rhyme"]
        },
        {
          type: "poem-rhyme",
          prompt: "Identify the sensory imagery and metaphor",
          title: "The Ocean's Roar",
          stanzas: [
            "The angry ocean roared all night,",
            "Its crashing waves were beasts of white.",
            "Until the morning brought relief,",
            "And gentle tides touched coral reef."
          ],
          question: "What human action does the poet give to the ocean in line 1?",
          answer: "roared",
          options: ["roared", "beasts", "relief", "reef"]
        },
        {
          type: "fill-blank",
          prompt: "Complete the vivid simile",
          sentence: "The runner was as fast as ___ as she sprinted across the finish line.",
          blank: "lightning",
          answer: "lightning",
          options: ["lightning", "a snail", "a rock", "a turtle"]
        }
      ]),
    ],
  },

  // ── LEVEL 12: Master of English (Punctuation, Direct Speech & Complex Clauses) ──
  {
    id: 12,
    name: "Master of English",
    blurb: "Master punctuation marks, dialogue quotation rules, and subordinate clauses.",
    tone: "accent",
    lessons: [
      L("gr-dialogue-punct", "Speech Marks & Punctuation", "Punctuation Rules", "kiko", [
        {
          type: "grammar-fix",
          prompt: "Identify the properly punctuated sentence with speech marks",
          sentenceWithMistake: "i love exploring said maya with a smile",
          correctSentence: "\"I love exploring!\" said Maya with a smile.",
          explanation: "Speech marks enclose spoken words, with proper capitalization and internal punctuation.",
          options: [
            "\"I love exploring!\" said Maya with a smile.",
            "I love exploring said Maya with a smile.",
            "\"I love exploring said Maya with a smile.\"",
            "\"i love exploring\" Said maya with a smile."
          ]
        },
        {
          type: "grammar-fix",
          prompt: "Fix the punctuation and apostrophe error",
          sentenceWithMistake: "the dogs bone was missing from its bowl",
          correctSentence: "The dog's bone was missing from its bowl.",
          explanation: "Singular possessive nouns require an apostrophe before the 's'.",
          options: [
            "The dog's bone was missing from its bowl.",
            "The dogs' bone was missing from its bowl.",
            "The dogs bone was missing from it's bowl.",
            "The dog's bone was missing from it's bowl."
          ]
        },
        {
          type: "match-definition",
          prompt: "What is an 'apostrophe' used for in 'don't'?",
          word: "contraction",
          definition: "shortening a word by replacing missing letters with an apostrophe",
          options: ["contraction", "possession", "quotation", "comma"]
        },
        {
          type: "fill-blank",
          prompt: "Select the correct punctuation mark for an abrupt pause",
          sentence: "Wait___did you hear that strange rustling in the attic?",
          blank: "—",
          answer: "—",
          options: ["—", ".", ";", "/"]
        }
      ]),
      L("gr-complex-clauses", "Relative Clauses & Subordination", "Advanced Syntax", "kiko", [
        {
          type: "fill-blank",
          prompt: "Choose the correct relative pronoun referring to a person",
          sentence: "The courageous astronaut ___ repaired the satellite returned safely.",
          blank: "who",
          answer: "who",
          options: ["who", "which", "whose", "where"]
        },
        {
          type: "fill-blank",
          prompt: "Choose the relative pronoun referring to an object or place",
          sentence: "We visited the ancient library ___ housed thousands of handwritten scrolls.",
          blank: "which",
          answer: "which",
          options: ["which", "who", "whom", "whose"]
        },
        {
          type: "grammar-fix",
          prompt: "Identify the sentence with correct subject-verb agreement in a complex clause",
          sentenceWithMistake: "the box of colorful markers are on the teacher's desk",
          correctSentence: "The box of colorful markers is on the teacher's desk.",
          explanation: "The singular subject 'box' takes the singular verb 'is', regardless of intervening plural words.",
          options: [
            "The box of colorful markers is on the teacher's desk.",
            "The box of colorful markers are on the teacher's desk.",
            "The box of colorful markers were on the teacher's desk.",
            "The boxes of colorful marker is on the teacher's desk."
          ]
        },
        {
          type: "arrange",
          prompt: "Assemble this complex sentence with an introductory dependent clause",
          sentence: "Although it rained heavily the resilient hikers reached their campsite before sunset"
        }
      ]),
    ],
  },
];

export const ALL_LESSONS = LEVELS.flatMap((l) => l.lessons.map((ls) => ({ ...ls, level: l.id })));
export const getLesson = (id: string) => ALL_LESSONS.find((l) => l.id === id);
