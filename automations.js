(function () {
    const style = document.createElement("style");
    style.textContent = `
        .byzan-loading { position: fixed; inset: 0; background: #0d0d0d; z-index: 999999999;
            display: flex; flex-direction: column; align-items: center; justify-content: center;
            pointer-events: all; transition: opacity .6s ease, visibility .6s ease }
        .byzan-loading.hidden { opacity: 0; visibility: hidden; pointer-events: none }
        .byzan-logo { width: 320px; height: 320px; animation: ghost-pulse 2s infinite; display: block }
        .byzan-bar { width: 320px; height: 8px; background: rgba(180,199,254,.2);
            border-radius: 4px; overflow: hidden; margin-top: 22px }
        .byzan-progress { height: 100%; width: 0%; background: linear-gradient(90deg,#b4c7fe,#93baf6);
            border-radius: 4px; transition: width .4s ease }
        .byzan-txt { color: #aaa; margin-top: 10px; font-size: 15px; font-family: system-ui, sans-serif }
        @keyframes ghost-pulse { 0%,10% { filter: drop-shadow(0 0 0px rgba(180,199,254,0)) }
            70% { filter: drop-shadow(0 0 20px rgba(180,199,254,.6)) } }
    `;
    document.head.appendChild(style);

    const loader = document.createElement("div");
    loader.className = "byzan-loading";
    loader.innerHTML = `
        <img src="https://raw.githubusercontent.com/justqnoo/assets/refs/heads/main/byyzannnnn.png" class="byzan-logo">
        <p class="byzan-txt">byzan.client is free!</p>
        <div class="byzan-bar"><div class="byzan-progress" id="byzanProgress"></div></div>
        <p class="byzan-txt">Initializing byzan.client...</p>
    `;
    document.body.appendChild(loader);

    const bar = document.getElementById("byzanProgress");
    let progress = 0;
    const pauses = [{pct: 52, ms: 450}, {pct: 90, ms: 450}];

    const animate = () => {
        if (pauses.length && progress >= pauses[0].pct) {
            setTimeout(() => { pauses.shift(); animate(); }, pauses[0].ms);
            return;
        }
        if (progress >= 100) {
            setTimeout(() => {
                loader.classList.add("hidden");
                setTimeout(() => { loader.remove(); startClient(); }, 700);
            }, 400);
            return;
        }
        progress += Math.random() * 12 + 4;
        if (pauses.length && progress > pauses[0].pct) progress = pauses[0].pct;
        if (progress > 100) progress = 100;
        bar.style.width = progress + "%";
        requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);

    function startClient() {
        console.clear();
        console.log("%cbyzan.lol client injected - v0.3", "color:#8a7bff;font-weight:bold;font-size:20px");

        const font = document.createElement("link");
        font.rel = "stylesheet";
        font.href = "https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap";
        document.head.appendChild(font);

        const DEFAULT_SETTINGS = {
            orbAutoClick: true,
            atomAutoClick: true,
            CPS: 500,
            orbClickDelay: 0,
            notificationsEnabled: true,
            outlineColor: "#6a5acd",
            glowColor: "#8a7bff",
            notifColor: "#8a7bff",
            headerLineEnabled: true,
            menuKey: "Tab"
        };

        let settings = { ...DEFAULT_SETTINGS };
        try {
            const s = localStorage.getItem("byzanSettings");
            if (s) settings = { ...DEFAULT_SETTINGS, ...JSON.parse(s) };
        } catch (e) {}

        const save = () => localStorage.setItem("byzanSettings", JSON.stringify(settings));

        let {
            orbAutoClick,
            atomAutoClick,
            CPS,
            orbClickDelay,
            notificationsEnabled,
            outlineColor,
            glowColor,
            notifColor,
            headerLineEnabled,
            menuKey
        } = settings;

        const container = document.querySelector("#app") || document.body;
        let yellowOrbCount = 0;

        document.head.insertAdjacentHTML("beforeend", `
            <style>
                @keyframes slideIn { from { opacity:0; transform:translateY(-15px) scale(0.96); } to { opacity:1; transform:translateY(0) scale(1); } }
                @keyframes fadeIn { from { opacity:0; transform:scale(0.94); } to { opacity:1; transform:scale(1); } }
                .smooth { animation: slideIn 0.45s ease forwards; }
                .win-fade { opacity: 0; }
                .win-fade.fade-in { animation: fadeIn 0.28s cubic-bezier(.67,0,.33,1) forwards; }
                @keyframes headerLineAnim { 0% { background-position: 0% 50%; } 100% { background-position: 300% 50%; } }
                .header-line { position: absolute; bottom: 0; left: 0; width: 100%; height: 4px;
                    background: linear-gradient(90deg, ${outlineColor}, ${glowColor}, ${outlineColor});
                    background-size: 300%; animation: headerLineAnim 4s linear infinite; }
            </style>
        `);

        function applyHeaderLine(enabled) {
            document.querySelectorAll(".win-fade > div:first-child").forEach(header => {
                header.querySelectorAll(".header-line").forEach(el => el.remove());
                if (enabled) {
                    const line = document.createElement("div");
                    line.className = "header-line";
                    header.style.position = "relative";
                    header.appendChild(line);
                }
            });
        }

        const notifBox = document.createElement("div");
        Object.assign(notifBox.style, {
            position: "fixed", top: "15px", left: "50%", transform: "translateX(-50%)",
            zIndex: 999999999, display: "flex", flexDirection: "column", gap: "10px",
            pointerEvents: "none", fontFamily: "'Poppins',sans-serif"
        });
        document.body.appendChild(notifBox);

        const notify = text => {
            if (!notificationsEnabled) return;
            const n = document.createElement("div");
            n.textContent = text;
            Object.assign(n.style, {
                background: notifColor, padding: "11px 26px", borderRadius: "12px",
                color: "white", fontWeight: "600", fontSize: "15px",
                boxShadow: "0 8px 30px rgba(0,0,0,0.5)"
            });
            notifBox.appendChild(n);
            setTimeout(() => n.remove(), 3000);
        };

        const createWin = (title, html = "", drag = true, width = "260px") => {
            const w = document.createElement("div");
            w.className = "smooth win-fade";
            Object.assign(w.style, {
                position: "fixed", background: "#0f0f0f", color: "white",
                border: `3px solid ${outlineColor}`, borderRadius: "14px",
                width, minWidth: width, paddingBottom: "10px",
                fontFamily: "'Poppins',sans-serif", zIndex: 99999999,
                userSelect: "none", boxShadow: `0 0 22px ${glowColor}90`, display: "none"
            });

            const h = document.createElement("div");
            Object.assign(h.style, {
                padding: "11px", background: "#1a1a1a", textAlign: "center",
                fontWeight: "700", fontSize: "16px", cursor: drag ? "move" : "default",
                borderRadius: "11px 11px 0 0", position: "relative"
            });
            h.textContent = title;
            w.appendChild(h);

            const b = document.createElement("div");
            b.innerHTML = html;
            b.style.padding = "10px";
            w.appendChild(b);
            document.body.appendChild(w);

            if (drag) {
                let dragging = false, ox, oy;
                h.onmousedown = e => { dragging = true; ox = e.clientX - w.offsetLeft; oy = e.clientY - w.offsetTop; };
                document.onmousemove = e => { if (dragging) { w.style.left = (e.clientX - ox) + "px"; w.style.top = (e.clientY - oy) + "px"; } };
                document.onmouseup = () => dragging = false;
            }
            return { win: w, body: b, head: h };
        };

        const headerWin  = createWin("byzan.lol client v0.3", "", false, "220px");
        const miscWin    = createWin("Miscellaneous", `
            <label><input type="checkbox" id="orb"> Auto Orb Clicker</label><br><br>
            <div id="orbDrop" style="background:#222;padding:8px;border-radius:7px;cursor:pointer;text-align:center;font-weight:600;font-size:14px">Orb Options</div>
            <div id="orbContent" style="display:none;padding-top:8px">Delay (ms): <input id="orbDelay" type="number" min="0" max="5000" value="${orbClickDelay}" style="width:78px;background:#111;color:white;border:1px solid #555;border-radius:5px;padding:3px"></div><br>
            <label><input type="checkbox" id="atom"> Auto Atom Clicker</label><br><br>
            <div id="atomDrop" style="background:#222;padding:8px;border-radius:7px;cursor:pointer;text-align:center;font-weight:600;font-size:14px">Atom Options</div>
            <div id="atomContent" style="display:none;padding-top:8px">
                CPS: <input id="cpsInput" type="number" min="1" max="10000" value="${CPS}" style="width:88px;background:#111;color:white;border:1px solid #555;border-radius:5px;padding:3px">
            </div>
        `, true, "280px");

        const visualWin  = createWin("Visual Settings", `
            <label style="font-size:14px;display:block;margin:5px 0;">Outline <input type="color" id="ocol" value="${outlineColor}"></label>
            <label style="font-size:14px;display:block;margin:5px 0;">Glow <input type="color" id="gcol" value="${glowColor}"></label>
            <label style="font-size:14px;display:block;margin:5px 0;">Notif <input type="color" id="ncol" value="${notifColor}"></label>
            <label style="font-size:14px;display:block;margin:10px 0 5px 0;">
                <input type="checkbox" id="hline" ${headerLineEnabled ? "checked" : ""}> Header Line
            </label>
        `, true, "240px");

        const keybindWin = createWin("Keybind", `
            <p style="margin:8px 0 4px;font-size:14px">Menu Toggle Key:</p>
            <input id="keybindInput" type="text" value="${menuKey === ' ' ? 'Space' : menuKey}" maxlength="12"
                style="width:100%;background:#111;color:white;border:1px solid #555;border-radius:6px;padding:8px;text-align:center;font-size:16px;font-weight:bold">
            <p style="margin:10px 0 0;font-size:12px;color:#aaa">Click box → press any key</p>
        `, true, "200px");

        const notifWin   = createWin("Notifications", `
            <label style="font-size:15px"><input type="checkbox" id="noti" ${notificationsEnabled ? "checked" : ""}> Enable Notifications</label>
        `, true, "260px");

        keybindWin.body.querySelector("#keybindInput").onkeydown = function(e) {
            e.preventDefault();
            const displayKey = e.key === " " ? "Space" : e.key.length === 1 ? e.key.toUpperCase() : e.key;
            this.value = displayKey;
            menuKey = e.key;
            settings.menuKey = e.key;
            save();
            notify(`Menu key → ${displayKey}`);
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
        miscWin.body.querySelector("#cpsInput").onchange = e => { CPS = Math.max(1, Math.min(10000, +e.target.value || 1)); settings.CPS = CPS; save(); };

        visualWin.body.querySelector("#ocol").oninput = e => { outlineColor = e.target.value; settings.outlineColor = outlineColor; updateColors(); save(); };
        visualWin.body.querySelector("#gcol").oninput = e => { glowColor = e.target.value; settings.glowColor = glowColor; updateColors(); save(); };
        visualWin.body.querySelector("#ncol").oninput = e => { notifColor = e.target.value; settings.notifColor = notifColor; save(); };
        visualWin.body.querySelector("#hline").onchange = () => { headerLineEnabled = this.checked; settings.headerLineEnabled = headerLineEnabled; save(); applyHeaderLine(headerLineEnabled); };

        function updateColors() {
            [headerWin.win, miscWin.win, visualWin.win, keybindWin.win, notifWin.win].forEach(el => {
                el.style.borderColor = outlineColor;
                el.style.boxShadow = `0 0 22px ${glowColor}90`;
            });
            document.querySelectorAll(".header-line").forEach(line => {
                line.style.background = `linear-gradient(90deg, ${outlineColor}, ${glowColor}, ${outlineColor})`;
            });
        }

        if (container) {
            new MutationObserver(muts => {
                if (!orbAutoClick) return;
                muts.forEach(m => m.addedNodes.forEach(n => {
                    if (n.nodeType === 1 && n.classList?.contains("power-up") && n.classList?.contains("bonus-atom")) {
                        yellowOrbCount++;
                        setTimeout(() => n.click?.(), orbClickDelay);
                        notify(`Yellow Orbs Collected: ${yellowOrbCount}`);
                    }
                }));
            }).observe(container, { childList: true, subtree: true });
        }

        setInterval(() => {
            if (atomAutoClick && document.querySelector(".nucleus")) {
                document.querySelector(".nucleus").click();
            }
        }, 1000 / CPS);

        const positionWindows = () => {
            const gap = 18;
            const topY = 28;
            let x = 20;

            headerWin.win.style.left = x + "px"; x += headerWin.win.offsetWidth + gap;
            miscWin.win.style.left = x + "px"; x += miscWin.win.offsetWidth + gap;
            visualWin.win.style.left = x + "px"; x += visualWin.win.offsetWidth + gap;
            keybindWin.win.style.left = x + "px"; x += keybindWin.win.offsetWidth + gap;
            notifWin.win.style.left = x + "px";

            [headerWin.win, miscWin.win, visualWin.win, keybindWin.win, notifWin.win].forEach(w => {
                w.style.top = topY + "px";
            });
        };
        window.addEventListener("resize", positionWindows);

        let visible = true;
        document.addEventListener("keydown", e => {
            if (e.key === menuKey) {
                e.preventDefault();
                visible = !visible;
                const wins = [headerWin.win, miscWin.win, visualWin.win, keybindWin.win, notifWin.win];
                wins.forEach(win => {
                    win.classList.remove("fade-in");
                    if (visible) {
                        win.style.display = "block";
                        void win.offsetWidth;
                        win.classList.add("fade-in");
                    } else {
                        win.style.display = "none";
                    }
                });
            }
        });

        [headerWin.win, miscWin.win, visualWin.win, keybindWin.win, notifWin.win].forEach(el => {
            el.style.display = "block";
            el.classList.add("fade-in");
        });
        applyHeaderLine(headerLineEnabled);
        positionWindows();
    }
})();
