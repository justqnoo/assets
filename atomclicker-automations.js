(function () {
    console.log("byzan.lol client loaded");
    console.log("david / justqnoo@github mrdavidss@discord")

    const font = document.createElement("link");
    font.rel = "stylesheet";
    font.href = "https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap";
    document.head.appendChild(font);

    const savedSettings = JSON.parse(localStorage.getItem("byzanSettings")) || {};
    let orbAutoClick = savedSettings.orbAutoClick ?? true;
    let atomAutoClick = savedSettings.atomAutoClick ?? true;
    let CPS = savedSettings.CPS ?? 20;
    let notificationsEnabled = savedSettings.notificationsEnabled ?? true;
    let outlineColor = savedSettings.outlineColor ?? "#6a5acd";
    let glowColor = savedSettings.glowColor ?? "#8a7bff";
    let notifColor = savedSettings.notifColor ?? "#8a7bff";

    const container = document.querySelector("#app") || document.body;
    let yellowOrbCount = 0;

    const notifContainer = document.createElement("div");
    Object.assign(notifContainer.style, {
        position: "fixed",
        top: "10px",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 999999999,
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        pointerEvents: "none",
        fontFamily: "'Poppins', sans-serif",
    });
    document.body.appendChild(notifContainer);

    const notifStyles = document.createElement("style");
    notifStyles.innerHTML = `
        @keyframes growIn {0% { opacity:0; transform:translateY(-15px) scale(0.95);}100% { opacity:1; transform:translateY(0) scale(1);}}
        @keyframes fadeOut {0% { opacity:1;}100% { opacity:0; transform:translateY(-15px) scale(0.95);}}
        @keyframes slideFadeIn {0% { opacity: 0; transform: translateY(-30px);} 100% { opacity:1; transform: translateY(0);}}
        .popupAnim { animation: growIn .4s ease forwards; }
        .popIn { animation: slideFadeIn 0.5s ease forwards; }
        @keyframes headerLineAnim { 0% {background-position: 0 0;} 50% {background-position: 100% 0;} 100% {background-position: 0 0;} }
    `;
    document.head.appendChild(notifStyles);

    function sendNotification(text) {
        if (!notificationsEnabled) return;
        const box = document.createElement("div");
        Object.assign(box.style, {
            background: notifColor,
            padding: "10px 16px",
            borderRadius: "8px",
            color: "white",
            fontSize: "14px",
            fontWeight: "500",
            boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
            fontFamily: "'Poppins', sans-serif",
        });
        box.innerText = text;
        box.classList.add("popupAnim");
        notifContainer.appendChild(box);
        setTimeout(() => {
            box.style.animation = "fadeOut .3s ease forwards";
            setTimeout(() => box.remove(), 300);
        }, 2300);
    }

    function saveSettings() {
        const settings = { orbAutoClick, atomAutoClick, CPS, notificationsEnabled, outlineColor, glowColor, notifColor };
        localStorage.setItem("byzanSettings", JSON.stringify(settings));
    }

    function createWindow(title, width = 250, contentHTML = "") {
        const win = document.createElement("div");
        Object.assign(win.style, {
            position: "fixed",
            background: "#111",
            color: "white",
            border: `2px solid ${outlineColor}`,
            borderRadius: "10px",
            paddingBottom: "8px",
            fontFamily: "'Poppins', sans-serif",
            zIndex: 99999999,
            userSelect: "none",
            boxShadow: `0 0 10px ${glowColor}`
        });

        const header = document.createElement("div");
        Object.assign(header.style, {
            width: "100%",
            padding: "10px",
            fontSize: "16px",
            fontWeight: "600",
            textAlign: "center",
            background: "#181818",
            borderBottom: `4px solid transparent`,
            position: "relative",
            cursor: "move",
        });
        header.innerText = title;
        win.appendChild(header);

        const headerLine = document.createElement("div");
        Object.assign(headerLine.style, {
            position: "absolute",
            bottom: "0",
            left: "0",
            width: "100%",
            height: "4px",
            background: `linear-gradient(90deg, ${outlineColor}, ${glowColor}, ${outlineColor})`,
            backgroundSize: "200% 100%",
            animation: "headerLineAnim 3s linear infinite",
            borderRadius: "2px"
        });
        header.appendChild(headerLine);

        const content = document.createElement("div");
        content.innerHTML = contentHTML;
        content.style.padding = "8px";
        win.appendChild(content);

        document.body.appendChild(win);
        win.classList.add("popIn");

        let dragging = false, offsetX = 0, offsetY = 0;
        header.addEventListener("mousedown", e => {
            dragging = true;
            offsetX = e.clientX - win.getBoundingClientRect().left;
            offsetY = e.clientY - win.getBoundingClientRect().top;
        });
        document.addEventListener("mousemove", e => {
            if (!dragging) return;
            win.style.left = e.clientX - offsetX + "px";
            win.style.top = e.clientY - offsetY + "px";
        });
        document.addEventListener("mouseup", e => {
            dragging = false;
        });

        return { win, content, header };
    }

    const headerWin = createWindow("byzan.lol client", 250);
    const miscWin = createWindow("Miscellaneous", 250, `
        <label><input type="checkbox" id="orbToggle"> Auto Orb Clicker</label><br><br>
        <label><input type="checkbox" id="atomToggle"> Auto Atom Clicker</label><br><br>
        <div id="cpsDropdown" style="background:#222;padding:6px;border-radius:6px;cursor:pointer;margin-bottom:8px;text-align:center;">Auto Atom Clicker Options ▼</div>
        <div id="cpsContent" style="display:none;padding-left:8px;">
            <label>CPS: <input id="cpsInput" type="number" style="width:60px;background:#111;color:white;border:1px solid #555;border-radius:4px;padding:3px;"></label>
        </div>
    `);
    const notifWin = createWindow("Notifications", 250, `<label><input type="checkbox" id="notifToggle"> Enable Notifications</label>`);

    const settingsButton = document.createElement("button");
    settingsButton.innerText = "Settings";
    Object.assign(settingsButton.style, {
        position: "fixed",
        top: headerWin.win.offsetTop + headerWin.win.offsetHeight + 10 + "px",
        left: window.innerWidth / 2 - 60 + "px",
        width: "120px",
        padding: "6px",
        border: `2px solid ${outlineColor}`,
        borderRadius: "8px",
        background: "#181818",
        color: "white",
        fontFamily: "'Poppins', sans-serif",
        cursor: "pointer",
        textAlign: "center",
        boxShadow: `0 0 10px ${glowColor}`,
        zIndex: 99999999,
        transition: "all 0.3s ease"
    });
    document.body.appendChild(settingsButton);

    settingsButton.addEventListener("mouseenter", () => {
        settingsButton.style.boxShadow = `0 0 20px ${glowColor}, 0 0 40px ${glowColor}`;
        settingsButton.style.transform = "scale(1.05)";
    });
    settingsButton.addEventListener("mouseleave", () => {
        settingsButton.style.boxShadow = `0 0 10px ${glowColor}`;
        settingsButton.style.transform = "scale(1)";
    });
    settingsButton.addEventListener("mousedown", () => { settingsButton.style.transform = "scale(0.95)"; });
    settingsButton.addEventListener("mouseup", () => { settingsButton.style.transform = "scale(1.05)"; });

    const settingsWin = createWindow("Visual Settings", 250, `
        <label>Outline Color: <input type="color" id="outlineColorInput" value="${outlineColor}"></label><br><br>
        <label>Glow Color: <input type="color" id="glowColorInput" value="${glowColor}"></label><br><br>
        <label>Notification Color: <input type="color" id="notifColorInput" value="${notifColor}"></label>
    `);
    settingsWin.win.style.display = "none";

    let settingsWinVisible = false;

    settingsButton.addEventListener("click", () => {
        settingsWinVisible = !settingsWinVisible;
        settingsWin.win.style.display = settingsWinVisible ? "block" : "none";
        settingsWin.win.style.left = notifWin.win.offsetLeft + "px";
        settingsWin.win.style.top = notifWin.win.offsetTop + notifWin.win.offsetHeight + 10 + "px";
    });

    const outlineColorInput = settingsWin.content.querySelector("#outlineColorInput");
    const glowColorInput = settingsWin.content.querySelector("#glowColorInput");
    const notifColorInput = settingsWin.content.querySelector("#notifColorInput");

    outlineColorInput.addEventListener("input", e => {
        outlineColor = e.target.value;
        headerWin.win.style.border = `2px solid ${outlineColor}`;
        headerWin.win.querySelector("div").style.background = `linear-gradient(90deg, ${outlineColor}, ${glowColor}, ${outlineColor})`;
        miscWin.win.style.border = `2px solid ${outlineColor}`;
        notifWin.win.style.border = `2px solid ${outlineColor}`;
        settingsWin.win.style.border = `2px solid ${outlineColor}`;
        settingsButton.style.border = `2px solid ${outlineColor}`;
        saveSettings();
    });

    glowColorInput.addEventListener("input", e => {
        glowColor = e.target.value;
        headerWin.win.querySelector("div").style.background = `linear-gradient(90deg, ${outlineColor}, ${glowColor}, ${outlineColor})`;
        headerWin.win.style.boxShadow = `0 0 10px ${glowColor}`;
        miscWin.win.style.boxShadow = `0 0 10px ${glowColor}`;
        notifWin.win.style.boxShadow = `0 0 10px ${glowColor}`;
        settingsWin.win.style.boxShadow = `0 0 10px ${glowColor}`;
        settingsButton.style.boxShadow = `0 0 10px ${glowColor}`;
        saveSettings();
    });

    notifColorInput.addEventListener("input", e => {
        notifColor = e.target.value;
        saveSettings();
    });

    function positionWindows() {
        const gap = 12;
        const leftStart = 20;
        miscWin.win.style.top = "100px";
        miscWin.win.style.left = leftStart + "px";
        notifWin.win.style.top = "100px";
        notifWin.win.style.left = leftStart + miscWin.win.offsetWidth + gap + "px";

        if (settingsWin.win.style.display !== "none") {
            settingsWin.win.style.left = notifWin.win.offsetLeft + "px";
            settingsWin.win.style.top = notifWin.win.offsetTop + notifWin.win.offsetHeight + 10 + "px";
        }

        headerWin.win.style.top = "20px";
        headerWin.win.style.left = window.innerWidth / 2 - headerWin.win.offsetWidth / 2 + "px";

        settingsButton.style.top = headerWin.win.offsetTop + headerWin.win.offsetHeight + 10 + "px";
        settingsButton.style.left = window.innerWidth / 2 - settingsButton.offsetWidth / 2 + "px";
    }
    window.addEventListener("resize", positionWindows);
    positionWindows();

    const orbToggle = miscWin.content.querySelector("#orbToggle");
    const atomToggle = miscWin.content.querySelector("#atomToggle");
    const cpsDropdown = miscWin.content.querySelector("#cpsDropdown");
    const cpsContent = miscWin.content.querySelector("#cpsContent");
    const cpsInput = miscWin.content.querySelector("#cpsInput");
    const notifToggle = notifWin.content.querySelector("#notifToggle");

    orbToggle.checked = orbAutoClick;
    atomToggle.checked = atomAutoClick;
    cpsInput.value = CPS;
    notifToggle.checked = notificationsEnabled;

    orbToggle.addEventListener("change", e => { orbAutoClick = e.target.checked; saveSettings(); });
    atomToggle.addEventListener("change", e => { atomAutoClick = e.target.checked; saveSettings(); });
    cpsDropdown.addEventListener("click", () => {
        cpsContent.style.display = cpsContent.style.display === "none" ? "block" : "none";
        cpsDropdown.innerText = cpsContent.style.display === "none" ? "Atom Clicker Options ▼" : "Atom Clicker Options ▲";
    });
    cpsInput.addEventListener("change", e => { CPS = parseFloat(e.target.value); saveSettings(); });
    notifToggle.addEventListener("change", e => { notificationsEnabled = e.target.checked; saveSettings(); });

    const orbObserver = new MutationObserver(mutations => {
        if (!orbAutoClick) return;
        for (const mut of mutations) {
            mut.addedNodes.forEach(node => {
                if (node.nodeType === 1 && node.classList.contains("power-up") && node.classList.contains("bonus-atom")) {
                    yellowOrbCount++;
                    node.click();
                    console.log(`%cYellow Orb Logged (${yellowOrbCount}) – ${new Date().toLocaleTimeString()}`, "color:yellow;font-weight:bold;");
                    sendNotification(`byzan client: Yellow Orb Count: ${yellowOrbCount}`);
                }
            });
        }
    });
    orbObserver.observe(container, { childList: true, subtree: true });

    setInterval(() => {
        if (!atomAutoClick) return;
        const nucleus = document.querySelector(".nucleus");
        if (nucleus) nucleus.click();
    }, 1000 / CPS);

    let tabsVisible = true;
    document.addEventListener("keydown", (e) => {
        if (e.key === "Tab") {
            e.preventDefault();
            tabsVisible = !tabsVisible;

            if (tabsVisible) {
                miscWin.win.style.display = "block";
                notifWin.win.style.display = "block";
                settingsWin.win.style.display = settingsWinVisible ? "block" : "none";
                headerWin.win.style.display = "block";
                settingsButton.style.display = "block";
                positionWindows();
            } else {
                miscWin.win.style.display = "none";
                notifWin.win.style.display = "none";
                settingsWin.win.style.display = "none";
                headerWin.win.style.display = "none";
                settingsButton.style.display = "none";
            }
        }
    });

})();
