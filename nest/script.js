// =========================================================
// ELEMENT REFERENCES
// =========================================================

const timerElement = document.getElementById("timer");
const sessionTypeElement = document.getElementById("sessionType");
const sessionProgressElement = document.getElementById("sessionProgress");
const sessionDotsElement = document.getElementById("sessionDots");
const ringProgress = document.getElementById("ringProgress");

const activeTaskSelect = document.getElementById("activeTaskSelect");

const startButton = document.getElementById("startButton");
const resetButton = document.getElementById("resetButton");

const timerView = document.getElementById("timerView");
const completeView = document.getElementById("completeView");
const breakIntroView = document.getElementById("breakIntroView");

const completedMinutesElement = document.getElementById("completedMinutes");
const breakPreviewTimer = document.getElementById("breakPreviewTimer");

const takeBreakButton = document.getElementById("takeBreakButton");
const startNextButton = document.getElementById("startNextButton");
const startBreakButton = document.getElementById("startBreakButton");
const skipBreakButton = document.getElementById("skipBreakButton");

const taskList = document.getElementById("taskList");
const taskInput = document.getElementById("taskInput");
const addTaskButton = document.getElementById("addTaskButton");
const addTaskHeaderButton = document.getElementById("addTaskHeaderButton");

const prevDateButton = document.getElementById("prevDateButton");
const nextDateButton = document.getElementById("nextDateButton");
const dateLabelElement = document.getElementById("dateLabel");

const ambienceBackground = document.getElementById("ambienceBackground");
const ambienceList = document.getElementById("ambienceList");

const soundsList = document.getElementById("soundsList");
const masterVolumeInput = document.getElementById("masterVolume");
const masterVolumeValue = document.getElementById("masterVolumeValue");
const clearAllSoundsButton = document.getElementById("clearAllSounds");
const playAllSoundsButton = document.getElementById("playAllSounds");
const addAnotherSoundButton = document.getElementById("addAnotherSound");

const notesGrid = document.getElementById("notesGrid");
const newNoteButton = document.getElementById("newNoteButton");

const stickyNotesButton = document.getElementById("stickyNotesButton");
const stickyNotesContainer = document.getElementById("stickyNotesContainer");

// Nav
const navHome = document.getElementById("navHome");
const navAmbience = document.getElementById("navAmbience");
const navNotes = document.getElementById("navNotes");
const navSettings = document.getElementById("navSettings");

const bottomNavHome = document.getElementById("bottomNavHome");
const bottomNavTasks = document.getElementById("bottomNavTasks");
const bottomNavAmbience = document.getElementById("bottomNavAmbience");
const bottomNavNotes = document.getElementById("bottomNavNotes");
const bottomNavMore = document.getElementById("bottomNavMore");

// Modals
const ambienceOverlay = document.getElementById("ambienceOverlay");
const closeAmbienceButton = document.getElementById("closeAmbienceButton");
const tabEnvironments = document.getElementById("tabEnvironments");
const tabCustomMix = document.getElementById("tabCustomMix");
const environmentsSection = document.getElementById("environmentsSection");

const settingsOverlay = document.getElementById("settingsOverlay");
const closeSettingsButton = document.getElementById("closeSettingsButton");
const saveSettingsButton = document.getElementById("saveSettingsButton");
const resetSettingsButton = document.getElementById("resetSettingsButton");

const notesOverlay = document.getElementById("notesOverlay");
const closeNotesButton = document.getElementById("closeNotesButton");

const authOverlay = document.getElementById("authOverlay");
const closeAuthButton = document.getElementById("closeAuthButton");
const accountButton = document.getElementById("accountButton");

const authLoggedOutView = document.getElementById("authLoggedOutView");
const authLoggedInView = document.getElementById("authLoggedInView");
const authError = document.getElementById("authError");
const authEmailInput = document.getElementById("authEmail");
const authPasswordInput = document.getElementById("authPassword");
const authSubmitButton = document.getElementById("authSubmitButton");
const authTabLogin = document.getElementById("authTabLogin");
const authTabSignup = document.getElementById("authTabSignup");
const authToggleButton = document.getElementById("authToggleButton");
const authToggleText = document.getElementById("authToggleText");
const authUserEmailElement = document.getElementById("authUserEmail");
const logoutButton = document.getElementById("logoutButton");
const googleAuthButton = document.getElementById("googleAuthButton");
const microsoftAuthButton = document.getElementById("microsoftAuthButton");

const focusDurationInput = document.getElementById("focusDuration");
const shortBreakDurationInput = document.getElementById("shortBreakDuration");
const longBreakDurationInput = document.getElementById("longBreakDuration");
const sessionsUntilLongBreakInput = document.getElementById("sessionsUntilLongBreak");

// Point this at your deployed Java backend once it's live, e.g.
// "https://your-backend.up.railway.app/api"
const API_BASE_URL = "https://pomodoro-xjlu.onrender.com/api";


// =========================================================
// GENERIC MODAL HELPERS
// =========================================================

function openModal(overlay) {
    overlay.classList.add("open");
}

function closeModal(overlay) {
    overlay.classList.remove("open");
}

function setActiveNav(activeButton) {
    [navHome, navAmbience, navNotes, navSettings].forEach(button => {
        if (button) button.classList.remove("active");
    });

    if (activeButton) {
        activeButton.classList.add("active");
    }
}

