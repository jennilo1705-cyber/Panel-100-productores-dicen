const roundsData = [
    {
        title: "RONDA 1",
        question: "¿Qué es lo primero que se te viene a la mente cuando piensas en las propiedades del sonido?",
        multiplier: 1,
        answers: [
            { text: "Frecuencia / Altura", points: 40 },
            { text: "Volumen / Intensidad", points: 30 },
            { text: "El tiempo / Evento", points: 18 },
            { text: "La causa / Fuente", points: 12 }
        ]
    },
    {
        title: "RONDA 2",
        question: "Decimos que el sonido no se puede cosificar ni agarrar como un objeto porque...",
        multiplier: 1,
        answers: [
            { text: "No se detiene el tiempo", points: 45 },
            { text: "Se mezcla / Superpone con otros", points: 25 },
            { text: "No tiene borde ni marco visible", points: 18 },
            { text: "La vista nos engaña su origen", points: 12 }
        ]
    },
    {
        title: "RONDA 3",
        question: "¿Qué efecto o fenómeno auditivo experimentas en el cine o la vida diaria sin darte cuenta?",
        multiplier: 2,
        answers: [
            { text: "Imantación espacial (cine)", points: 50 },
            { text: "Efecto cóctel (aislar voz)", points: 25 },
            { text: "Enmascaramiento (ruido tapa)", points: 15 },
            { text: "Escucha envolvente (360°)", points: 10 }
        ]
    },
    {
        title: "RONDA 4",
        question: "Mencióname un elemento o dato clave del sistema auditivo humano o la acústica.",
        multiplier: 3,
        answers: [
            { text: "Viaja 340 m/s en el aire", points: 58 },
            { text: "Tímpano y huesecillos protegen", points: 30 },
            { text: "Mayor sensibilidad en voz media", points: 7 },
            { text: "Oído interno regula equilibrio", points: 5 }
        ]
    },
    {
        title: "RONDA 5",
        question: "Menciona un sentido u órgano que se relacione fuertemente con la escucha según la teoría.",
        multiplier: 1,
        answers: [
            { text: "La vista / Los ojos (imanta)", points: 42 },
            { text: "La piel / Cuerpo (la vibración)", points: 35 },
            { text: "Sistema vestibular (equilibrio)", points: 13 },
            { text: "La boca (bucle audiofonatorio)", points: 10 }
        ]
    },
    {
        title: "RONDA 6",
        question: "¿Qué elemento sonoro se suele confundir o superponer al analizar una película?",
        multiplier: 2,
        answers: [
            { text: "El diálogo / La voz humana", points: 40 },
            { text: "La música de fondo / Banda sonora", points: 30 },
            { text: "Efecto de sonido / Foley", points: 20 },
            { text: "Ruido ambiente / Silencio", points: 10 }
        ]
    },
    {
        title: "RONDA 7",
        question: "Menciona un fenómeno físico que le ocurre a la onda sonora al propagarse.",
        multiplier: 3,
        answers: [
            { text: "Reverberación / Eco (rebotar)", points: 48 },
            { text: "Enmascaramiento (ruido tapa)", points: 26 },
            { text: "Atenuación / Pérdida por distancia", points: 18 },
            { text: "Difracción (esquivar objetos)", points: 8 }
        ]
    }
];

// --- GESTIÓN DE AUDIOS PERSONALIZADOS (MP3) ---
let customCorrectAudio = null;
let customWrongAudio = null;

document.addEventListener("DOMContentLoaded", () => {
    const correctInput = document.getElementById('input-correct-mp3') || document.querySelectorAll('input[type="file"]')[0];
    const wrongInput = document.getElementById('input-wrong-mp3') || document.querySelectorAll('input[type="file"]')[1];

    if (correctInput) {
        correctInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                customCorrectAudio = new Audio(URL.createObjectURL(file));
            }
        });
    }

    if (wrongInput) {
        wrongInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                customWrongAudio = new Audio(URL.createObjectURL(file));
            }
        });
    }
});

function playCorrectSound() {
    if (customCorrectAudio) {
        customCorrectAudio.currentTime = 0;
        customCorrectAudio.play().catch(e => console.error("Error reproduciendo MP3 acierto:", e));
    } else {
        playSynthCorrectSound();
    }
}

function playWrongSound() {
    if (customWrongAudio) {
        customWrongAudio.currentTime = 0;
        customWrongAudio.play().catch(e => console.error("Error reproduciendo MP3 error:", e));
    } else {
        playSynthWrongSound();
    }
}

