export type Question = {
  id: string;
  prompt: string;
  options: string[];
  answer: number; // index
  explanation?: string;
};

export type Module = {
  id: string;
  title: string;
  description: string;
  emoji: string;
  xp: number;
  questions: Question[];
};

export type Grade = {
  id: string;
  title: string;
  ageRange: string;
  tagline: string;
  emoji: string;
  accent: "blue" | "orange" | "violet";
  modules: Module[];
};

export const grades: Grade[] = [
  {
    id: "explorer",
    title: "Explorer",
    ageRange: "Ages 8–10",
    tagline: "First steps into the world of code.",
    emoji: "🚀",
    accent: "blue",
    modules: [
      {
        id: "what-is-code",
        title: "What is Code?",
        description: "Discover how computers follow instructions.",
        emoji: "💡",
        xp: 50,
        questions: [
          {
            id: "q1",
            prompt: "What is a computer program?",
            options: [
              "A type of cake",
              "A set of instructions a computer follows",
              "A kind of game controller",
              "A song",
            ],
            answer: 1,
          },
          {
            id: "q2",
            prompt: "Which of these is a programming language?",
            options: ["English", "Python", "Spanish", "Math"],
            answer: 1,
          },
          {
            id: "q3",
            prompt: "What does a 'bug' mean in coding?",
            options: ["A small insect", "A new feature", "An error in the code", "A computer mouse"],
            answer: 2,
          },
          {
            id: "q4",
            prompt: "What does the 'print' command usually do?",
            options: [
              "Send something to a printer",
              "Show text on the screen",
              "Save a file",
              "Delete a file",
            ],
            answer: 1,
          },
          {
            id: "q5",
            prompt: "Which is the correct order of steps?",
            options: [
              "Write → Run → Fix",
              "Run → Fix → Write",
              "Fix → Write → Run",
              "Write → Fix → Run",
            ],
            answer: 0,
          },
        ],
      },
      {
        id: "loops-magic",
        title: "Loops Magic",
        description: "Make the computer repeat things for you.",
        emoji: "🔁",
        xp: 60,
        questions: [
          {
            id: "q1",
            prompt: "A loop is used to…",
            options: ["Stop the program", "Repeat actions", "Change colors", "Save data"],
            answer: 1,
          },
          {
            id: "q2",
            prompt: "Which keyword often starts a loop?",
            options: ["for", "color", "draw", "stop"],
            answer: 0,
          },
          {
            id: "q3",
            prompt: "If a loop runs 5 times, the action happens…",
            options: ["Once", "Never", "Five times", "Forever"],
            answer: 2,
          },
          {
            id: "q4",
            prompt: "An infinite loop is a loop that…",
            options: ["Runs forever", "Runs once", "Never runs", "Runs randomly"],
            answer: 0,
          },
          {
            id: "q5",
            prompt: "Loops help us…",
            options: ["Avoid repeating code", "Make the screen black", "Crash the computer", "Buy a phone"],
            answer: 0,
          },
        ],
      },
    ],
  },
  {
    id: "builder",
    title: "Builder",
    ageRange: "Ages 11–14",
    tagline: "Build real apps and games.",
    emoji: "🛠️",
    accent: "orange",
    modules: [
      {
        id: "variables-data",
        title: "Variables & Data",
        description: "Store, change, and use information.",
        emoji: "📦",
        xp: 80,
        questions: [
          {
            id: "q1",
            prompt: "A variable is like…",
            options: ["A locked box", "A labeled box for data", "A music file", "A type of error"],
            answer: 1,
          },
          {
            id: "q2",
            prompt: "Which is a valid variable name?",
            options: ["1score", "score!", "score", "score one"],
            answer: 2,
          },
          {
            id: "q3",
            prompt: "What is the data type of \"Hello\"?",
            options: ["Number", "Boolean", "String", "List"],
            answer: 2,
          },
          {
            id: "q4",
            prompt: "What is the result of 7 + 3?",
            options: ["10", "73", "21", "4"],
            answer: 0,
          },
          {
            id: "q5",
            prompt: "true and false are examples of…",
            options: ["Strings", "Booleans", "Numbers", "Loops"],
            answer: 1,
          },
        ],
      },
      {
        id: "functions-power",
        title: "Functions Power",
        description: "Reuse logic with smart functions.",
        emoji: "⚡",
        xp: 90,
        questions: [
          {
            id: "q1",
            prompt: "A function is…",
            options: [
              "A reusable block of code",
              "A type of variable",
              "A web browser",
              "An operating system",
            ],
            answer: 0,
          },
          {
            id: "q2",
            prompt: "Functions help us to…",
            options: ["Repeat work", "Avoid repeating code", "Slow programs", "Delete files"],
            answer: 1,
          },
          {
            id: "q3",
            prompt: "What does a function 'return'?",
            options: ["Nothing ever", "A value back to the caller", "An error always", "A new file"],
            answer: 1,
          },
          {
            id: "q4",
            prompt: "Inputs to a function are called…",
            options: ["Outputs", "Parameters", "Loops", "Files"],
            answer: 1,
          },
          {
            id: "q5",
            prompt: "Calling a function means…",
            options: ["Phoning someone", "Running it", "Deleting it", "Saving it"],
            answer: 1,
          },
        ],
      },
    ],
  },
  {
    id: "innovator",
    title: "Innovator",
    ageRange: "Ages 15–18",
    tagline: "Master modern web & AI fundamentals.",
    emoji: "🧠",
    accent: "violet",
    modules: [
      {
        id: "web-foundations",
        title: "Web Foundations",
        description: "HTML, CSS and how the browser thinks.",
        emoji: "🌐",
        xp: 110,
        questions: [
          {
            id: "q1",
            prompt: "HTML is used for…",
            options: ["Styling a page", "Structuring content", "Making music", "Storing data"],
            answer: 1,
          },
          {
            id: "q2",
            prompt: "Which tag creates a hyperlink?",
            options: ["<link>", "<a>", "<href>", "<url>"],
            answer: 1,
          },
          {
            id: "q3",
            prompt: "CSS controls…",
            options: ["Logic", "Style and layout", "Database", "Network"],
            answer: 1,
          },
          {
            id: "q4",
            prompt: "A responsive design adapts to…",
            options: ["Time of day", "Screen sizes", "User mood", "Battery level"],
            answer: 1,
          },
          {
            id: "q5",
            prompt: "The DOM is…",
            options: [
              "A type of font",
              "An object representation of the page",
              "A backup file",
              "A video format",
            ],
            answer: 1,
          },
        ],
      },
      {
        id: "ai-basics",
        title: "AI Basics",
        description: "Understand how machines learn.",
        emoji: "🤖",
        xp: 130,
        questions: [
          {
            id: "q1",
            prompt: "Machine learning lets computers…",
            options: [
              "Learn from data",
              "Replace electricity",
              "Stop working",
              "Print 3D objects",
            ],
            answer: 0,
          },
          {
            id: "q2",
            prompt: "A dataset is…",
            options: ["A movie", "A collection of data", "A type of code", "A game"],
            answer: 1,
          },
          {
            id: "q3",
            prompt: "Training a model means…",
            options: [
              "Teaching it patterns from examples",
              "Restarting the computer",
              "Drawing icons",
              "Sending emails",
            ],
            answer: 0,
          },
          {
            id: "q4",
            prompt: "An LLM is a…",
            options: [
              "Large Language Model",
              "Light Laser Mode",
              "Linked List Method",
              "Local Logic Machine",
            ],
            answer: 0,
          },
          {
            id: "q5",
            prompt: "Bias in AI usually comes from…",
            options: ["The data", "The keyboard", "The mouse", "The screen"],
            answer: 0,
          },
        ],
      },
    ],
  },
];

export const getGrade = (id: string) => grades.find((g) => g.id === id);
export const getModule = (gradeId: string, moduleId: string) =>
  getGrade(gradeId)?.modules.find((m) => m.id === moduleId);