function setActiveBottomNav(activeButton) {
    [bottomNavHome, bottomNavTasks, bottomNavAmbience, bottomNavNotes, bottomNavMore].forEach(button => {
        if (button) button.classList.remove("active");
    });

    if (activeButton) {
        activeButton.classList.add("active");
    }
}

navHome.addEventListener("click", () => setActiveNav(navHome));
navAmbience.addEventListener("click", () => { openModal(ambienceOverlay); setActiveNav(navAmbience); });
navNotes.addEventListener("click", () => { openModal(notesOverlay); setActiveNav(navNotes); });
navSettings.addEventListener("click", () => { openModal(settingsOverlay); setActiveNav(navSettings); });

bottomNavHome.addEventListener("click", () => {
    setActiveBottomNav(bottomNavHome);
    window.scrollTo({ top: 0, behavior: "smooth" });
});

bottomNavTasks.addEventListener("click", () => {
    setActiveBottomNav(bottomNavTasks);
    document.getElementById("tasksCard").scrollIntoView({ behavior: "smooth" });
});

bottomNavAmbience.addEventListener("click", () => {
    setActiveBottomNav(bottomNavAmbience);
    openModal(ambienceOverlay);
});

bottomNavNotes.addEventListener("click", () => {
    setActiveBottomNav(bottomNavNotes);
    openModal(notesOverlay);
});

bottomNavMore.addEventListener("click", () => {
    setActiveBottomNav(bottomNavMore);
    openModal(settingsOverlay);
});

closeAmbienceButton.addEventListener("click", () => { closeModal(ambienceOverlay); setActiveNav(navHome); setActiveBottomNav(bottomNavHome); });
closeSettingsButton.addEventListener("click", () => { closeModal(settingsOverlay); setActiveNav(navHome); setActiveBottomNav(bottomNavHome); });
closeNotesButton.addEventListener("click", () => { closeModal(notesOverlay); setActiveNav(navHome); setActiveBottomNav(bottomNavHome); });
closeAuthButton.addEventListener("click", () => closeModal(authOverlay));

[ambienceOverlay, settingsOverlay, notesOverlay, authOverlay].forEach(overlay => {
    overlay.addEventListener("click", function(event) {
        if (event.target === overlay) {
            closeModal(overlay);
        }
    });
});

accountButton.addEventListener("click", () => openModal(authOverlay));


// =========================================================
// TIMER CONFIG / STATE
// =========================================================

const TIMER_MODES = {
    FOCUS: "focus",
    SHORT_BREAK: "shortBreak",
    LONG_BREAK: "longBreak"
};

const TIMER_MODE_LABELS = {
    [TIMER_MODES.FOCUS]: "Focus",
    [TIMER_MODES.SHORT_BREAK]: "Short Break",
    [TIMER_MODES.LONG_BREAK]: "Long Break"
};

const DEFAULT_TIMER_CONFIG = {
    focusDuration: 25 * 60,
    shortBreakDuration: 5 * 60,
    longBreakDuration: 15 * 60,
    sessionsUntilLongBreak: 4
};

const timerConfig = { ...DEFAULT_TIMER_CONFIG };

const timerState = {
    mode: TIMER_MODES.FOCUS,
    remainingTime: timerConfig.focusDuration,
    isRunning: false,
    sessionCount: 0,
    intervalId: null,
    activeTaskId: null
};

const RING_CIRCUMFERENCE = 2 * Math.PI * 96;
ringProgress.style.strokeDasharray = String(RING_CIRCUMFERENCE);


// =========================================================
// AMBIENCE (visual environments)
// =========================================================

const ambiences = [
    {
        id: "none",
        name: "None",
        sub: "No background",
        type: "none",
        source: null
    },

    {
        id: "rainy-room",
        name: "Rainy Day",
        sub: "Stay cozy indoors",
        type: "video",
        source: "../assets/ambience/rainy-room.mp4"
    },

    {
        id: "forest",
        name: "Forest",
        sub: "Nature's calm",
        type: "video",
        source: "../assets/ambience/forest.mp4"
    },

    {
        id: "cafe",
        name: "Café",
        sub: "Background buzz",
        type: "gradient",
        source: "linear-gradient(160deg, #caa274, #8a5a3b)"
    },

    {
        id: "night-walk",
        name: "Night Walk",
        sub: "City ambience",
        type: "gradient",
        source: "linear-gradient(160deg, #2c3e63, #131b34)"
    },

    {
        id: "cozy-room",
        name: "Cozy Room",
        sub: "Warm & relaxing",
        type: "gradient",
        source: "linear-gradient(160deg, #d98a5f, #7a3b2e)"
    }
];

const ambienceState = {
    selectedAmbienceId: null
};

function renderAmbiences() {

    ambienceList.innerHTML = "";

    ambiences.forEach(ambience => {

        const isSelected =
            ambience.type === "none"
                ? ambienceState.selectedAmbienceId === null
                : ambienceState.selectedAmbienceId === ambience.id;

        const ambienceElement = document.createElement("button");

        ambienceElement.className = `ambience-card ${isSelected ? "selected" : ""}`;

        ambienceElement.dataset.id = ambience.id;

        let previewInner = "";

        if (ambience.type === "none") {

            previewInner = `<div class="no-ambience-preview">🚫</div>`;

        } else if (ambience.type === "video") {

            previewInner = `<video src="${ambience.source}" muted loop autoplay playsinline></video><span class="card-name">${ambience.name}</span>`;

        } else if (ambience.type === "gradient") {

            previewInner = `<span class="card-name">${ambience.name}</span>`;
        }

        const previewStyle =
            ambience.type === "gradient"
                ? ` style="background:${ambience.source}"`
                : "";

        ambienceElement.innerHTML = `
    <div class="ambience-preview"${previewStyle}>
        ${previewInner}
    </div>
    <span class="card-sub">${ambience.sub}</span>
`;

        ambienceList.appendChild(ambienceElement);
    });
}