// --- SONIDOS SINTÉTICOS DE RESPALDO ---
let audioCtx = null;
function getAudioContext() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    return audioCtx;
}

function playSynthCorrectSound() {
    try {
        const ctx = getAudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        const now = ctx.currentTime;

        osc.frequency.setValueAtTime(523.25, now);
        osc.frequency.setValueAtTime(659.25, now + 0.1);
        osc.frequency.setValueAtTime(783.99, now + 0.2);
        osc.frequency.setValueAtTime(1046.50, now + 0.3);

        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.5);
    } catch (e) {}
}

function playSynthWrongSound() {
    try {
        const ctx = getAudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        const now = ctx.currentTime;

        osc.frequency.setValueAtTime(150, now);
        osc.frequency.linearRampToValueAtTime(80, now + 0.35);

        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.35);
    } catch (e) {}
}

// --- ESTADO GLOBAL Y LÓGICA DEL JUEGO ---
let currentView = 'round';
let currentRoundIndex = 0;
let basePointsSum = 0;
let roundStrikeCount = [0, 0, 0, 0, 0, 0, 0];

let fastMoneyGame1 = {
    p1: Array(5).fill().map(() => ({ text: "", points: "" })),
    p2: Array(5).fill().map(() => ({ text: "", points: "" }))
};

let fastMoneyGame2 = {
    p1: Array(5).fill().map(() => ({ text: "", points: "" })),
    p2: Array(5).fill().map(() => ({ text: "", points: "" }))
};

const boardGrid = document.getElementById('board-grid');
const normalPanel = document.getElementById('normal-panel');
const fastMoneyPanel = document.getElementById('fast-money-panel');
const mainScoreBox = document.getElementById('main-score-box');
const totalScoreEl = document.getElementById('total-score');
const roundTitleEl = document.getElementById('round-title');
const crossOverlay = document.getElementById('cross-overlay');
const crossContainer = document.getElementById('cross-container');
const fastCrossOverlay = document.getElementById('fast-cross-overlay');
const btnCross = document.getElementById('btn-cross-trigger');
const btnReset = document.getElementById('btn-reset');

function switchView(type, roundIdx = 0) {
    currentView = type;
    
    document.querySelectorAll('.round-btn').forEach((btn, idx) => {
        btn.classList.toggle('active', type === 'round' && idx === roundIdx);
    });
    document.querySelectorAll('.fast-money-btn').forEach((btn, idx) => {
        btn.classList.toggle('active', (type === 'fast1' && idx === 0) || (type === 'fast2' && idx === 1));
    });

    if (type === 'round') {
        currentRoundIndex = roundIdx;
        normalPanel.style.display = 'block';
        fastMoneyPanel.style.display = 'none';
        mainScoreBox.style.display = 'block';
        renderNormalRound();
    } else {
        normalPanel.style.display = 'none';
        fastMoneyPanel.style.display = 'block';
        mainScoreBox.style.display = 'none';
        renderFastMoney(type);
    }
}

function renderNormalRound() {
    const roundInfo = roundsData[currentRoundIndex];
    roundTitleEl.textContent = roundInfo.title;
    boardGrid.innerHTML = '';
    
    basePointsSum = 0;
    totalScoreEl.textContent = 0;

    roundInfo.answers.forEach((item, index) => {
        const row = document.createElement('div');
        row.classList.add('board-row');

        row.innerHTML = `
            <div class="row-closed">${index + 1}</div>
            <div class="row-open">
                <div class="answer-text">${item.text}</div>
                <div class="answer-points">${item.points}</div>
            </div>
        `;

        row.addEventListener('click', () => {
            if (!row.classList.contains('revealed')) {
                row.classList.add('revealed');
                playCorrectSound();
                basePointsSum += item.points;
                const finalCalculatedScore = basePointsSum * roundInfo.multiplier;
                totalScoreEl.textContent = finalCalculatedScore;
            }
        });

        boardGrid.appendChild(row);
    });
}

