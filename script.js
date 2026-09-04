const taskInput = document.getElementById("taskInput");
const addTaskButton = document.getElementById("addTaskButton");
const taskList = document.getElementById("taskList");
const timerElement = document.getElementById("timer");
const sessionTypeElement = document.getElementById("sessionType");
const startButton = document.getElementById("startButton");
const resetButton = document.getElementById("resetButton");
const sessionCountElement = document.getElementById("sessionCount");
const stickyNotesButton =
    document.getElementById("stickyNotesButton");

const stickyNotesContainer =
    document.getElementById("stickyNotesContainer");
const focusDurationInput =
    document.getElementById("focusDuration");

const shortBreakDurationInput =
    document.getElementById("shortBreakDuration");

const longBreakDurationInput =
    document.getElementById("longBreakDuration");

const sessionsUntilLongBreakInput =
    document.getElementById("sessionsUntilLongBreak");

const saveSettingsButton =
    document.getElementById("saveSettingsButton");

    const settingsButton =
    document.getElementById("settingsButton");

const settingsPanel =
    document.getElementById("settingsPanel");

const closeSettingsButton =
    document.getElementById("closeSettingsButton");

const sessionProgressElement =
    document.getElementById("sessionProgress");

const activeTaskElement =
    document.getElementById("activeTask");

const ambienceButton =
    document.getElementById("ambienceButton");

const ambiencePanel =
    document.getElementById("ambiencePanel");

const closeAmbienceButton =
    document.getElementById("closeAmbienceButton");

const ambienceList =
    document.getElementById("ambienceList");

const ambienceBackground =
    document.getElementById("ambienceBackground");

const prevDateButton =
    document.getElementById("prevDateButton");

const nextDateButton =
    document.getElementById("nextDateButton");

const dateLabelElement =
    document.getElementById("dateLabel");

// Point this at your deployed Java backend once it's live, e.g.
// "https://your-backend.up.railway.app/api"
const API_BASE_URL = "https://focusandbrew.netlify.app/api";

const accountButton =
    document.getElementById("accountButton");

const authPanel =
    document.getElementById("authPanel");

const closeAuthButton =
    document.getElementById("closeAuthButton");

const authTitle =
    document.getElementById("authTitle");

const authLoggedOutView =
    document.getElementById("authLoggedOutView");

const authLoggedInView =
    document.getElementById("authLoggedInView");

const authEmailInput =
    document.getElementById("authEmail");

const authPasswordInput =
    document.getElementById("authPassword");

const authSubmitButton =
    document.getElementById("authSubmitButton");

const authErrorElement =
    document.getElementById("authError");

const authToggleText =
    document.getElementById("authToggleText");

const authToggleButton =
    document.getElementById("authToggleButton");

const authUserEmailElement =
    document.getElementById("authUserEmail");

const logoutButton =
    document.getElementById("logoutButton");

const ambienceState = {
    selectedAmbienceId: null
};

const timerConfig = {
    focusDuration: 25 * 60,
    shortBreakDuration: 5 * 60,
    longBreakDuration: 15 * 60,
    sessionsUntilLongBreak: 4
};


const TIMER_MODES = {
    FOCUS: "focus",
    SHORT_BREAK: "shortBreak",
    LONG_BREAK: "longBreak"
};

const TIMER_MODE_LABELS = {
    [TIMER_MODES.FOCUS]: "FOCUS",
    [TIMER_MODES.SHORT_BREAK]: "SHORT BREAK",
    [TIMER_MODES.LONG_BREAK]: "LONG BREAK"
};

const timerState = {
    mode: TIMER_MODES.FOCUS,
    remainingTime: timerConfig.focusDuration,
    isRunning: false,
    sessionCount: 0,
    intervalId: null,
    activeTaskId: null
};

const ambiences = [
    {
        id: "none",
        name: "None",
        type: "none",
        source: null
    },

    {
        id: "rainy-room",
        name: "Rainy Room",
        type: "image",
        source: "assets/ambience/rainy-room.jpg"
    },

    {
        id: "forest",
        name: "Forest",
        type: "image",
        source: "assets/ambience/forest.jpg"
    }
];

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

    if (dateKey === todayKey) {
        return "Today";
    }

    if (dateKey === yesterdayKey) {
        return "Yesterday";
    }

    if (dateKey === tomorrowKey) {
        return "Tomorrow";
    }

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

        if (!stored) {
            return [];
        }

        const parsed = JSON.parse(stored);

        if (!Array.isArray(parsed)) {
            return [];
        }

        return parsed;

    } catch (error) {

        console.error("Could not load saved tasks:", error);

        return [];
    }
}