ambienceList.addEventListener("click", function(event) {

    const card = event.target.closest(".ambience-card");

    if (!card) {
        return;
    }

    selectAmbience(card.dataset.id);
});

function selectAmbience(ambienceId) {

    const ambience = ambiences.find(item => item.id === ambienceId);

    if (!ambience) {
        return;
    }

    ambienceState.selectedAmbienceId =
        ambience.type === "none" ? null : ambience.id;

    renderAmbienceBackground();
    renderAmbiences();
}

function renderAmbienceBackground() {

    ambienceBackground.innerHTML = "";
    ambienceBackground.style.backgroundImage = "none";

    const ambience = ambiences.find(
        item => item.id === ambienceState.selectedAmbienceId
    );

    if (!ambience || ambience.type === "none") {
        return;
    }

    if (ambience.type === "gradient") {
        ambienceBackground.style.backgroundImage = ambience.source;
        return;
    }

    if (ambience.type === "image") {
        ambienceBackground.style.backgroundImage = `url("${ambience.source}")`;
        return;
    }

    if (ambience.type === "video") {

        const video = document.createElement("video");

        video.src = ambience.source;
        video.autoplay = true;
        video.loop = true;
        video.muted = true;
        video.playsInline = true;

        ambienceBackground.appendChild(video);
    }
}

tabEnvironments.addEventListener("click", function() {
    tabEnvironments.classList.add("active");
    tabCustomMix.classList.remove("active");
    environmentsSection.style.display = "block";
});

tabCustomMix.addEventListener("click", function() {
    tabCustomMix.classList.add("active");
    tabEnvironments.classList.remove("active");
    environmentsSection.style.display = "none";
});


// =========================================================
// AMBIENCE SOUNDS (independent mixer)
// =========================================================

const ambienceSounds = [
    {
        id: "rain",
        name: "Rain",
        sub: "Gentle rain on a window",
        icon: "🌧️",
        source: "../assets/sounds/rain.mp3"
    },

    {
        id: "walking",
        name: "Walking",
        sub: "Soft footsteps",
        icon: "🚶",
        source: "../assets/sounds/walking.mp3"
    }
];

// Each sound gets its own looping <audio> element so multiple
// sounds can play together, independently of the visual ambience.
const soundAudioElements = {};
const soundState = {};

let masterVolume = 70;

ambienceSounds.forEach(sound => {

    const audio = new Audio(sound.source);
    audio.loop = true;

    soundAudioElements[sound.id] = audio;

    soundState[sound.id] = {
        playing: false,
        volume: 50
    };
});

function applyEffectiveVolume(soundId) {

    const state = soundState[soundId];
    const audio = soundAudioElements[soundId];

    audio.volume = (state.volume / 100) * (masterVolume / 100);
}

function renderSounds() {

    soundsList.innerHTML = "";

    ambienceSounds.forEach(sound => {

        const state = soundState[sound.id];

        const soundItem = document.createElement("div");

        soundItem.className = `sound-item ${state.playing ? "active" : ""}`;

        soundItem.innerHTML = `
    <span class="sound-icon">${sound.icon}</span>

    <div class="sound-info">
        <span class="sound-name">${sound.name}</span>
        <span class="sound-sub">${sound.sub}</span>
        <input
            type="range"
            class="sound-volume"
            min="0"
            max="100"
            value="${state.volume}"
            data-sound-id="${sound.id}"
        >
    </div>

    <button
        class="sound-toggle ${state.playing ? "active" : ""}"
        data-sound-id="${sound.id}"
        aria-label="Toggle ${sound.name}"
    ></button>
`;

        soundsList.appendChild(soundItem);
    });
}

function toggleSound(soundId) {

    const state = soundState[soundId];
    const audio = soundAudioElements[soundId];

    state.playing = !state.playing;

    if (state.playing) {
        applyEffectiveVolume(soundId);
        audio.play();
    } else {
        audio.pause();
    }

    renderSounds();
}

function setSoundVolume(soundId, volume) {

    soundState[soundId].volume = volume;
    applyEffectiveVolume(soundId);
}

soundsList.addEventListener("click", function(event) {

    const toggleButton = event.target.closest(".sound-toggle");

    if (!toggleButton) {
        return;
    }

    toggleSound(toggleButton.dataset.soundId);
});

soundsList.addEventListener("input", function(event) {

    if (!event.target.classList.contains("sound-volume")) {
        return;
    }

    setSoundVolume(event.target.dataset.soundId, Number(event.target.value));
});

masterVolumeInput.addEventListener("input", function(event) {

    masterVolume = Number(event.target.value);
    masterVolumeValue.textContent = `${masterVolume}%`;

    ambienceSounds.forEach(sound => {
        if (soundState[sound.id].playing) {
            applyEffectiveVolume(sound.id);
        }
    });
});

clearAllSoundsButton.addEventListener("click", function() {

    ambienceSounds.forEach(sound => {
        if (soundState[sound.id].playing) {
            toggleSound(sound.id);
        }
    });
});