function renderFastMoney(type) {
    const fastTitleEl = document.getElementById('fast-panel-title');
    fastTitleEl.textContent = type === 'fast1' ? "DINERO RÁPIDO - JUEGO 1" : "DINERO RÁPIDO - JUEGO 2";

    const fastGrid = document.getElementById('fast-grid');
    fastGrid.innerHTML = '';

    const currentGame = type === 'fast1' ? fastMoneyGame1 : fastMoneyGame2;

    for (let i = 0; i < 5; i++) {
        const row = document.createElement('div');
        row.classList.add('fast-row');

        row.innerHTML = `
            <div class="fast-cell">
                <input type="text" class="fast-input-text p1-text" placeholder="Resp. ${i + 1}" value="${currentGame.p1[i].text}">
                <input type="text" class="fast-score-btn p1-score" placeholder="0" value="${currentGame.p1[i].points}" maxlength="3">
            </div>

            <div class="fast-cell">
                <input type="text" class="fast-input-text p2-text" placeholder="Resp. ${i + 1}" value="${currentGame.p2[i].text}">
                <input type="text" class="fast-score-btn p2-score" placeholder="0" value="${currentGame.p2[i].points}" maxlength="3">
            </div>
        `;

        const p1Text = row.querySelector('.p1-text');
        const p1Score = row.querySelector('.p1-score');

        p1Text.addEventListener('input', (e) => currentGame.p1[i].text = e.target.value.toUpperCase());
        
        // Manejo de sonido en Dinero Rápido (P1)
        p1Score.addEventListener('change', (e) => {
            const val = parseInt(e.target.value);
            currentGame.p1[i].points = e.target.value;
            if (val === 0) {
                triggerCross();
            } else if (!isNaN(val) && val > 0) {
                playCorrectSound();
            }
            calculateFastTotal();
        });

        const p2Text = row.querySelector('.p2-text');
        const p2Score = row.querySelector('.p2-score');

        p2Text.addEventListener('input', (e) => currentGame.p2[i].text = e.target.value.toUpperCase());
        
        // Manejo de sonido en Dinero Rápido (P2)
        p2Score.addEventListener('change', (e) => {
            const val = parseInt(e.target.value);
            currentGame.p2[i].points = e.target.value;
            if (val === 0) {
                triggerCross();
            } else if (!isNaN(val) && val > 0) {
                playCorrectSound();
            }
            calculateFastTotal();
        });

        fastGrid.appendChild(row);
    }

    calculateFastTotal();
}

function calculateFastTotal() {
    const currentGame = currentView === 'fast1' ? fastMoneyGame1 : fastMoneyGame2;
    let total = 0;

    currentGame.p1.forEach(item => {
        const p = parseInt(item.points);
        if (!isNaN(p)) total += p;
    });

    currentGame.p2.forEach(item => {
        const p = parseInt(item.points);
        if (!isNaN(p)) total += p;
    });

    const fastTotalEl = document.getElementById('fast-total-score');
    if (fastTotalEl) {
        fastTotalEl.textContent = total;
    }
}

let crossTimeout;
function triggerCross() {
    playWrongSound();

    if (currentView === 'round') {
        roundStrikeCount[currentRoundIndex]++;
        
        if (roundStrikeCount[currentRoundIndex] > 3) {
            roundStrikeCount[currentRoundIndex] = 1;
        }

        const strikes = roundStrikeCount[currentRoundIndex];

        crossContainer.innerHTML = '';
        for (let i = 0; i < strikes; i++) {
            const span = document.createElement('span');
            span.classList.add('neon-cross');
            span.textContent = '❌';
            crossContainer.appendChild(span);
        }

        crossOverlay.classList.add('active');
        clearTimeout(crossTimeout);
        crossTimeout = setTimeout(() => {
            crossOverlay.classList.remove('active');
        }, 1500);

    } else {
        fastCrossOverlay.classList.add('active');
        clearTimeout(crossTimeout);
        crossTimeout = setTimeout(() => {
            fastCrossOverlay.classList.remove('active');
        }, 1500);
    }
}

if (btnCross) btnCross.addEventListener('click', triggerCross);

if (btnReset) {
    btnReset.addEventListener('click', () => {
        if (currentView === 'round') {
            roundStrikeCount[currentRoundIndex] = 0;
            renderNormalRound();
        } else if (currentView === 'fast1') {
            fastMoneyGame1.p1 = Array(5).fill().map(() => ({ text: "", points: "" }));
            fastMoneyGame1.p2 = Array(5).fill().map(() => ({ text: "", points: "" }));
            renderFastMoney('fast1');
        } else {
            fastMoneyGame2.p1 = Array(5).fill().map(() => ({ text: "", points: "" }));
            fastMoneyGame2.p2 = Array(5).fill().map(() => ({ text: "", points: "" }));
            renderFastMoney('fast2');
        }
    });
}

switchView('round', 0);