function saveTasks() {

    try {

        localStorage.setItem(
            TASKS_STORAGE_KEY,
            JSON.stringify(tasks)
        );

    } catch (error) {

        console.error("Could not save tasks:", error);
    }
}

const dateState = {
    selectedDate: getDateKey(new Date())
};

const AUTH_TOKEN_KEY = "pomodoro.authToken";
const AUTH_EMAIL_KEY = "pomodoro.authEmail";

const authState = {
    token: localStorage.getItem(AUTH_TOKEN_KEY),
    email: localStorage.getItem(AUTH_EMAIL_KEY),
    mode: "login" // or "register"
};

function isLoggedIn() {
    return Boolean(authState.token);
}

// Every authenticated request carries the JWT in the Authorization header.
// The token never appears in the URL, so it won't end up in server logs
// or browser history.
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
        // Token expired or invalid - sign the user out locally rather than
        // silently failing, so they know to log back in.
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

    // Fall back to whatever guest tasks were saved locally before login
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
        authErrorElement.textContent = "";
    }
}

function setAuthMode(mode) {

    authState.mode = mode;

    authErrorElement.textContent = "";

    if (mode === "login") {

        authTitle.textContent = "Log In";
        authSubmitButton.textContent = "Log In";
        authToggleText.textContent = "Don't have an account?";
        authToggleButton.textContent = "Sign up";

    } else {

        authTitle.textContent = "Sign Up";
        authSubmitButton.textContent = "Sign Up";
        authToggleText.textContent = "Already have an account?";
        authToggleButton.textContent = "Log in";
    }
}

async function handleAuthSubmit() {

    const email = authEmailInput.value.trim();
    const password = authPasswordInput.value;

    authErrorElement.textContent = "";

    if (!email || !password) {
        authErrorElement.textContent = "Please fill in both fields.";
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

        authPanel.classList.remove("open");

        await loadTasksFromServer();

    } catch (error) {

        authErrorElement.textContent =
            error.message || "Something went wrong.";
    }
}

accountButton.addEventListener("click", function() {
    authPanel.classList.toggle("open");
});

closeAuthButton.addEventListener("click", function() {
    authPanel.classList.remove("open");
});

authToggleButton.addEventListener("click", function() {
    setAuthMode(authState.mode === "login" ? "register" : "login");
});

authSubmitButton.addEventListener("click", handleAuthSubmit);

authPasswordInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        handleAuthSubmit();
    }
});

logoutButton.addEventListener("click", logout);

document.addEventListener("click", function(event) {

    const clickedInsideAuth = authPanel.contains(event.target);
    const clickedAccountButton = accountButton.contains(event.target);

    if (!clickedInsideAuth && !clickedAccountButton) {
        authPanel.classList.remove("open");
    }
});

let tasks = isLoggedIn() ? [] : loadTasks();

let stickyNotes = [];

settingsButton.addEventListener("click", function() {

    settingsPanel.classList.add("open");

});

closeSettingsButton.addEventListener("click", function() {

    settingsPanel.classList.remove("open");

});

prevDateButton.addEventListener("click", function() {

    dateState.selectedDate =
        addDays(dateState.selectedDate, -1);

    renderTasks();
});

nextDateButton.addEventListener("click", function() {

    dateState.selectedDate =
        addDays(dateState.selectedDate, 1);

    renderTasks();
});

dateLabelElement.addEventListener("click", function() {

    dateState.selectedDate = getDateKey(new Date());

    renderTasks();
});

addTaskButton.addEventListener("click", addTask);

taskInput.addEventListener("keydown", function(event) {

    if (event.key === "Enter") {
        addTask();
    }

});


startButton.addEventListener("click", function() {

    if (timerState.isRunning) {
        pauseTimer();
    } else {
        startTimer();
    }

});

resetButton.addEventListener("click", resetTimer);

saveSettingsButton.addEventListener(
    "click",
    saveTimerSettings
);

document.addEventListener("click", function(event) {

    const clickedInsidePanel =
        settingsPanel.contains(event.target);

    const clickedSettingsButton =
        settingsButton.contains(event.target);

    if (!clickedInsidePanel && !clickedSettingsButton) {
        settingsPanel.classList.remove("open");
    }

});

stickyNotesButton.addEventListener(
    "click",
    addStickyNote
);