playAllSoundsButton.addEventListener("click", function() {

    ambienceSounds.forEach(sound => {
        if (!soundState[sound.id].playing) {
            toggleSound(sound.id);
        }
    });
});

addAnotherSoundButton.addEventListener("click", function() {
    alert("More sounds are coming soon! For now you can mix Rain and Walking.");
});


// =========================================================
// NOTES (new feature)
// =========================================================

const NOTES_STORAGE_KEY = "pomodoro.notes";
const NOTE_COLORS = ["yellow", "blue", "pink", "green"];

let notes = loadNotes();

function loadNotes() {
    try {
        const stored = localStorage.getItem(NOTES_STORAGE_KEY);
        const parsed = stored ? JSON.parse(stored) : [];
        return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
        console.error("Could not load notes:", error);
        return [];
    }
}

function saveNotes() {
    try {
        localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notes));
    } catch (error) {
        console.error("Could not save notes:", error);
    }
}

function renderNotes() {

    notesGrid.innerHTML = "";

    if (notes.length === 0) {
        notesGrid.innerHTML = `<p class="empty-state">No notes yet. Tap "+ New Note" to add one. 📝</p>`;
        return;
    }

    notes.forEach(note => {

        const noteElement = document.createElement("div");

        noteElement.className = `note-card color-${note.color}`;
        noteElement.dataset.id = note.id;

        noteElement.innerHTML = `
    <div class="note-card-header">
        <input class="note-title-input" value="${note.title}" data-id="${note.id}" placeholder="Title">
        <button class="note-delete" data-id="${note.id}">🗑️</button>
    </div>
    <textarea class="note-content" data-id="${note.id}" placeholder="Write something...">${note.content}</textarea>
`;

        notesGrid.appendChild(noteElement);
    });
}

newNoteButton.addEventListener("click", function() {

    const color = NOTE_COLORS[notes.length % NOTE_COLORS.length];

    notes.push({
        id: Date.now(),
        title: "New Note",
        content: "",
        color
    });

    saveNotes();
    renderNotes();
});

notesGrid.addEventListener("click", function(event) {

    if (event.target.classList.contains("note-delete")) {

        const id = Number(event.target.dataset.id);

        notes = notes.filter(note => note.id !== id);

        saveNotes();
        renderNotes();
    }
});

notesGrid.addEventListener("input", function(event) {

    const id = Number(event.target.dataset.id);

    const note = notes.find(note => note.id === id);

    if (!note) {
        return;
    }

    if (event.target.classList.contains("note-title-input")) {
        note.title = event.target.value;
    }

    if (event.target.classList.contains("note-content")) {
        note.content = event.target.value;
    }

    saveNotes();
});


// =========================================================
// TASKS (date-based, local or server-synced)
// =========================================================

const TASKS_STORAGE_KEY = "pomodoro.tasks";

function getDateKey(date) {

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

function addDays(dateKey, amount) {

    const [year, month, day] = dateKey.split("-").map(Number);
    const date = new Date(year, month - 1, day);

    date.setDate(date.getDate() + amount);

    return getDateKey(date);
}

function formatDateLabel(dateKey) {

    const todayKey = getDateKey(new Date());
    const yesterdayKey = addDays(todayKey, -1);
    const tomorrowKey = addDays(todayKey, 1);

    if (dateKey === todayKey) return "Today";
    if (dateKey === yesterdayKey) return "Yesterday";
    if (dateKey === tomorrowKey) return "Tomorrow";

    const [year, month, day] = dateKey.split("-").map(Number);
    const date = new Date(year, month - 1, day);

    return date.toLocaleDateString(undefined, {
        weekday: "short",
        month: "short",
        day: "numeric"
    });
}

function loadTasks() {
    try {
        const stored = localStorage.getItem(TASKS_STORAGE_KEY);
        if (!stored) return [];
        const parsed = JSON.parse(stored);
        return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
        console.error("Could not load saved tasks:", error);
        return [];
    }
}

function saveTasks() {
    try {
        localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
    } catch (error) {
        console.error("Could not save tasks:", error);
    }
}

let tasks = loadTasks();

const dateState = {
    selectedDate: getDateKey(new Date())
};


// =========================================================
// AUTH
// =========================================================

const AUTH_TOKEN_KEY = "pomodoro.authToken";
const AUTH_EMAIL_KEY = "pomodoro.authEmail";

const authState = {
    token: localStorage.getItem(AUTH_TOKEN_KEY),
    email: localStorage.getItem(AUTH_EMAIL_KEY),
    mode: "login"
};

function isLoggedIn() {
    return Boolean(authState.token);
}

async function apiFetch(path, options = {}) {

    const headers = Object.assign(
        { "Content-Type": "application/json" },
        options.headers || {}
    );

    if (authState.token) {
        headers.Authorization = `Bearer ${authState.token}`;
    }

    const response = await fetch(`${API_BASE_URL}${path}`, {
        ...options,
        headers
    });

    if (response.status === 401) {
        logout();
        throw new Error("Session expired. Please log in again.");
    }

    if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.error || "Request failed");
    }

    if (response.status === 204) {
        return null;
    }

    return response.json();
}

function serverTaskToLocal(serverTask) {
    return {
        id: serverTask.id,
        title: serverTask.title,
        completed: serverTask.completed,
        pomodorosCompleted: serverTask.pomodorosCompleted,
        date: serverTask.date
    };
}

async function loadTasksFromServer() {
    try {
        const serverTasks = await apiFetch("/tasks");
        tasks = serverTasks.map(serverTaskToLocal);
        renderTasks();
    } catch (error) {
        console.error("Could not load tasks from server:", error);
    }
}

