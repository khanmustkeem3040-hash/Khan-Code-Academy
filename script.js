let userData = {
    name: "Student",
    selectedLang: "C++",
    selectedFramework: "HTML / CSS / JS"
};

// 🟢 MODERN TOAST NOTIFICATION FUNCTION (No Screen Blocking)
function showToast(message, type = 'success') {
    let toast = document.getElementById('toast-notification');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast-notification';
        document.body.appendChild(toast);
    }

    toast.innerText = message;
    toast.className = `toast-show ${type}`;

    // 3 seconds ke baad apne aap gayab ho jayega
    setTimeout(() => {
        toast.className = toast.className.replace('toast-show', '');
    }, 3000);
}

// Form Handler (Fixed & Verified with Modern Toast)
const form = document.querySelector('form');
if (form) {
    form.addEventListener('submit', async function(event) {
        event.preventDefault();

        const name = document.getElementById('name') ? document.getElementById('name').value.trim() : "";
        const email = document.getElementById('email') ? document.getElementById('email').value.trim() : "";
        const password = document.getElementById('password') ? document.getElementById('password').value.trim() : "";
        const age = document.getElementById('age') ? document.getElementById('age').value.trim() : "";
        const genderSelected = document.querySelector('input[name="gender"]:checked');
        const bio = document.getElementById('bio') ? document.getElementById('bio').value.trim() : "";

        if (!name || !email || !password || !age || !genderSelected || !bio) {
            showToast("⚠️ Please fill all required fields before submitting!", "error");
            return;
        }

        const gender = genderSelected.value;

        // 🚀 DATABASE SAVE WITH SILENT TOAST NOTIFICATION
        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password, age, gender, bio })
            });

            const result = await response.json();

            if (result.success) {
                showToast("🎉 Registration Successful!", "success");
            } else {
                showToast("⚠️ Backend Error: " + (result.error || "Failed to save"), "error");
                return;
            }
        } catch (err) {
            showToast("⚠️ Network Error: Check backend route or server status!", "error");
            console.error("MongoDB Save Error:", err);
            return;
        }

        userData.name = name;
        document.getElementById('form-card').style.display = 'none';
        document.body.classList.add('dashboard-active');
        document.getElementById('learning-dashboard').classList.remove('dashboard-hidden');

        document.getElementById('user-display-name').innerText = name;
        document.getElementById('welcome-msg').innerText = `Welcome to Khan Code Academy, ${name}! 🎉`;
    });
}