stickyNotesContainer.addEventListener(
    "input",
    function(event) {

        if (
            !event.target.classList.contains(
                "sticky-note-content"
            )
        ) {
            return;
        }

        const noteId =
            Number(event.target.dataset.id);

        const note =
            stickyNotes.find(
                note => note.id === noteId
            );

        if (!note) {
            return;
        }

        note.content =
            event.target.value;
    }
);

stickyNotesContainer.addEventListener(
    "click",
    function(event) {

        if (
            !event.target.classList.contains(
                "delete-note"
            )
        ) {
            return;
        }

        const noteId =
            Number(event.target.dataset.id);

        stickyNotes =
            stickyNotes.filter(
                note => note.id !== noteId
            );

        renderStickyNotes();
    }
);

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

        const task = {
            id: Date.now(),
            title: taskText,
            completed: false,
            pomodorosCompleted: 0,
            date: dateState.selectedDate
        };

        tasks.push(task);

        saveTasks();
    }

    renderTasks();
}


function renderTasks() {

    dateLabelElement.textContent =
        formatDateLabel(dateState.selectedDate);

    taskList.innerHTML = "";

    const tasksForDate = tasks.filter(
        task => task.date === dateState.selectedDate
    );

    if (tasksForDate.length === 0) {

        taskList.innerHTML = `
            <p class="empty-state">
                No tasks yet. Add something you want to accomplish. 🌱
            </p>
        `;

        return;
    }

    tasksForDate.forEach(task => {

        const taskElement = document.createElement("div");

        taskElement.className = "task";

        taskElement.innerHTML = `
            <input
                type="checkbox"
                class="task-checkbox"
                data-id="${task.id}"
                ${task.completed ? "checked" : ""}
            >

            <span class="${task.completed ? "completed" : ""}">
    ${task.title}
</span>

<span class="task-pomodoros">
    🍅 ${task.pomodorosCompleted}
</span>

<button
    class="focus-task"
    data-id="${task.id}"
>
    Focus
</button>

<button
    class="delete-task"
    data-id="${task.id}"
>
    🗑️
</button>
        `;

        taskList.appendChild(taskElement);
    });
}