function setAuthSession(token, email) {

    authState.token = token;
    authState.email = email;

    localStorage.setItem(AUTH_TOKEN_KEY, token);
    localStorage.setItem(AUTH_EMAIL_KEY, email);
}

function logout() {

    authState.token = null;
    authState.email = null;

    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_EMAIL_KEY);

    tasks = loadTasks();

    updateAuthUI();
    renderTasks();
}

function updateAuthUI() {

    if (isLoggedIn()) {

        accountButton.classList.add("logged-in");

        authLoggedOutView.style.display = "none";
        authLoggedInView.style.display = "block";

        authUserEmailElement.textContent = authState.email;

    } else {

        accountButton.classList.remove("logged-in");

        authLoggedOutView.style.display = "block";
        authLoggedInView.style.display = "none";

        authEmailInput.value = "";
        authPasswordInput.value = "";
        authError.textContent = "";
    }
}

function setAuthMode(mode) {

    authState.mode = mode;
    authError.textContent = "";

    if (mode === "login") {

        authTabLogin.classList.add("active");
        authTabSignup.classList.remove("active");
        authSubmitButton.textContent = "Log In";
        authToggleText.textContent = "New here?";
        authToggleButton.textContent = "Create an account";

    } else {

        authTabSignup.classList.add("active");
        authTabLogin.classList.remove("active");
        authSubmitButton.textContent = "Sign Up";
        authToggleText.textContent = "Already have an account?";
        authToggleButton.textContent = "Log in";
    }
}

async function handleAuthSubmit() {

    const email = authEmailInput.value.trim();
    const password = authPasswordInput.value;

    authError.textContent = "";

    if (!email || !password) {
        authError.textContent = "Please fill in both fields.";
        return;
    }

    const endpoint = authState.mode === "login" ? "/auth/login" : "/auth/register";

    try {

        const data = await apiFetch(endpoint, {
            method: "POST",
            body: JSON.stringify({ email, password })
        });

        setAuthSession(data.token, data.email);

        updateAuthUI();
        closeModal(authOverlay);

        await loadTasksFromServer();

    } catch (error) {
        authError.textContent = error.message || "Something went wrong.";
    }
}

authTabLogin.addEventListener("click", () => setAuthMode("login"));
authTabSignup.addEventListener("click", () => setAuthMode("register"));
authToggleButton.addEventListener("click", () => setAuthMode(authState.mode === "login" ? "register" : "login"));
authSubmitButton.addEventListener("click", handleAuthSubmit);

authPasswordInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        handleAuthSubmit();
    }
});

logoutButton.addEventListener("click", logout);

googleAuthButton.addEventListener("click", () => alert("Google sign-in isn't connected yet."));
microsoftAuthButton.addEventListener("click", () => alert("Microsoft sign-in isn't connected yet."));


// =========================================================
// TASK LIST RENDERING / EVENTS
// =========================================================

async function addTask() {

    const taskText = taskInput.value.trim();

    if (taskText === "") {
        return;
    }

    taskInput.value = "";

    if (isLoggedIn()) {

        try {

            const serverTask = await apiFetch("/tasks", {
                method: "POST",
                body: JSON.stringify({
                    title: taskText,
                    date: dateState.selectedDate,
                    completed: false,
                    pomodorosCompleted: 0
                })
            });

            tasks.push(serverTaskToLocal(serverTask));

        } catch (error) {
            console.error("Could not save task to server:", error);
            return;
        }

    } else {

        tasks.push({
            id: Date.now(),
            title: taskText,
            completed: false,
            pomodorosCompleted: 0,
            date: dateState.selectedDate
        });

        saveTasks();
    }

    renderTasks();
}

function renderTasks() {

    dateLabelElement.textContent = formatDateLabel(dateState.selectedDate);

    taskList.innerHTML = "";

    const tasksForDate = tasks.filter(task => task.date === dateState.selectedDate);

    if (tasksForDate.length === 0) {
        taskList.innerHTML = `<p class="empty-state">No tasks yet. Add something you want to accomplish. 🌱</p>`;
    } else {

        tasksForDate.forEach(task => {

            const taskElement = document.createElement("div");
            taskElement.className = "task";

            taskElement.innerHTML = `
    <input type="checkbox" class="task-checkbox" data-id="${task.id}" ${task.completed ? "checked" : ""}>
    <span class="${task.completed ? "completed" : ""}">${task.title}</span>
    <span class="task-pomodoros">🍅 ${task.pomodorosCompleted}</span>
    <button class="focus-task" data-id="${task.id}">Focus</button>
    <button class="delete-task" data-id="${task.id}">🗑️</button>
`;

            taskList.appendChild(taskElement);
        });
    }

    renderActiveTaskSelect();
}

function renderActiveTaskSelect() {

    const tasksForDate = tasks.filter(task => task.date === dateState.selectedDate);

    activeTaskSelect.innerHTML = `<option value="">No task selected</option>`;

    tasksForDate.forEach(task => {
        const option = document.createElement("option");
        option.value = task.id;
        option.textContent = task.title;
        if (timerState.activeTaskId === task.id) {
            option.selected = true;
        }
        activeTaskSelect.appendChild(option);
    });
}

activeTaskSelect.addEventListener("change", function() {

    const value = activeTaskSelect.value;
    timerState.activeTaskId = value ? Number(value) : null;
    renderTimer();
});

