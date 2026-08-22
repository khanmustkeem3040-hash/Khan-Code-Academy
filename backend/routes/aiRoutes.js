const express = require('express');
const router = express.Router();
require('dotenv').config();
const { GoogleGenAI } = require('@google/genai');

// Official Google GenAI Client Initialization
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
    console.error("❌ ERROR: .env file me GEMINI_API_KEY nahi mili!");
}
const ai = new GoogleGenAI({ apiKey: apiKey });

// 🛡️ Automatic Multi-Model Fallback System (Updated Models)
async function generateWithRetry(prompt, retries = 2) {
    const modelList = [
        'gemini-3.6-flash',
        'gemini-3.1-flash-lite',
        'gemini-2.5-flash-lite'
    ];

    for (const modelName of modelList) {
        for (let attempt = 1; attempt <= retries; attempt++) {
            try {
                return await ai.models.generateContent({
                    model: modelName,
                    contents: prompt,
                });
            } catch (error) {
                console.warn(`[Gemini API] ${modelName} failed (Attempt ${attempt}): ${error.message}`);
                
                const is503 = error.status === 503 || (error.message && error.message.includes('503'));
                if (is503 && attempt < retries) {
                    await new Promise(resolve => setTimeout(resolve, 1500 * attempt));
                } else {
                    break; 
                }
            }
        }
    }

    throw new Error("Sare AI models abhi busy hain ya daily limit cross ho gayi hai. Kripya kuch samay baad dobara try karein.");
}

// 🌐 Language Prompt Helper
function getLanguageInstruction(userLang) {
    const lang = userLang || 'English';
    return `
CRITICAL LANGUAGE INSTRUCTION:
You MUST write all explanations, headings, breakdowns, visual intuition, and conceptual guides strictly in "${lang}" language.
- If language is "Hinglish", write naturally in Hindi using Roman English script (e.g., "OOPs ek programming paradigm hai jisme hum real-world entities ko objects ke roop me model karte hain...").
- If language is "Hindi", write strictly in Devanagari script.
- Keep standard technical terms, variable names, syntax, and code intact.
`;
}

