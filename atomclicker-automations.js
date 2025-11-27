(function () {
    console.clear();
    console.log("%cbyzan.lol client injected", "color:#8a7bff;font-weight:bold;font-size:20px;");
    console.log("%cMade by justqnoo@github", "color:#aaa;font-size:14px;");

    const font = document.createElement("link");
    font.rel = "stylesheet";
    font.href = "https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap";
    document.head.appendChild(font);

    const DEFAULT_SETTINGS = {
        orbAutoClick: true, atomAutoClick: true, CPS: 20, orbClickDelay: 0,
        notificationsEnabled: true, outlineColor: "#6a5acd", glowColor: "#8a7bff",
        notifColor: "#8a7bff", headerLineEnabled: false
    };
    let settings = { ...DEFAULT_SETTINGS };
    try { const s = localStorage.getItem('byzanSettings'); if(s) settings = {...DEFAULT_SETTINGS, ...JSON.parse(s)}; } catch(e) {}
    const save = () => localStorage.setItem('byzanSettings', JSON.stringify(settings));

    let { orbAutoClick, atomAutoClick, CPS, orbClickDelay, notificationsEnabled,
          outlineColor, glowColor, notifColor, headerLineEnabled } = settings;

    const container = document.querySelector("#app") || document.body;
    let yellowOrbCount = 0;

    document.head.insertAdjacentHTML("beforeend", `
        <style>
            @keyframes slideIn { from { opacity:0; transform:translateY(-15px) scale(0.96); } to { opacity:1; transform:translateY(0) scale(1); } }
            @keyframes popIn { from { opacity:0; transform:scale(0.85); } to { opacity:1; transform:scale(1); } }
            @keyframes fadeIn { from { opacity:0; transform:scale(0.94); } to { opacity:1; transform:scale(1); } }
            @keyframes fadeOut { from { opacity:1; transform:scale(1); } to { opacity:0; transform:scale(0.94); } }
            .smooth { animation: slideIn 0.45s ease forwards; }
            .smooth-btn { animation: popIn 0.35s ease forwards; }
            .n { animation: popIn 0.4s ease; }
            .win-fade.fade-in  { animation: fadeIn 0.28s cubic-bezier(.67,0,.33,1) forwards !important; }
            .win-fade.fade-out { animation: fadeOut 0.28s cubic-bezier(.67,0,.33,1) forwards !important; }
        </style>
    `);

    const notifBox = document.createElement("div");
    Object.assign(notifBox.style, {
        position:"fixed", top:"15px", left:"50%", transform:"translateX(-50%)",
        zIndex:999999999, display:"flex", flexDirection:"column", gap:"10px",
        pointerEvents:"none", fontFamily:"'Poppins',sans-serif"
    });
    document.body.appendChild(notifBox);

    const notify = text => {
        if (!notificationsEnabled) return;
        const n = document.createElement("div");
        n.className = "n";
        n.textContent = text;
        Object.assign(n.style, {
            background: notifColor, padding: "11px 26px", borderRadius: "12px",
            color: "white", fontWeight: "600", fontSize: "15px",
            boxShadow: "0 8px 30px rgba(0,0,0,0.5)"
        });
        notifBox.appendChild(n);
        setTimeout(() => { n.style.animation = "fadeOut 0.5s forwards"; setTimeout(() => n.remove(), 500); }, 2600);
    };

    let yellowOrbLogCount = 0;
    function logYellowOrb() {
        yellowOrbLogCount++;
        const now = new Date();
        const dateString = now.toLocaleDateString();
        const timeString = now.toLocaleTimeString();
        console.log(
            `%c[Yellow Orb]#${yellowOrbLogCount}%c at %c${dateString} ${timeString}`,
            "color:#ffe066;font-weight:bold;",
            "color:#aaa;",
            "color:#8a7bff;"
        );
    }

    const createWin = (title, html = "", drag = true, width = "260px") => {
        const w = document.createElement("div");
        w.classList.add("smooth", "win-fade");
        Object.assign(w.style, {
            position: "fixed", background: "#0f0f0f", color: "white",
            border: `3px solid ${outlineColor}`, borderRadius: "14px",
            width, minWidth: width, paddingBottom: "10px",
            fontFamily: "'Poppins',sans-serif", zIndex: 99999999,
            userSelect: "none", boxShadow: `0 0 22px ${glowColor}90`
        });

        const h = document.createElement("div");
        Object.assign(h.style, {
            padding: "11px", background: "#1a1a1a", textAlign: "center",
            fontWeight: "700", fontSize: "16px", cursor: drag ? "move" : "default",
            borderRadius: "11px 11px 0 0", position: "relative"
        });
        h.textContent = title;
        w.appendChild(h);

        if (headerLineEnabled) {
            h.insertAdjacentHTML("beforeend", `<div style="position:absolute;bottom:0;left:0;width:100%;height:4px;background:linear-gradient(90deg,${outlineColor},${glowColor},${outlineColor});background-size:300%;animation:headerLineAnim 4s linear infinite"></div>`);
        }

        const b = document.createElement("div");
        b.innerHTML = html;
        b.style.padding = "10px";
        w.appendChild(b);
        document.body.appendChild(w);

        if (drag) {
            let dragging = false, ox, oy;
            h.onmousedown = e => { dragging = true; ox = e.clientX - w.offsetLeft; oy = e.clientY - w.offsetTop; };
            document.onmousemove = e => { if(dragging){ w.style.left = (e.clientX - ox) + "px"; w.style.top = (e.clientY - oy) + "px"; } };
            document.onmouseup = () => dragging = false;
        }
        return { win: w, body: b, head: h };
    };

    const headerWin = createWin("byzan.lol client v0.1", `
        <button id="settingsBtn" class="smooth-btn" style="
            display:block; margin:8px auto 4px; padding:7px 0; width:88%;
            background:#222; border:2px solid ${outlineColor}; border-radius:9px;
            color:white; font-weight:600; font-size:14px; cursor:pointer;
            box-shadow:0 0 10px ${glowColor}; transition:all 0.2s;
        ">Visual Settings</button>
    `, false, "300px");

    const miscWin = createWin("Miscellaneous", `
        <label><input type="checkbox" id="orb"> Auto Orb Clicker</label><br><br>
        <div id="orbDrop" style="background:#222;padding:8px;border-radius:7px;cursor:pointer;text-align:center;font-weight:600;font-size:14px">Orb Options</div>
        <div id="orbContent" style="display:none;padding-top:8px">Delay (ms): <input id="orbDelay" type="number" min="0" max="5000" value="${orbClickDelay}" style="width:78px;background:#111;color:white;border:1px solid #555;border-radius:5px;padding:3px"></div><br>
        <label><input type="checkbox" id="atom"> Auto Atom Clicker</label><br><br>
        <div id="atomDrop" style="background:#222;padding:8px;border-radius:7px;cursor:pointer;text-align:center;font-weight:600;font-size:14px">Atom Options</div>
        <div id="atomContent" style="display:none;padding-top:8px">CPS: <input id="cpsInput" type="number" min="1" max="100" value="${CPS}" style="width:78px;background:#111;color:white;border:1px solid #555;border-radius:5px;padding:3px"></div>
    `, true, "260px");

    const notifWin = createWin("Notifications", `<label style="font-size:15px"><input type="checkbox" id="noti"> Enable Notifications</label>`, true, "260px");

    const settingsWin = createWin("Visual Settings", `
        <label style="font-size:14px">Outline <input type="color" id="ocol" value="${outlineColor}"></label><br><br>
        <label style="font-size:14px">Glow    <input type="color" id="gcol" value="${glowColor}"></label><br><br>
        <label style="font-size:14px">Notif   <input type="color" id="ncol" value="${notifColor}"></label><br><br>
        <label style="font-size:14px"><input type="checkbox" id="hline" ${headerLineEnabled?"checked":""}> Header Line</label>
    `, true, "240px");

    settingsWin.win.style.display = "none";
    let settingsOpen = false;

    headerWin.body.querySelector("#settingsBtn").onclick = () => {
        settingsOpen = !settingsOpen;
        settingsWin.win.style.display = settingsOpen ? "block" : "none";
        if (settingsOpen) {
            settingsWin.win.style.opacity = "0";
            setTimeout(() => settingsWin.win.style.animation = "slideIn 0.45s ease forwards", 20);
            position();
        }
    };

    miscWin.body.querySelector("#orbDrop").onclick = e => { e.stopPropagation(); const c = miscWin.body.querySelector("#orbContent"); c.style.display = c.style.display === "block" ? "none" : "block"; };
    miscWin.body.querySelector("#atomDrop").onclick = e => { e.stopPropagation(); const c = miscWin.body.querySelector("#atomContent"); c.style.display = c.style.display === "block" ? "none" : "block"; };

    miscWin.body.querySelector("#orb").checked = orbAutoClick;
    miscWin.body.querySelector("#atom").checked = atomAutoClick;
    notifWin.body.querySelector("#noti").checked = notificationsEnabled;

    miscWin.body.querySelector("#orb").onchange = () => { orbAutoClick = this.checked; settings.orbAutoClick = orbAutoClick; save(); };
    miscWin.body.querySelector("#atom").onchange = () => { atomAutoClick = this.checked; settings.atomAutoClick = atomAutoClick; save(); };
    notifWin.body.querySelector("#noti").onchange = () => { notificationsEnabled = this.checked; settings.notificationsEnabled = notificationsEnabled; save(); };
    miscWin.body.querySelector("#orbDelay").onchange = e => { orbClickDelay = Math.max(0, Math.min(5000, +e.target.value || 0)); settings.orbClickDelay = orbClickDelay; save(); };
    miscWin.body.querySelector("#cpsInput").onchange = e => { CPS = Math.max(1, Math.min(100, +e.target.value || 1)); settings.CPS = CPS; save(); };

    settingsWin.body.querySelector("#ocol").oninput = e => { outlineColor = e.target.value; settings.outlineColor = outlineColor; updateColors(); save(); };
    settingsWin.body.querySelector("#gcol").oninput = e => { glowColor = e.target.value; settings.glowColor = glowColor; updateColors(); save(); };
    settingsWin.body.querySelector("#ncol").oninput = e => { notifColor = e.target.value; settings.notifColor = notifColor; save(); };
    settingsWin.body.querySelector("#hline").onchange = () => { headerLineEnabled = this.checked; settings.headerLineEnabled = headerLineEnabled; save(); location.reload(); };

    function updateColors() {
        [headerWin.win, miscWin.win, notifWin.win, settingsWin.win].forEach(el => {
            el.style.borderColor = outlineColor;
            el.style.boxShadow = `0 0 22px ${glowColor}90`;
        });
        headerWin.body.querySelector("#settingsBtn").style.borderColor = outlineColor;
        headerWin.body.querySelector("#settingsBtn").style.boxShadow = `0 0 10px ${glowColor}`;
    }

if (container) {
    new MutationObserver(muts => {
        if (!orbAutoClick) return;

        muts.forEach(m => m.addedNodes.forEach(n => {
            if (
                n.nodeType === 1 &&
                n.classList?.contains("power-up") &&
                n.classList?.contains("bonus-atom")
            ) {
                yellowOrbCount++;

                // LOG when orb is detected
                console.log(
                    `%c[ORBS] Yellow Orb Detected (#${yellowOrbCount})`,
                    "color: yellow; font-weight: bold;"
                );

                setTimeout(() => {
                    n.click?.();

                    // LOG when orb is clicked
                    console.log(
                        `%c[ORBS] Yellow Orb Clicked (#${yellowOrbCount})`,
                        "color: yellow; font-weight: bold;"
                    );

                    notify(`Yellow Orb #${yellowOrbCount}`);
                }, orbClickDelay);
            }
        }));
    }).observe(container, { childList: true, subtree: true });
}

    setInterval(() => { if (atomAutoClick) document.querySelector(".nucleus")?.click(); }, 1000 / CPS);

    const position = () => {
        const gap = 18;
        const topY = 108;

        headerWin.win.style.right = "20px";
        headerWin.win.style.top = "20px";
        headerWin.win.style.left = "auto";

        miscWin.win.style.left = "20px";
        miscWin.win.style.top = topY + "px";

        const notifX = 20 + miscWin.win.offsetWidth + gap;
        notifWin.win.style.left = notifX + "px";
        notifWin.win.style.top = topY + "px";

        if (settingsOpen) {
            const settingsX = notifX + notifWin.win.offsetWidth + gap;
            settingsWin.win.style.left = settingsX + "px";
            settingsWin.win.style.top = topY + "px";
        }
    };
    window.addEventListener("resize", position);

    let visible = true;
    document.addEventListener("keydown", e => {
        if (e.key === "Tab") {
            e.preventDefault();
            visible = !visible;

            const windows = [headerWin.win, miscWin.win, notifWin.win];
            if (settingsOpen) windows.push(settingsWin.win);

            windows.forEach(win => {
                win.classList.remove("fade-in", "fade-out");
                if (visible) {
                    win.style.display = "block";
                    void win.offsetWidth;
                    win.classList.add("fade-in");
                } else {
                    win.classList.add("fade-out");
                    setTimeout(() => {
                        if (!visible) win.style.display = "none";
                        win.classList.remove("fade-out");
                    }, 280);
                }
            });
        }
    });

    const overlay = document.createElement("div");
    overlay.style.cssText = "position:fixed;inset:0;background:#000d;backdrop-filter:blur(12px);z-index:999999999;display:flex;align-items:center;justify-content:center;";
    overlay.innerHTML = `<div class="smooth" style="background:#111;border:4px solid #ff4444;border-radius:18px;padding:45px 40px;max-width:500px;color:white;text-align:center;font-family:'Poppins',sans-serif;box-shadow:0 0 60px #f4444480;opacity:0;">
        <h2 style="color:#ff4444;margin:0 0 20px;font-size:28px;">WARNING</h2>
        <p style="font-size:18px;margin:20px 0;">Automation may violate game ToS — <strong>use at your own risk</strong>.</p>
        <p style="font-size:19px;margin:25px 0;">Bans are possible.</p>
        <button id="ok" style="background:#ff4444;padding:16px 50px;border:none;border-radius:12px;color:white;font-weight:700;cursor:pointer;font-size:17px;">I Understand — Open Client</button>
    </div>`;
    document.body.appendChild(overlay);
    overlay.querySelector("#ok").onclick = () => {
        overlay.style.animation = "fadeOut 0.6s forwards";
        setTimeout(() => overlay.remove(), 600);
        [headerWin.win, miscWin.win, notifWin.win].forEach(el => el.style.display = "block");
        position();
    };

    position();
})();