taskList.addEventListener("click", async function(event) {

    if (event.target.classList.contains("delete-task")) {

        const taskId = Number(event.target.dataset.id);

        if (isLoggedIn()) {
            try {
                await apiFetch(`/tasks/${taskId}`, { method: "DELETE" });
            } catch (error) {
                console.error("Could not delete task on server:", error);
                return;
            }
        }

        tasks = tasks.filter(task => task.id !== taskId);

        if (timerState.activeTaskId === taskId) {
            timerState.activeTaskId = null;
        }

        if (!isLoggedIn()) {
            saveTasks();
        }

        renderTasks();
        renderTimer();

        return;
    }

    if (event.target.classList.contains("focus-task")) {
        focusOnTask(Number(event.target.dataset.id));
    }
});

taskList.addEventListener("change", async function(event) {

    if (!event.target.classList.contains("task-checkbox")) {
        return;
    }

    const taskId = Number(event.target.dataset.id);
    const task = tasks.find(task => task.id === taskId);

    if (!task) {
        return;
    }

    task.completed = event.target.checked;

    if (isLoggedIn()) {
        try {
            await apiFetch(`/tasks/${taskId}`, {
                method: "PUT",
                body: JSON.stringify(taskToServerPayload(task))
            });
        } catch (error) {
            console.error("Could not update task on server:", error);
        }
    } else {
        saveTasks();
    }

    renderTasks();
});

function taskToServerPayload(task) {
    return {
        title: task.title,
        completed: task.completed,
        pomodorosCompleted: task.pomodorosCompleted,
        date: task.date
    };
}

function focusOnTask(taskId) {

    timerState.activeTaskId = taskId;

    timerState.isRunning = false;
    clearInterval(timerState.intervalId);
    timerState.intervalId = null;

    timerState.mode = TIMER_MODES.FOCUS;
    timerState.remainingTime = timerConfig.focusDuration;

    showView("timer");
    startButton.textContent = "▶ Start Focus";

    renderTimer();
}

addTaskButton.addEventListener("click", addTask);
addTaskHeaderButton.addEventListener("click", () => taskInput.focus());

taskInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        addTask();
    }
});

prevDateButton.addEventListener("click", function() {
    dateState.selectedDate = addDays(dateState.selectedDate, -1);
    renderTasks();
});

nextDateButton.addEventListener("click", function() {
    dateState.selectedDate = addDays(dateState.selectedDate, 1);
    renderTasks();
});

dateLabelElement.addEventListener("click", function() {
    dateState.selectedDate = getDateKey(new Date());
    renderTasks();
});


// =========================================================
// TIMER — VIEW SWITCHING (timer / complete / break intro)
// =========================================================

function showView(viewName) {

    [timerView, completeView, breakIntroView].forEach(view => view.classList.remove("active"));

    if (viewName === "timer") timerView.classList.add("active");
    if (viewName === "complete") completeView.classList.add("active");
    if (viewName === "breakIntro") breakIntroView.classList.add("active");
}

function renderSessionDots() {

    sessionDotsElement.innerHTML = "";

    for (let i = 0; i < timerConfig.sessionsUntilLongBreak; i++) {

        const dot = document.createElement("span");
        dot.className = `session-dot ${i < timerState.sessionCount ? "filled" : ""}`;

        sessionDotsElement.appendChild(dot);
    }
}

function renderTimer() {

    const minutes = Math.floor(timerState.remainingTime / 60);
    const seconds = timerState.remainingTime % 60;

    const formattedMinutes = String(minutes).padStart(2, "0");
    const formattedSeconds = String(seconds).padStart(2, "0");

    timerElement.textContent = `${formattedMinutes}:${formattedSeconds}`;

    sessionTypeElement.textContent = TIMER_MODE_LABELS[timerState.mode];

    sessionProgressElement.textContent =
        `Session ${Math.min(timerState.sessionCount + 1, timerConfig.sessionsUntilLongBreak)} of ${timerConfig.sessionsUntilLongBreak}`;

    const totalDuration = getDurationForMode(timerState.mode);
    const fraction = totalDuration > 0 ? timerState.remainingTime / totalDuration : 0;

    ringProgress.style.strokeDashoffset = String(RING_CIRCUMFERENCE * (1 - fraction));

    renderSessionDots();
    renderActiveTaskSelect();
}

function startTimer() {

    if (timerState.isRunning) {
        return;
    }

    timerState.isRunning = true;
    startButton.textContent = "⏸ Pause";

    timerState.intervalId = setInterval(() => {

        timerState.remainingTime--;
        renderTimer();

        if (timerState.remainingTime <= 0) {
            completeSession();
        }

    }, 1000);
}

function pauseTimer() {

    timerState.isRunning = false;

    clearInterval(timerState.intervalId);
    timerState.intervalId = null;

    startButton.textContent =
        timerState.mode === TIMER_MODES.FOCUS ? "▶ Start Focus" : "▶ Start";
}

function resetTimer() {

    clearInterval(timerState.intervalId);
    timerState.intervalId = null;
    timerState.isRunning = false;

    timerState.remainingTime = getDurationForMode(timerState.mode);

    startButton.textContent =
        timerState.mode === TIMER_MODES.FOCUS ? "▶ Start Focus" : "▶ Start";

    showView("timer");
    renderTimer();
}

