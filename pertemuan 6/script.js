// Data Pertanyaan (Minimal 5 pertanyaan pilihan ganda)
const quizData = [
    {
        question: "Tag HTML apa yang digunakan untuk membuat judul utama?",
        choices: ["<h1>", "<head>", "<p>", "<h6>"],
        answer: 0
    },
    {
        question: "Properti CSS mana yang digunakan untuk mengubah warna teks?",
        choices: ["font-color", "text-color", "color", "background-color"],
        answer: 2
    },
    {
        question: "Manakah yang merupakan bahasa pemrograman untuk logika di dalam web browser?",
        choices: ["Python", "JavaScript", "C++", "Java"],
        answer: 1
    },
    {
        question: "Apa fungsi dari objek localStorage di JavaScript?",
        choices: [
            "Menyimpan data di server database",
            "Menyimpan data secara permanen di browser pengguna",
            "Mengirim email otomatis",
            "Membuat animasi CSS"
        ],
        answer: 1
    },
    {
        question: "Metode DOM apa yang digunakan untuk membuat elemen baru secara dinamis?",
        choices: ["document.getElementById()", "document.createElement()", "element.innerHTML()", "window.open()"],
        answer: 1
    }
];

// State Variabel
let currentQuestionIndex = 0;
let score = 0;
let timer;
let timeLeft = 15;
let isAnswered = false;

// Elemen DOM
const startScreen = document.getElementById("start-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");
const startBtn = document.getElementById("start-btn");
const restartBtn = document.getElementById("restart-btn");
const questionText = document.getElementById("question-text");
const choicesContainer = document.getElementById("choices-container");
const questionCounter = document.getElementById("question-counter");
const timerDisplay = document.getElementById("timer");
const progressBar = document.getElementById("progress-bar");
const finalScoreDisplay = document.getElementById("final-score");
const resultMessage = document.getElementById("result-message");
const highScoreDisplay = document.getElementById("high-score");

// Inisialisasi High Score dari LocalStorage
function updateHighScoreDisplay() {
    const highScore = localStorage.getItem("quizHighScore") || 0;
    highScoreDisplay.textContent = highScore;
}
updateHighScoreDisplay();

// Event Listener untuk tombol mulai dan restart (SPA Navigation tanpa reload)
startBtn.addEventListener("click", startQuiz);
restartBtn.addEventListener("click", startQuiz);

function startQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    startScreen.classList.remove("active");
    resultScreen.classList.remove("active");
    quizScreen.classList.add("active");
    loadQuestion();
}

function loadQuestion() {
    resetState();
    const currentQuiz = quizData[currentQuestionIndex];
    
    // Render teks soal menggunakan textContent (Requirement 2)
    questionText.textContent = currentQuiz.question;
    questionCounter.textContent = `Pertanyaan ${currentQuestionIndex + 1} dari ${quizData.length}`;
    
    // Update progress bar visual (Bonus)
    const progressPercent = ((currentQuestionIndex) / quizData.length) * 100;
    progressBar.style.width = `${progressPercent}%`;

    // Render pilihan jawaban menggunakan createElement & textContent (Requirement 2)
    currentQuiz.choices.forEach((choice, index) => {
        const button = document.createElement("button");
        button.textContent = choice;
        button.classList.add("choice-btn");
        button.dataset.index = index; // Menyimpan indeks untuk pengecekan jawaban
        choicesContainer.appendChild(button);
    });

    startTimer();
}

function resetState() {
    clearInterval(timer);
    timeLeft = 15;
    isAnswered = false;
    timerDisplay.textContent = `Waktu: ${timeLeft}s`;
    while (choicesContainer.firstChild) {
        choicesContainer.removeChild(choicesContainer.firstChild);
    }
}

// Timer per soal (Fitur Bonus)
function startTimer() {
    timer = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = `Waktu: ${timeLeft}s`;
        if (timeLeft <= 0) {
            clearInterval(timer);
            handleTimeOut();
        }
    }, 1000);
}

function handleTimeOut() {
    if (isAnswered) return;
    isAnswered = true;
    const currentQuiz = quizData[currentQuestionIndex];
    const buttons = choicesContainer.children;
    
    // Tampilkan jawaban yang benar secara visual jika waktu habis
    buttons[currentQuiz.answer].classList.add("correct");
    disableButtons();
    setTimeout(nextQuestion, 1500);
}

// Event Delegation pada pilihan jawaban (Requirement 3)
choicesContainer.addEventListener("click", (e) => {
    if (isAnswered) return;
    const selectedButton = e.target.closest("button");
    if (!selectedButton) return;

    isAnswered = true;
    clearInterval(timer);

    const selectedAnswer = parseInt(selectedButton.dataset.index);
    const currentQuiz = quizData[currentQuestionIndex];
    const buttons = choicesContainer.children;

    // Feedback visual: Benar = hijau, Salah = merah (Requirement 7)
    if (selectedAnswer === currentQuiz.answer) {
        score += 20; // 5 soal x 20 poin = 100 max score
        selectedButton.classList.add("correct");
    } else {
        selectedButton.classList.add("incorrect");
        buttons[currentQuiz.answer].classList.add("correct"); // Tunjukkan jawaban benar
    }

    disableButtons();
    setTimeout(nextQuestion, 1500);
});

function disableButtons() {
    Array.from(choicesContainer.children).forEach(button => {
        button.style.pointerEvents = "none";
    });
}

function nextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < quizData.length) {
        loadQuestion();
    } else {
        showResult();
    }
}

function showResult() {
    quizScreen.classList.remove("active");
    resultScreen.classList.add("active");
    
    finalScoreDisplay.textContent = score;
    progressBar.style.width = `100%`;

    // Cek dan simpan High Score ke LocalStorage (Requirement 5 & Skor Otomatis Requirement 4)
    const savedHighScore = parseInt(localStorage.getItem("quizHighScore")) || 0;
    if (score > savedHighScore) {
        localStorage.setItem("quizHighScore", score);
        resultMessage.textContent = "🏆 Luar biasa! Rekor High Score baru tercapai!";
    } else {
        resultMessage.textContent = `Bagus sekali! Pertahankan hasil belajarmu.`;
    }
    updateHighScoreDisplay();
}