// Mode Selection Handler
function selectMode(mode) {
    const contentBox = document.getElementById('content-box');
    const contentArea = document.getElementById('dynamic-content-area');
    const contentTitle = document.getElementById('content-title');

    contentBox.classList.remove('hidden');

    if (mode === 'notes') {
        contentTitle.innerText = "📚 AI Dynamic Notes (Powered by Gemini API)";
        
        const languages = ['C', 'C++', 'Java', 'Python', 'HTML', 'CSS', 'JS', 'Node', 'MongoDB', 'SQL','Express', 'Express.js', 'React', 'React.js', 'PostgreSQL', 'MySQL'];
        
        let navButtons = `
            <div style="display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 25px;">
                ${languages.map(lang => 
                    `<button style="background: #131921; color: #febd69; border: 1px solid #febd69; padding: 10px 18px; border-radius: 6px; cursor: pointer; font-weight: bold;" onclick="fetchAINotes('${lang}')">${lang}</button>`
                ).join('')}
            </div>
            <div id="ai-response-box" style="background: #ffffff; padding: 15px; border-radius: 8px; border: 1px solid #ddd; color: #111; max-width: 100%; overflow-x: hidden;">
                <p style="font-size: 16px; color: #555;">👈 Click any technology above. AI will generate complete end-to-end notes with live code examples!</p>
            </div>`;

        contentArea.innerHTML = navButtons;
    } else if (mode === 'basics') {
        contentTitle.innerText = "🧠 AI Basic Concepts & DSA Masterclass";
        contentArea.innerHTML = `
            <div style="background: #ffffff; padding: 20px; border-radius: 8px; border-left: 5px solid #007185; color: #111; max-width: 100%;">
                <p style="margin-bottom: 15px; font-weight: bold;">Choose a Core Topic to Fetch Detailed AI Explanation:</p>
                <div style="display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 20px;">
                    <button style="background: #007185; color: white; border: none; padding: 10px 16px; border-radius: 6px; cursor: pointer; font-weight: bold;" onclick="fetchAIBasics('DSA', 'Data Structures & Algorithms')">DSA Masterclass</button>
                    <button style="background: #007185; color: white; border: none; padding: 10px 16px; border-radius: 6px; cursor: pointer; font-weight: bold;" onclick="fetchAIBasics('OOPs', 'Object-Oriented Programming')">OOPs Concepts</button>
                </div>
                <div id="ai-basics-box" style="color: #333; line-height: 1.6; max-width: 100%; overflow-x: hidden;">Select a topic above...</div>
            </div>
        `;
    } else if (mode === 'quiz') {
        contentTitle.innerText = "❓ Live AI Quiz Challenge Generator";
        contentArea.innerHTML = `
            <div style="background: #fff; padding: 20px; border-radius: 8px; border-left: 5px solid #16a34a; color: #111; max-width: 100%;">
                <p style="font-size: 15px; margin-bottom: 10px; font-weight: bold;">⚡ Select Language for Live AI Quiz:</p>
                <div style="display: flex; gap: 10px; margin-bottom: 15px; flex-wrap: wrap;">
                    <button style="background: #16a34a; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer;" onclick="fetchAIQuiz('C++')">C++ Quiz</button>
                    <button style="background: #16a34a; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer;" onclick="fetchAIQuiz('Python')">Python Quiz</button>
                    <button style="background: #16a34a; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer;" onclick="fetchAIQuiz('JavaScript')">JavaScript Quiz</button>
                </div>
                <div id="ai-quiz-box" style="margin-top: 15px;"></div>
            </div>
        `;
    } else {
        contentTitle.innerText = "💻 AI Online Code Compiler & Workspace";
        contentArea.innerHTML = `
            <div style="background: #1e293b; color: white; padding: 20px; border-radius: 8px; max-width: 100%;">
                <p style="margin-bottom: 10px; color: #38bdf8; font-weight: bold;">AI Powered Code Workspace:</p>
                <textarea id="code-input" style="width: 100%; height: 120px; background: #0f172a; color: #a7f3d0; padding: 10px; font-family: monospace; border-radius: 6px; border: 1px solid #334155;" placeholder="Write your C++, JS or Python code here..."></textarea>
                <button style="background: #38bdf8; color: #0f172a; border: none; padding: 8px 20px; margin-top: 10px; border-radius: 6px; font-weight: bold; cursor: pointer;" onclick="runAICode()">Run & Analyze Code</button>
                <div id="code-output" style="margin-top: 15px; background: #0f172a; padding: 12px; border-radius: 6px; font-family: monospace; color: #e2e8f0; white-space: pre-wrap; word-break: break-all;">Output will appear here...</div>
            </div>
        `;
    }

    contentBox.scrollIntoView({ behavior: 'smooth' });
}

// Helper to auto-get current dropdown language
function getSelectedUserLanguage() {
    const langSelectElement = document.getElementById('userLangSelect') || document.getElementById('langSelect');
    return langSelectElement ? langSelectElement.value : 'English';
}

// Auto Wrap Fix Helper Function
function applyStrictWrap(container) {
    if (!container) return;
    const elements = container.querySelectorAll('pre, code, div, p');
    elements.forEach(el => {
        el.style.whiteSpace = 'pre-wrap';
        el.style.wordBreak = 'break-all';
        el.style.overflowWrap = 'break-word';
        el.style.maxWidth = '100%';
        el.style.boxSizing = 'border-box';
    });
}

// 📋 SMART COPY BUTTON FEATURE (Clean JS Version - Zero Inline CSS)
function addCopyButtons(container) {
    if (!container) return;

    const codeBlocks = container.querySelectorAll('pre');

    codeBlocks.forEach((pre) => {
        if (pre.querySelector('.copy-btn')) return;

        pre.classList.add('code-wrapper-box');
        
        const btn = document.createElement('button');
        btn.className = 'copy-btn';
        btn.innerText = '📋 Copy Code';

        btn.onclick = (e) => {
            e.stopPropagation();
            const codeText = pre.querySelector('code') ? pre.querySelector('code').innerText : pre.innerText;
            const cleanText = codeText.replace('📋 Copy Code', '').replace('✅ Copied!', '').trim();
            
            navigator.clipboard.writeText(cleanText).then(() => {
                btn.innerText = '✅ Copied!';
                btn.classList.add('copied');
                setTimeout(() => { 
                    btn.innerText = '📋 Copy Code'; 
                    btn.classList.remove('copied');
                }, 2000);
            });
        };

        pre.appendChild(btn);
    });
}

// 🤖 Real AI / API Fetching Functions