taskList.addEventListener("click", async function(event) {

    if (event.target.classList.contains("delete-task")) {

        const taskId =
            Number(event.target.dataset.id);

        if (isLoggedIn()) {

            try {
                await apiFetch(`/tasks/${taskId}`, { method: "DELETE" });
            } catch (error) {
                console.error("Could not delete task on server:", error);
                return;
            }
        }

        tasks = tasks.filter(
            task => task.id !== taskId
        );

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

        const taskId =
            Number(event.target.dataset.id);

        focusOnTask(taskId);
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


function renderTimer() {

    const minutes = Math.floor(timerState.remainingTime / 60);

    const seconds = timerState.remainingTime % 60;

    const formattedMinutes = String(minutes).padStart(2, "0");

    const formattedSeconds = String(seconds).padStart(2, "0");

    const activeTask =
    tasks.find(
        task => task.id === timerState.activeTaskId
    );

if (activeTask) {

    activeTaskElement.textContent =
        activeTask.title;

} else {

    activeTaskElement.textContent =
        "No task selected";

}

    timerElement.textContent =
        `${formattedMinutes}:${formattedSeconds}`;

    sessionTypeElement.textContent =
    TIMER_MODE_LABELS[timerState.mode];

    sessionProgressElement.textContent =
    `Session ${Math.min(
        timerState.sessionCount + 1,
        timerConfig.sessionsUntilLongBreak
    )} of ${timerConfig.sessionsUntilLongBreak}`;
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

    startButton.textContent = "▶ Start";
}


function resetTimer() {

    clearInterval(timerState.intervalId);

    timerState.intervalId = null;

    timerState.isRunning = false;

    timerState.remainingTime =
        getDurationForMode(timerState.mode);

    startButton.textContent = "▶ Start";

    renderTimer();
}


function completeSession() {

    clearInterval(timerState.intervalId);

    timerState.intervalId = null;

    timerState.isRunning = false;


    if (
        timerState.mode === TIMER_MODES.FOCUS &&
        timerState.activeTaskId !== null
    ) {

        const activeTask =
            tasks.find(
                task =>
                    task.id === timerState.activeTaskId
            );

        if (activeTask) {
            activeTask.pomodorosCompleted++;

            if (isLoggedIn()) {

                apiFetch(`/tasks/${activeTask.id}`, {
                    method: "PUT",
                    body: JSON.stringify(taskToServerPayload(activeTask))
                }).catch(error =>
                    console.error("Could not sync pomodoro count:", error)
                );

            } else {

                saveTasks();
            }
        }
    }


    moveToNextMode();

    startButton.textContent = "▶ Start";

    renderTimer();
    renderTasks();
}

function getDurationForMode(mode) {

    if (mode === TIMER_MODES.FOCUS) {
        return timerConfig.focusDuration;
    }

    if (mode === TIMER_MODES.SHORT_BREAK) {
        return timerConfig.shortBreakDuration;
    }

    if (mode === TIMER_MODES.LONG_BREAK) {
        return timerConfig.longBreakDuration;
    }

    return timerConfig.focusDuration;
}

function saveTimerSettings() {

    const focusDuration =
        Number(focusDurationInput.value);

    const shortBreakDuration =
        Number(shortBreakDurationInput.value);

    const longBreakDuration =
        Number(longBreakDurationInput.value);

    const sessionsUntilLongBreak =
        Number(sessionsUntilLongBreakInput.value);


    if (
        focusDuration <= 0 ||
        shortBreakDuration <= 0 ||
        longBreakDuration <= 0 ||
        sessionsUntilLongBreak <= 0
    ) {
        return;
    }


    timerConfig.focusDuration =
        focusDuration * 60;

    timerConfig.shortBreakDuration =
        shortBreakDuration * 60;

    timerConfig.longBreakDuration =
        longBreakDuration * 60;

    timerConfig.sessionsUntilLongBreak =
    sessionsUntilLongBreak;

resetTimer();

settingsPanel.classList.remove("open");
}

function moveToNextMode() {

    if (timerState.mode === TIMER_MODES.FOCUS) {

        timerState.sessionCount++;

        if (
            timerState.sessionCount >=
            timerConfig.sessionsUntilLongBreak
        ) {

            timerState.mode =
                TIMER_MODES.LONG_BREAK;

        } else {

            timerState.mode =
                TIMER_MODES.SHORT_BREAK;
        }

    } else if (
        timerState.mode === TIMER_MODES.SHORT_BREAK
    ) {

        timerState.mode =
            TIMER_MODES.FOCUS;

    } else if (
        timerState.mode === TIMER_MODES.LONG_BREAK
    ) {

        timerState.sessionCount = 0;

        timerState.mode =
            TIMER_MODES.FOCUS;
    }


    timerState.remainingTime =
        getDurationForMode(timerState.mode);
}

function addStickyNote() {

    const note = {
        id: Date.now(),
        content: "",
        position: {
            x: 100,
            y: 100
        }
    };

    stickyNotes.push(note);

    renderStickyNotes();
}

function renderStickyNotes() {

    stickyNotesContainer.innerHTML = "";

    stickyNotes.forEach(note => {

        const noteElement =
            document.createElement("div");

        noteElement.className = "sticky-note";

        noteElement.dataset.id = note.id;

        noteElement.style.left =
            `${note.position.x}px`;

        noteElement.style.top =
            `${note.position.y}px`;

        noteElement.innerHTML = `
            <div class="sticky-note-header">

                <span>🗒️</span>

                <button
                    class="delete-note"
                    data-id="${note.id}"
                >
                    🗑️
                </button>

            </div>

            <textarea
                class="sticky-note-content"
                data-id="${note.id}"
                placeholder="Write something..."
            >${note.content}</textarea>

        `;

        stickyNotesContainer.appendChild(
            noteElement
        );

    makeNoteDraggable(
    noteElement,
    note
);
    });
}

function focusOnTask(taskId) {

    const task =
        tasks.find(task => task.id === taskId);

    if (!task) {
        return;
    }

    timerState.activeTaskId = task.id;

    timerState.mode = TIMER_MODES.FOCUS;

    timerState.remainingTime =
        timerConfig.focusDuration;

    timerState.isRunning = false;

    clearInterval(timerState.intervalId);

    timerState.intervalId = null;

    startButton.textContent = "▶ Start";

    renderTimer();
    renderTasks();
}

function renderAmbiences() {

    ambienceList.innerHTML = "";

    ambiences.forEach(ambience => {

        const ambienceElement =
            document.createElement("button");

        const isSelected =
    ambience.type === "none"
        ? ambienceState.selectedAmbienceId === null
        : ambienceState.selectedAmbienceId === ambience.id;

ambienceElement.className =
    `ambience-card ${isSelected ? "selected" : ""}`;

        ambienceElement.dataset.id =
            ambience.id;

        ambienceElement.innerHTML = `
    <div class="ambience-preview">

        ${
            ambience.type === "none"
            ?
            `<div class="no-ambience-preview">
                🚫
            </div>`
            :
            ambience.type === "video"
            ?
            `<video
                src="${ambience.source}"
                muted
                loop
                autoplay
            ></video>`
            :
            `<img
                src="${ambience.source}"
                alt="${ambience.name}"
            >`
        }

    </div>

    <span>${ambience.name}</span>
`;

        ambienceList.appendChild(
            ambienceElement
        );
    });
}


ambienceList.addEventListener(
    "click",
    function(event) {

        const card =
            event.target.closest(".ambience-card");

        if (!card) {
            return;
        }

        selectAmbience(card.dataset.id);
    }
);

function selectAmbience(ambienceId) {

    const ambience =
        ambiences.find(
            item => item.id === ambienceId
        );

    if (!ambience) {
        return;
    }

    if (ambience.type === "none") {

        ambienceState.selectedAmbienceId = null;

    } else {

        ambienceState.selectedAmbienceId =
            ambience.id;
    }

    renderAmbienceBackground();

    renderAmbiences();
}

function renderAmbienceBackground() {

    ambienceBackground.innerHTML = "";

    ambienceBackground.style.backgroundImage =
        "none";

    const ambience =
        ambiences.find(
            item =>
                item.id ===
                ambienceState.selectedAmbienceId
        );

    if (!ambience) {
        return;
    }

    if (ambience.type === "none") {
        return;
    }

    if (ambience.type === "image") {

        ambienceBackground.style.backgroundImage =
            `url("${ambience.source}")`;

        return;
    }

    if (ambience.type === "video") {

        const video =
            document.createElement("video");

        video.src = ambience.source;

        video.autoplay = true;
        video.loop = true;
        video.muted = true;
        video.playsInline = true;

        ambienceBackground.appendChild(video);
    }
}

ambienceButton.addEventListener(
    "click",
    function() {

        ambiencePanel.classList.add("open");

    }
);

closeAmbienceButton.addEventListener(
    "click",
    function() {

        ambiencePanel.classList.remove("open");

    }
);

document.addEventListener(
    "click",
    function(event) {

        const clickedInsideAmbience =
            ambiencePanel.contains(event.target);

        const clickedAmbienceButton =
            ambienceButton.contains(event.target);

        if (
            !clickedInsideAmbience &&
            !clickedAmbienceButton
        ) {

            ambiencePanel.classList.remove(
                "open"
            );
        }
    }
);


function makeNoteDraggable(noteElement, note) {

    let isDragging = false;

    let offsetX = 0;
    let offsetY = 0;


    noteElement.addEventListener(
        "pointerdown",
        function(event) {

            if (
                event.target.closest(
                    ".sticky-note-content"
                )
            ) {
                return;
            }

            if (
                event.target.closest(
                    ".delete-note"
                )
            ) {
                return;
            }


            isDragging = true;

            noteElement.setPointerCapture(
                event.pointerId
            );


            const rect =
                noteElement.getBoundingClientRect();


            offsetX =
                event.clientX - rect.left;

            offsetY =
                event.clientY - rect.top;


            noteElement.style.zIndex = "200";

            noteElement.classList.add(
                "dragging"
            );

        }
    );


    noteElement.addEventListener(
        "pointermove",
        function(event) {

            if (!isDragging) {
                return;
            }


            const x =
                event.clientX - offsetX;

            const y =
                event.clientY - offsetY;


            note.position.x = x;
            note.position.y = y;


            noteElement.style.left =
                `${x}px`;

            noteElement.style.top =
                `${y}px`;

        }
    );


    noteElement.addEventListener(
        "pointerup",
        function(event) {

            if (!isDragging) {
                return;
            }


            isDragging = false;


            noteElement.releasePointerCapture(
                event.pointerId
            );


            noteElement.classList.remove(
                "dragging"
            );

        }
    );


    noteElement.addEventListener(
        "pointercancel",
        function(event) {

            isDragging = false;


            if (
                noteElement.hasPointerCapture(
                    event.pointerId
                )
            ) {

                noteElement.releasePointerCapture(
                    event.pointerId
                );

            }


            noteElement.classList.remove(
                "dragging"
            );

        }
    );

}

renderTasks();
renderTimer();
renderAmbiences();
renderAmbienceBackground();

setAuthMode("login");
updateAuthUI();

if (isLoggedIn()) {
    loadTasksFromServer();
}