// ==========================================
// 1. ROUTE: GENERATE QUICK NOTES
// ==========================================
router.post('/generate-notes', async (req, res) => {
    try {
        const { language, userLang } = req.body;
        const selectedLanguage = userLang || 'English';

        const isWebFrontend = ['HTML', 'CSS', 'JavaScript', 'JS'].includes(language);
        const isBackendReact = ['Node', 'Node.js', 'Express', 'Express.js', 'React', 'React.js'].includes(language);
        const isDatabase = ['MongoDB', 'SQL', 'MySQL', 'PostgreSQL'].includes(language);

        let prompt = `You are the Lead Technical Instructor at Khan Code Academy.
Generate a comprehensive, zero-to-hero course for "${language}".

${getLanguageInstruction(selectedLanguage)}

CRITICAL MARKDOWN ESCAPING RULE:
Whenever you mention ANY HTML tag name inside plain text explanations (such as <div>, <span>, <h1>, <p>, <a>, <img />, etc.), YOU MUST ALWAYS WRAP IT IN BACKTICKS (e.g. \`<div>\`, \`<span>\`, \`<h1>\`, \`<p>\`, \`<a>\`, \`<img />\`). 
NEVER write bare HTML tags like <div> or <span> in normal paragraph text, otherwise the renderer hides them.

HEADER AT THE TOP:
# 🚀 Welcome to Khan Code Academy
## Complete ${language} Zero to Hero Course (${selectedLanguage})
---
`;

        if (isWebFrontend) {
            prompt += `
STRICT RULES FOR HTML/CSS/JS:
1. ALWAYS use backticks for tags in text, like \`<div>\`, \`<span>\`, \`<h1>\`, \`<a>\`, \`<input>\`, \`<table>\`.
2. Every full code example MUST be wrapped in \`\`\`html or \`\`\`css or \`\`\`javascript code block.

${language === 'HTML' ? `
STRUCTURE FOR HTML:
### SECTION 1: VS CODE SETUP & SHORTCUTS
- VS Code setup & \`index.html\` creation.
- Boilerplate Shortcut: Type \`!\` or \`html:5\` and press Enter/Tab.
- Shortcuts: \`Ctrl + S\`, Live Server usage.

### SECTION 2: PHASE 1 - ZERO (Basic Tags & Anatomy)
- Explain Opening Tag (\`<h1>\`), Closing Tag (\`</h1>\`), Content, and Self-Closing Tags (\`<br>\`, \`<hr>\`).
- Explain Headings: \`<h1>\` to \`<h6>\` with clear examples.
- Explain Paragraph \`<p>\`, Bold \`<strong>\`, Italic \`<em>\`, Break \`<br>\`, Horizontal Rule \`<hr>\`.
- Provide 1 complete runnable code snippet inside \`\`\`html block.

### SECTION 3: PHASE 2 - RISING STAR (Links, Images, Lists & Attributes)
- Explain Attribute Syntax: \`<tag attribute="value">\`.
- Explain \`<a>\` tag with \`href\` attribute and \`target="_blank"\`.
- Explain \`<img>\` tag with \`src\` and \`alt\` attributes.
- Explain \`<ul>\`, \`<ol>\`, and \`<li>\` list tags.
- Provide 1 complete runnable code snippet inside \`\`\`html block.

### SECTION 4: PHASE 3 - INTERMEDIATE (Forms & Tables)
- Explain \`<form>\` with attributes (\`action\`, \`method\`).
- Explain \`<input>\` with types (\`type="text"\`, \`type="email"\`, \`type="password"\`, \`type="radio"\`, \`type="checkbox"\`, \`type="submit"\`) and attributes.
- Explain \`<label>\` and \`<button>\`.
- Explain \`<table>\`, \`<tr>\`, \`<th>\`, \`<td>\`, \`colspan\`, \`rowspan\`.
- Provide 1 complete runnable code snippet inside \`\`\`html block.

### SECTION 5: PHASE 4 - HERO (Semantic HTML5 & Media)
- Explain Semantic Tags vs \`<div>\`/\`<span>\`: \`<header>\`, \`<nav>\`, \`<main>\`, \`<section>\`, \`<article>\`, \`<footer>\`.
- Explain \`<video controls>\` and \`<audio controls>\`.
- Provide 1 complete HTML5 layout code snippet inside \`\`\`html block.
` : ''}

${language === 'CSS' ? `
STRUCTURE FOR CSS:
- Show 3 ways to add CSS: Inline (\`style="..."\`), Internal (\`<style>\`), External (\`<link rel="stylesheet" href="styles.css">\`).
- Universal selector (\`*\`), Tag selector, Class selector (\`.class\`), ID selector (\`#id\`).
- Properties, Box Model (\`margin\`, \`padding\`, \`border\`, \`box-sizing\`), Flexbox, Grid, Hover effects.
` : ''}

${language === 'JS' || language === 'JavaScript' ? `
STRUCTURE FOR JS:
- Show how to link JS: Internal (\`<script>\`) and External (\`<script src="script.js">\`).
- Variables (\`let\`, \`const\`, \`var\`), Operators, Conditionals (\`if-else\`), Functions, DOM Manipulation, Async/Await.
` : ''}
`;
        } else if (isBackendReact) {
            prompt += `
STRICT RULES FOR NODE / EXPRESS / REACT:
1. Provide step-by-step setup (NPM init, package installations, folder structure).
2. For React: Cover Components, JSX, Props, State (useState), Hooks (useEffect), and Event Handling.
3. For Node/Express: Cover Server Setup, REST API Routes (GET, POST, PUT, DELETE), Middleware, and Async Handling.
4. Every code example MUST be complete and wrapped in \`\`\`javascript code block.
`;
        } else if (isDatabase) {
            prompt += `
STRICT RULES FOR DATABASES (${language}):
1. Cover Core Concepts: CRUD Operations (Create, Read, Update, Delete).
2. For MongoDB: Explain Schemas, Models, Mongoose Connection, Aggregation, and Queries.
3. For SQL/MySQL/PostgreSQL: Explain Tables, Primary/Foreign Keys, Queries (SELECT, INSERT, UPDATE, DELETE), JOINs, and Grouping.
4. Provide clear executable Query / Code Blocks with sample data examples.
`;
        } else {
            prompt += `
STRICT STRUCTURE RULES FOR ${language} (C, C++, Java, Python):
1. **Hello World Program Section**: Complete code + Expected Output + Line-by-Line Breakdown.
2. **Sequential Numbered Topics (1 to 11)**:
   1. Variables & Data Types + Input/Output
   2. Instructions & Operators
   3. Conditional Statements & Switch Case
   4. Loop Control Statements
   5. Functions & Recursion
   6. Pointers (or Memory Model)
   7. Arrays
   8. Strings
   9. Structures (or Classes/Objects)
   10. File I/O
   11. Dynamic Memory Allocation

For EVERY topic: Concept Explanation + Complete Code + **Expected Output** + Line-by-Line Breakdown.
`;
        }

        const response = await generateWithRetry(prompt);
        res.json({ success: true, language, content: response.text });

    } catch (error) {
        console.error("Gemini Notes Error:", error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// ==========================================
// 2. ROUTE: GENERATE BASIC CONCEPTS & DSA (FIXED LANGUAGE SUPPORT)
// ==========================================
router.post('/generate-basics', async (req, res) => {
    try {
        let { category, topic, userLang } = req.body;
        const selectedLanguage = userLang || 'Hinglish';

        let prompt = `You are the Lead Computer Science Instructor at Khan Code Academy.\n`;
        prompt += `${getLanguageInstruction(selectedLanguage)}\n`;

        const isDSA = category === 'DSA' || (topic && topic.includes('Data Structures'));

        if (isDSA) {
            prompt += `Provide an In-Depth, Zero-to-Hero Complete Data Structures & Algorithms (DSA) Masterclass in ${selectedLanguage}.

COVER ALL TOPICS SEQUENTIALLY FROM ZERO TO HERO:
1. 🚀 Visual Intuition & Core Explanation of Data Structures & Algorithms
2. ⏱️ Time and Space Complexity Analysis (Big-O Notation)
3. 📦 Linear Data Structures:
   - Arrays & Strings
   - Linked Lists (Singly, Doubly, Circular)
   - Stacks & Queues
   - Hash Maps / Hash Tables
4. 🌳 Non-Linear & Advanced Data Structures:
   - Trees (Binary Tree, Binary Search Tree)
   - Heaps / Priority Queues
   - Graphs (Adjacency Matrix & List)
5. ⚡ Core Algorithms:
   - Searching: Linear & Binary Search
   - Two Pointers & Sliding Window Techniques
   - Recursion & Backtracking
   - Graph Algorithms: BFS & DFS
   - Dynamic Programming (DP: Top-down Memoization & Bottom-up Tabulation)

For EVERY main section, provide:
- Clear Explanation in ${selectedLanguage}
- Complete Executable Code Snippet (in C++ or Python)
- Expected Output
- Line-by-Line Breakdown in ${selectedLanguage}`;
        } else {
            prompt += `Provide an In-Depth, Zero-to-Hero Complete Object-Oriented Programming (OOPs) Masterclass in ${selectedLanguage}.

COVER ALL OOPS TOPICS SEQUENTIALLY WITH FULL CODE EXAMPLES:
1. 🚀 Introduction to OOPs vs Procedural Programming
2. 🏗️ Classes and Objects (Instance creation, Attributes, Methods)
3. ⚙️ Constructors and Destructors (Default, Parameterized, Copy Constructors, Destructor cleanup)
4. 🛡️ Pillar 1: Encapsulation (Access Modifiers: Public, Private, Protected, Getters & Setters)
5. 🎯 Pillar 2: Abstraction (Abstract Classes, Pure Virtual Functions / Interfaces)
6. 🧬 Pillar 3: Inheritance (Explain ALL Types with Code Examples):
   - Single Inheritance
   - Multilevel Inheritance
   - Multiple Inheritance
   - Hierarchical Inheritance
   - Hybrid Inheritance
7. 🎭 Pillar 4: Polymorphism:
   - Compile-time (Method/Function Overloading & Operator Overloading)
   - Run-time (Method Overriding using Virtual Functions)
8. ⚡ Best Practices, Common Pitfalls & Real-World Project Architecture

For EVERY section, provide:
- Detailed Concept Explanation in ${selectedLanguage}
- Complete Executable Code Snippet (C++ or Python)
- Expected Output
- Line-by-Line Code Breakdown in ${selectedLanguage}`;
        }

        const response = await generateWithRetry(prompt);
        res.json({ success: true, content: response.text });
    } catch (error) {
        console.error("Gemini Basics Error:", error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// ==========================================
// 3. ROUTE: GENERATE SEQUENTIAL QUIZ (JSON)
// ==========================================
router.post('/generate-quiz', async (req, res) => {
    try {
        const { language, userLang } = req.body;
        const selectedLanguage = userLang || 'Hinglish';

        const prompt = `Generate 5 multiple-choice quiz questions for "${language}".
The Question text and Explanation MUST be strictly written in: ${selectedLanguage}.

You MUST respond strictly with a valid JSON array of objects. NO Markdown, NO markdown backticks, NO extra text.
Format required:
[
  {
    "question": "Question text in ${selectedLanguage}?",
    "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
    "answer": "Option 1",
    "explanation": "Why Option 1 is correct in ${selectedLanguage}."
  }
]`;

        const response = await generateWithRetry(prompt);
        const cleanJson = response.text.replace(/```json/gi, '').replace(/```/g, '').trim();
        const questions = JSON.parse(cleanJson);

        res.json({ success: true, language, questions });
    } catch (error) {
        console.error("Gemini Quiz Error:", error);
        res.status(500).json({ success: false, error: "Failed to parse quiz response." });
    }
});

// ==========================================
// 4. ROUTE: PRACTICE CODE COMPILER ENGINE
// ==========================================
router.post('/run-code', async (req, res) => {
    try {
        const { language, code, userLang } = req.body;
        const selectedLanguage = userLang || 'Hinglish';

        const prompt = `Act as an online code runner and technical analyzer engine.
Technology: ${language}
Language for Feedback/Explanation: ${selectedLanguage}

Source Code:
\`\`\`
${code}
\`\`\`

Provide all explanations strictly in ${selectedLanguage}:
1. Expected Execution Output
2. Compilation / Syntax Error Check
3. Optimization Tip (if any)`;

        const response = await generateWithRetry(prompt);
        res.json({ success: true, output: response.text });
    } catch (error) {
        console.error("Gemini Compiler Error:", error);
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;