function completeSession() {

    clearInterval(timerState.intervalId);
    timerState.intervalId = null;
    timerState.isRunning = false;

    const justFinishedMode = timerState.mode;
    const justFinishedFocusMinutes = Math.round(timerConfig.focusDuration / 60);

    if (justFinishedMode === TIMER_MODES.FOCUS && timerState.activeTaskId !== null) {

        const activeTask = tasks.find(task => task.id === timerState.activeTaskId);

        if (activeTask) {

            activeTask.pomodorosCompleted++;

            if (isLoggedIn()) {
                apiFetch(`/tasks/${activeTask.id}`, {
                    method: "PUT",
                    body: JSON.stringify(taskToServerPayload(activeTask))
                }).catch(error => console.error("Could not sync pomodoro count:", error));
            } else {
                saveTasks();
            }
        }
    }

    moveToNextMode();

    renderTimer();
    renderTasks();

    startButton.textContent = "▶ Start Focus";

    if (justFinishedMode === TIMER_MODES.FOCUS) {

        completedMinutesElement.textContent = justFinishedFocusMinutes;
        breakPreviewTimer.textContent = timerElement.textContent;

        showView("complete");

    } else {

        showView("timer");
    }
}

function getDurationForMode(mode) {

    if (mode === TIMER_MODES.FOCUS) return timerConfig.focusDuration;
    if (mode === TIMER_MODES.SHORT_BREAK) return timerConfig.shortBreakDuration;
    if (mode === TIMER_MODES.LONG_BREAK) return timerConfig.longBreakDuration;

    return timerConfig.focusDuration;
}

function moveToNextMode() {

    if (timerState.mode === TIMER_MODES.FOCUS) {

        timerState.sessionCount++;

        timerState.mode =
            timerState.sessionCount >= timerConfig.sessionsUntilLongBreak
                ? TIMER_MODES.LONG_BREAK
                : TIMER_MODES.SHORT_BREAK;

    } else if (timerState.mode === TIMER_MODES.SHORT_BREAK) {

        timerState.mode = TIMER_MODES.FOCUS;

    } else if (timerState.mode === TIMER_MODES.LONG_BREAK) {

        timerState.sessionCount = 0;
        timerState.mode = TIMER_MODES.FOCUS;
    }

    timerState.remainingTime = getDurationForMode(timerState.mode);
}

function goToNextFocusReady() {

    timerState.mode = TIMER_MODES.FOCUS;
    timerState.remainingTime = timerConfig.focusDuration;

    renderTimer();
    showView("timer");

    startButton.textContent = "▶ Start Focus";
}

startButton.addEventListener("click", function() {
    if (timerState.isRunning) {
        pauseTimer();
    } else {
        startTimer();
    }
});

resetButton.addEventListener("click", resetTimer);

takeBreakButton.addEventListener("click", function() {
    breakPreviewTimer.textContent = timerElement.textContent;
    showView("breakIntro");
});

startNextButton.addEventListener("click", goToNextFocusReady);

startBreakButton.addEventListener("click", function() {
    showView("timer");
    renderTimer();
    startTimer();
});

skipBreakButton.addEventListener("click", goToNextFocusReady);


// =========================================================
// SETTINGS
// =========================================================

const STEP_SIZES = {
    focusDuration: 1,
    shortBreakDuration: 1,
    longBreakDuration: 1,
    sessionsUntilLongBreak: 1
};

document.querySelectorAll(".stepper-btn").forEach(button => {

    button.addEventListener("click", function() {

        const targetId = button.dataset.target;
        const dir = Number(button.dataset.dir);
        const input = document.getElementById(targetId);

        const step = STEP_SIZES[targetId] || 1;
        const min = Number(input.min) || 1;

        const newValue = Math.max(min, Number(input.value) + dir * step);

        input.value = newValue;
    });
});

function populateSettingsInputs() {
    focusDurationInput.value = timerConfig.focusDuration / 60;
    shortBreakDurationInput.value = timerConfig.shortBreakDuration / 60;
    longBreakDurationInput.value = timerConfig.longBreakDuration / 60;
    sessionsUntilLongBreakInput.value = timerConfig.sessionsUntilLongBreak;
}

function saveTimerSettings() {

    const focusDuration = Number(focusDurationInput.value);
    const shortBreakDuration = Number(shortBreakDurationInput.value);
    const longBreakDuration = Number(longBreakDurationInput.value);
    const sessionsUntilLongBreak = Number(sessionsUntilLongBreakInput.value);

    if (focusDuration <= 0 || shortBreakDuration <= 0 || longBreakDuration <= 0 || sessionsUntilLongBreak <= 0) {
        return;
    }

    timerConfig.focusDuration = focusDuration * 60;
    timerConfig.shortBreakDuration = shortBreakDuration * 60;
    timerConfig.longBreakDuration = longBreakDuration * 60;
    timerConfig.sessionsUntilLongBreak = sessionsUntilLongBreak;

    resetTimer();
    closeModal(settingsOverlay);
    setActiveNav(navHome);
    setActiveBottomNav(bottomNavHome);
}

resetSettingsButton.addEventListener("click", function() {
    Object.assign(timerConfig, DEFAULT_TIMER_CONFIG);
    populateSettingsInputs();
});

saveSettingsButton.addEventListener("click", saveTimerSettings);


// =========================================================
// STICKY NOTES (floating, unchanged feature)
// =========================================================

const STICKY_NOTES_STORAGE_KEY = "pomodoro.stickyNotes";

let stickyNotes = loadStickyNotes();