// 1. Fetch Notes
async function fetchAINotes(language) {
    const responseBox = document.getElementById('ai-response-box');
    const selectedLang = getSelectedUserLanguage();

    responseBox.innerHTML = `<h3 style="color: #007185;">⏳ AI is generating complete ${language} syllabus in ${selectedLang}... Please wait!</h3>`;

    try {
        const response = await fetch('/api/generate-notes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                language: language,
                userLang: selectedLang 
            })
        });
        const data = await response.json();

        if (data.success) {
            const formattedHTML = typeof marked !== 'undefined' ? marked.parse(data.content) : data.content;
            
            responseBox.innerHTML = `
                <h2 style="color: #131921; border-bottom: 2px solid #febd69; padding-bottom: 8px;">${language} Complete Course (${selectedLang})</h2>
                <div id="formatted-notes-content" style="margin-top: 15px; line-height: 1.8; font-size: 15px; text-align: left; max-width: 100%; overflow-x: hidden;">
                    ${formattedHTML}
                </div>
            `;

            const notesContent = document.getElementById('formatted-notes-content');
            applyStrictWrap(notesContent);
            addCopyButtons(notesContent);
        } else {
            responseBox.innerHTML = `<p style="color: red;">⚠️ Error: ${data.error}</p>`;
        }
    } catch (err) {
        responseBox.innerHTML = `<p style="color: red;">⚠️ Express Server Offline! Run 'node server.js' to fetch live AI notes, or check backend connection.</p>`;
    }
}

// 2. Fetch Basics / DSA
async function fetchAIBasics(category, topic) {
    const box = document.getElementById('ai-basics-box');
    const displayTopic = topic || category;
    const selectedLang = getSelectedUserLanguage();

    box.innerHTML = `⏳ Fetching AI explanation for ${category}: ${displayTopic} in ${selectedLang}...`;

    try {
        const response = await fetch('/api/generate-basics', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                category, 
                topic: displayTopic,
                userLang: selectedLang 
            })
        });
        const data = await response.json();

        if (data.success) {
            const formattedHTML = typeof marked !== 'undefined' ? marked.parse(data.content) : data.content;
            box.innerHTML = `<div style="background: #f8fafc; padding: 15px; border-radius: 6px; margin-top: 10px; max-width: 100%; overflow-x: hidden;">
                <h4>📌 AI Masterclass on ${displayTopic} (${selectedLang}):</h4>
                <div id="formatted-basics-content" style="max-width: 100%;">${formattedHTML}</div>
            </div>`;

            const basicsContent = document.getElementById('formatted-basics-content');
            applyStrictWrap(basicsContent);
            addCopyButtons(basicsContent);
        } else {
            box.innerHTML = `<p style="color: red;">⚠️ Error generating concept.</p>`;
        }
    } catch (err) {
        box.innerHTML = `<p style="color: red;">⚠️ Backend Offline!</p>`;
    }
}

// 3. Fetch Quiz
async function fetchAIQuiz(language) {
    const box = document.getElementById('ai-quiz-box');
    const selectedLang = getSelectedUserLanguage();

    box.innerHTML = `⏳ AI is creating a dynamic ${language} quiz in ${selectedLang}...`;

    try {
        const response = await fetch('/api/generate-quiz', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                language,
                userLang: selectedLang 
            })
        });
        const data = await response.json();

        if (data.success && data.questions) {
            let quizHTML = '';
            data.questions.forEach((q, idx) => {
                quizHTML += `
                    <div style="background: #f8fafc; padding: 15px; border-radius: 6px; border: 1px solid #ccc; margin-top: 10px; max-width: 100%;">
                        <p><strong>Q${idx+1}: ${q.question}</strong></p>
                        <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-top: 8px;">
                            ${q.options.map(opt => `<button style="background: #febd69; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer;" onclick="alert('${opt === q.answer ? '✅ Correct! ' + q.explanation : '❌ Wrong Answer! Try Again.'}')">${opt}</button>`).join('')}
                        </div>
                    </div>
                `;
            });
            box.innerHTML = quizHTML;
        } else {
            box.innerHTML = `<p style="color: red;">⚠️ Failed to load quiz.</p>`;
        }
    } catch (err) {
        box.innerHTML = `<p style="color: red;">⚠️ Backend Offline!</p>`;
    }
}

// 4. Run Code Workspace
async function runAICode() {
    const code = document.getElementById('code-input').value;
    const outputBox = document.getElementById('code-output');

    if (!code) {
        alert("Please write some code first!");
        return;
    }

    outputBox.innerHTML = "⏳ AI Engine is compiling and analyzing code...";

    try {
        const response = await fetch('/api/run-code', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ language: "JavaScript/General", code: code })
        });
        const data = await response.json();

        if (data.success) {
            outputBox.innerText = data.output;
            addCopyButtons(outputBox);
        } else {
            outputBox.innerText = "⚠️ Execution Error: " + data.error;
        }
    } catch (err) {
        outputBox.innerText = "⚠️ Backend Server Offline!";
    }
}

function resetDashboard() {
    document.getElementById('content-box').classList.add('hidden');
}

// 👁️ Show/Hide Password Feature
function togglePasswordVisibility() {
    const passwordInput = document.getElementById('password');
    const toggleIcon = document.getElementById('togglePassword');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleIcon.innerText = '🙈';
    } else {
        passwordInput.type = 'password';
        toggleIcon.innerText = '👁️';
    }
}