function loadStickyNotes() {
    try {
        const stored = localStorage.getItem(STICKY_NOTES_STORAGE_KEY);
        const parsed = stored ? JSON.parse(stored) : [];
        return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
        return [];
    }
}

function saveStickyNotes() {
    try {
        localStorage.setItem(STICKY_NOTES_STORAGE_KEY, JSON.stringify(stickyNotes));
    } catch (error) {
        console.error("Could not save sticky notes:", error);
    }
}

function addStickyNote() {

    const note = {
        id: Date.now(),
        x: 80 + Math.random() * 120,
        y: 120 + Math.random() * 120,
        content: ""
    };

    stickyNotes.push(note);
    saveStickyNotes();
    renderStickyNotes();
}

function renderStickyNotes() {

    stickyNotesContainer.innerHTML = "";

    stickyNotes.forEach(note => {

        const noteElement = document.createElement("div");
        noteElement.className = "sticky-note";
        noteElement.style.left = `${note.x}px`;
        noteElement.style.top = `${note.y}px`;

        noteElement.innerHTML = `
    <button class="sticky-note-delete" data-id="${note.id}" aria-label="Delete note">×</button>
    <textarea class="sticky-note-content" data-id="${note.id}">${note.content}</textarea>
`;

        makeNoteDraggable(noteElement, note);

        stickyNotesContainer.appendChild(noteElement);
    });
}

function makeNoteDraggable(noteElement, note) {

    let isDragging = false;
    let offsetX = 0;
    let offsetY = 0;

    noteElement.addEventListener("pointerdown", function(event) {

        if (event.target.tagName === "TEXTAREA") {
            return;
        }

        isDragging = true;
        offsetX = event.clientX - note.x;
        offsetY = event.clientY - note.y;
    });

    document.addEventListener("pointermove", function(event) {

        if (!isDragging) {
            return;
        }

        note.x = event.clientX - offsetX;
        note.y = event.clientY - offsetY;

        noteElement.style.left = `${note.x}px`;
        noteElement.style.top = `${note.y}px`;
    });

    document.addEventListener("pointerup", function() {
        if (isDragging) {
            isDragging = false;
            saveStickyNotes();
        }
    });
}

stickyNotesContainer.addEventListener("click", function(event) {

    if (!event.target.classList.contains("sticky-note-delete")) {
        return;
    }

    const id = Number(event.target.dataset.id);

    stickyNotes = stickyNotes.filter(note => note.id !== id);

    saveStickyNotes();
    renderStickyNotes();
});

stickyNotesContainer.addEventListener("input", function(event) {

    if (!event.target.classList.contains("sticky-note-content")) {
        return;
    }

    const id = Number(event.target.dataset.id);
    const note = stickyNotes.find(note => note.id === id);

    if (note) {
        note.content = event.target.value;
        saveStickyNotes();
    }
});

stickyNotesButton.addEventListener("click", addStickyNote);


// =========================================================
// DRAGGABLE CARDS (Focus + Tasks)
// =========================================================

function makeCardDraggable(cardElement, storageKey) {

    const handle = cardElement.querySelector(".card-drag-handle");

    if (!handle) {
        return;
    }

    let isDragging = false;
    let offsetX = 0;
    let offsetY = 0;

    function pinInPlace(x, y, width) {

        cardElement.style.position = "fixed";
        cardElement.style.left = `${x}px`;
        cardElement.style.top = `${y}px`;
        cardElement.style.margin = "0";
        cardElement.style.zIndex = "50";
        cardElement.style.width = `${width}px`;
    }

    try {
        const saved = JSON.parse(localStorage.getItem(storageKey));
        if (saved) {
            pinInPlace(saved.x, saved.y, saved.width);
        }
    } catch (error) {
        // ignore corrupt saved position
    }

    handle.addEventListener("pointerdown", function(event) {

        isDragging = true;

        const rect = cardElement.getBoundingClientRect();

        pinInPlace(rect.left, rect.top, rect.width);

        offsetX = event.clientX - rect.left;
        offsetY = event.clientY - rect.top;

        event.preventDefault();
    });

    document.addEventListener("pointermove", function(event) {

        if (!isDragging) {
            return;
        }

        cardElement.style.left = `${event.clientX - offsetX}px`;
        cardElement.style.top = `${event.clientY - offsetY}px`;
    });

    document.addEventListener("pointerup", function() {

        if (!isDragging) {
            return;
        }

        isDragging = false;

        const rect = cardElement.getBoundingClientRect();

        localStorage.setItem(storageKey, JSON.stringify({
            x: rect.left,
            y: rect.top,
            width: rect.width
        }));
    });

    handle.addEventListener("dblclick", function() {

        cardElement.style.position = "";
        cardElement.style.left = "";
        cardElement.style.top = "";
        cardElement.style.margin = "";
        cardElement.style.zIndex = "";
        cardElement.style.width = "";

        localStorage.removeItem(storageKey);
    });
}


// =========================================================
// INIT
// =========================================================

updateAuthUI();

if (isLoggedIn()) {
    loadTasksFromServer();
}

renderTasks();
renderTimer();
resetTimer();

renderAmbiences();
renderAmbienceBackground();

renderSounds();
masterVolumeValue.textContent = `${masterVolume}%`;

renderNotes();
renderStickyNotes();

populateSettingsInputs();
setAuthMode("login");

makeCardDraggable(document.getElementById("focusCard"), "pomodoro.cardPos.focus");
makeCardDraggable(document.getElementById("tasksCard"), "pomodoro.cardPos.tasks");