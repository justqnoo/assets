(function() {
    const style = document.createElement("style");
    style.textContent = `
        .skylite-loading{position:fixed;inset:0;background:#0a0e14;z-index:999999999;display:flex;flex-direction:column;align-items:center;justify-content:center;pointer-events:all;transition:opacity .6s ease,visibility .6s ease}
        .skylite-loading.hidden{opacity:0;visibility:hidden;pointer-events:none}
        .skylite-logo{width:320px;height:320px;animation:ghost-pulse 2s infinite;display:block}
        .skylite-bar{width:320px;height:8px;background:rgba(180,220,254,.2);border-radius:4px;overflow:hidden;margin-top:22px}
        .skylite-progress{height:100%;width:0%;background:linear-gradient(90deg,#b4dcfe,#99ccff);border-radius:4px;transition:width .4s ease}
        .skylite-txt{color:#aaddff;margin-top:10px;font-size:15px;font-family:system-ui,sans-serif}
        @keyframes ghost-pulse{0%,10%{filter:drop-shadow(0 0 0px rgba(180,220,254,0))}70%{filter:drop-shadow(0 0 20px rgba(180,220,254,.6))}}
        @keyframes slideIn{from{opacity:0;transform:translateY(-15px) scale(0.96)}to{opacity:1;transform:none}}
        @keyframes fadeIn{from{opacity:0;transform:scale(0.94)}to{opacity:1;transform:scale(1)}}
        @keyframes headerLineAnim{0%{background-position:0% 50%}100%{background-position:300% 50%}}
        .smooth{animation:slideIn .45s ease forwards}
        .win-fade{opacity:0}
        .win-fade.fade-in{animation:fadeIn .28s cubic-bezier(.67,0,.33,1) forwards}
        .header-line{position:absolute;bottom:0;left:0;width:100%;height:4px;background-size:300%;animation:headerLineAnim 4s linear infinite}
        .skylite-status-display{position:fixed;backdrop-filter:blur(10px);border-radius:12px;padding:16px 20px;font-family:'Poppins',sans-serif;color:white;z-index:99999998;box-shadow:0 0 20px rgba(123,187,255,0.3);min-width:200px;transition:opacity .3s,transform .3s}
        .skylite-status-display.hidden{opacity:0;transform:translateX(300px);pointer-events:none}
        .skylite-status-title{font-size:20px;font-weight:700;text-align:right;margin-bottom:12px;text-shadow:0 0 10px rgba(123,187,255,0.5)}
        .skylite-status-item{font-size:13px;margin:6px 0;display:flex;justify-content:space-between;align-items:center;flex-direction:row-reverse}
        .skylite-status-label{color:#aaa;text-align:right}
        .skylite-status-value{font-weight:600;margin-right:12px}
        .skylite-status-on{color:#7bddff}
        .skylite-status-off{color:#7b9fff}
    `;
    document.head.appendChild(style);

    const loader = document.createElement("div");
    loader.className = "skylite-loading";
    loader.innerHTML = `
        <img src="https://raw.githubusercontent.com/justqnoo/assets/refs/heads/main/byyzannnnn.png" class="skylite-logo">
        <p class="skylite-txt">skylite.client is free!</p>
        <div class="skylite-bar"><div class="skylite-progress" id="skyliteProgress"></div></div>
        <p class="skylite-txt">Initializing skylite.client...</p>
    `;
    document.body.appendChild(loader);

    const bar = document.getElementById("skyliteProgress");
    let progress = 0;
    const pauses = [{pct: 90, ms: 550}];
    const animate = () => {
        if (pauses.length && progress >= pauses[0].pct) {
            setTimeout(() => {
                pauses.shift();
                animate();
            }, pauses[0].ms);
            return;
        }
        if (progress >= 100) {
            setTimeout(() => {
                loader.classList.add("hidden");
                setTimeout(() => {
                    loader.remove();
                    startClient();
                }, 700);
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
        console.log("%cskylite.client injected - v0.3", "color:#7bbbff;font-weight:bold;font-size:20px");

        const font = document.createElement("link");
        font.rel = "stylesheet";
        font.href = "https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap";
        document.head.appendChild(font);

        const DEFAULT_SETTINGS = {
            orbAutoClick: true,
            centerAutoClick: true,
            CPS: 500,
            orbClickDelay: 0,
            orbCollectChance: 100,
            notificationsEnabled: true,
            outlineColor: "#5a9acd",
            glowColor: "#7bbbff",
            notifColor: "#7bbbff",
            headerLineEnabled: true,
            menuKey: "Tab",
            statusDisplayEnabled: true,
            statusBgColor: "rgba(15,20,30,0.7)",
            statusBorderColor: "rgba(90,154,205,0.6)",
            statusTextColor: "#7bbbff",
            statusPosition: "top-right",
            statusOpacity: 70,
            statusTitle: "skylite.client.v0.3",
            orbAutoClickKey: "",
            centerAutoClickKey: "",
            notificationsKey: "",
            statusDisplayKey: "",
            headerLineKey: ""
        };
        let settings = {...DEFAULT_SETTINGS};
        try {
            const saved = localStorage.getItem("skyliteSettings");
            if (saved) settings = {...DEFAULT_SETTINGS, ...JSON.parse(saved)};
        } catch (e) {}

        const save = () => localStorage.setItem("skyliteSettings", JSON.stringify(settings));

        let {orbAutoClick, centerAutoClick, CPS, orbClickDelay, orbCollectChance, notificationsEnabled, outlineColor, glowColor, notifColor, headerLineEnabled, menuKey, statusDisplayEnabled, statusBgColor, statusBorderColor, statusTextColor, statusPosition, statusOpacity, statusTitle, orbAutoClickKey, centerAutoClickKey, notificationsKey, statusDisplayKey, headerLineKey} = settings;

        let yellowOrbCount = 0, yellowOrbTotal = 0, observer = null, centerClickInterval = null;
        const container = document.querySelector("#app") || document.body;

        document.head.insertAdjacentHTML("beforeend", `<style>
            .header-line{background:linear-gradient(90deg,${outlineColor},${glowColor},${outlineColor})}
        </style>`);

        const statusDisplay = document.createElement("div");
        statusDisplay.className = "skylite-status-display";
        statusDisplay.innerHTML = `
            <div class="skylite-status-title">${statusTitle}</div>
            <div id="statusContent"></div>
        `;
        document.body.appendChild(statusDisplay);

        const updateStatusPosition = (position) => {
            statusDisplay.style.top = "";
            statusDisplay.style.bottom = "";
            statusDisplay.style.left = "";
            statusDisplay.style.right = "";
            
            switch(position) {
                case "top-left":
                    statusDisplay.style.top = "20px";
                    statusDisplay.style.left = "20px";
                    statusDisplay.style.transform = "translateX(0)";
                    break;
                case "top-right":
                    statusDisplay.style.top = "20px";
                    statusDisplay.style.right = "20px";
                    statusDisplay.style.transform = "translateX(0)";
                    break;
                case "bottom-left":
                    statusDisplay.style.bottom = "20px";
                    statusDisplay.style.left = "20px";
                    statusDisplay.style.transform = "translateX(0)";
                    break;
                case "bottom-right":
                    statusDisplay.style.bottom = "20px";
                    statusDisplay.style.right = "20px";
                    statusDisplay.style.transform = "translateX(0)";
                    break;
            }
            
            if (statusDisplay.classList.contains("hidden")) {
                if (position.includes("right")) {
                    statusDisplay.style.transform = "translateX(300px)";
                } else {
                    statusDisplay.style.transform = "translateX(-300px)";
                }
            }
        };

        const updateStatusColors = () => {
            const opacityDecimal = statusOpacity / 100;
            const bgHex = statusBgColor.match(/#[0-9a-f]{6}/i)?.[0] || '#0f141e';
            const r = parseInt(bgHex.slice(1, 3), 16);
            const g = parseInt(bgHex.slice(3, 5), 16);
            const b = parseInt(bgHex.slice(5, 7), 16);
            statusDisplay.style.background = `rgba(${r}, ${g}, ${b}, ${opacityDecimal})`;
            statusDisplay.style.borderColor = statusBorderColor;
            
            if (statusOpacity < 20) {
                statusDisplay.style.boxShadow = 'none';
            } else {
                const shadowOpacity = opacityDecimal * 0.3;
                statusDisplay.style.boxShadow = `0 0 20px rgba(123,187,255,${shadowOpacity})`;
            }
            
            if (statusOpacity < 20) {
                statusDisplay.style.backdropFilter = 'none';
            } else {
                statusDisplay.style.backdropFilter = `blur(${opacityDecimal * 10}px)`;
            }
            
            const title = statusDisplay.querySelector(".skylite-status-title");
            if (title) {
                title.style.color = statusTextColor;
                title.textContent = statusTitle;
            }
            
            document.querySelectorAll(".skylite-status-label").forEach(el => {
                el.style.background = 'rgba(0,0,0,0.4)';
                el.style.padding = '6px 10px';
                el.style.borderRadius = '6px';
                el.style.display = 'block';
                el.style.marginBottom = '4px';
            });
            
            document.querySelectorAll(".skylite-status-value").forEach(el => {
                el.style.color = statusTextColor;
            });
        };

        const updateStatusDisplay = () => {
            const statusContent = document.getElementById("statusContent");
            if (!statusContent) return;

            let items = [];

            if (orbAutoClick) {
                items.push({html: `<div class="skylite-status-item"><span class="skylite-status-label">Orb AutoClick</span></div>`, length: 14});
            }

            if (centerAutoClick) {
                items.push({html: `<div class="skylite-status-item"><span class="skylite-status-label">Atom AutoClicker</span></div>`, length: 16});
            }

            if (orbAutoClick) {
                items.push({html: `<div class="skylite-status-item"><span class="skylite-status-label">Orb Collect: <span class="skylite-status-value" style="margin-right:0;margin-left:4px">${orbCollectChance}%</span></span></div>`, length: 11});
            }

            if (orbAutoClick && orbClickDelay > 0) {
                items.push({html: `<div class="skylite-status-item"><span class="skylite-status-label">Orb Delay: <span class="skylite-status-value" style="margin-right:0;margin-left:4px">${orbClickDelay}ms</span></span></div>`, length: 9});
            }

            if (centerAutoClick) {
                items.push({html: `<div class="skylite-status-item"><span class="skylite-status-label">CPS: <span class="skylite-status-value" style="margin-right:0;margin-left:4px">${CPS}</span></span></div>`, length: 3});
            }

            if (notificationsEnabled) {
                items.push({html: `<div class="skylite-status-item"><span class="skylite-status-label">Notifications</span></div>`, length: 13});
            }

            if (headerLineEnabled) {
                items.push({html: `<div class="skylite-status-item"><span class="skylite-status-label">Header Line</span></div>`, length: 11});
            }

            items.sort((a, b) => b.length - a.length);
            statusContent.innerHTML = items.map(item => item.html).join('');

            updateStatusColors();

            if (statusDisplayEnabled) {
                statusDisplay.classList.remove("hidden");
            } else {
                statusDisplay.classList.add("hidden");
            }
        };

        const notifBox = document.createElement("div");
        Object.assign(notifBox.style, {
            position: "fixed",
            top: "15px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 999999999,
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            pointerEvents: "none",
            fontFamily: "'Poppins',sans-serif"
        });
        document.body.appendChild(notifBox);

        const notify = text => {
            if (!notificationsEnabled) return;
            const n = document.createElement("div");
            n.textContent = text;
            Object.assign(n.style, {
                background: notifColor,
                padding: "11px 26px",
                borderRadius: "12px",
                color: "white",
                fontWeight: "600",
                fontSize: "15px",
                boxShadow: "0 8px 30px rgba(0,0,0,0.5)",
                opacity: 0,
                transform: "scale(0.9)"
            });
            notifBox.appendChild(n);
            requestAnimationFrame(() => {
                n.style.transition = "all .3s";
                n.style.opacity = 1;
                n.style.transform = "scale(1)"
            });
            setTimeout(() => {
                n.style.opacity = 0;
                n.style.transform = "scale(0.9)";
                setTimeout(() => n.remove(), 300)
            }, 2700);
        };

        const createWin = (title, html = "", drag = true, width = "260px") => {
            const win = document.createElement("div");
            win.className = "smooth win-fade";
            Object.assign(win.style, {
                position: "fixed",
                background: "#0f141a",
                color: "white",
                border: `3px solid ${outlineColor}`,
                borderRadius: "14px",
                width,
                minWidth: width,
                paddingBottom: "10px",
                fontFamily: "'Poppins',sans-serif",
                zIndex: 99999999,
                userSelect: "none",
                boxShadow: `0 0 22px ${glowColor}90`,
                display: "none"
            });
            const head = document.createElement("div");
            Object.assign(head.style, {
                padding: "11px",
                background: "#1a2230",
                textAlign: "center",
                fontWeight: "700",
                fontSize: "16px",
                cursor: drag ? "move" : "default",
                borderRadius: "11px 11px 0 0",
                position: "relative"
            });
            head.textContent = title;
            win.appendChild(head);
            const body = document.createElement("div");
            body.innerHTML = html;
            body.style.padding = "10px";
            win.appendChild(body);
            document.body.appendChild(win);

            if (drag) {
                let dragging = false, ox, oy;
                head.onmousedown = e => {
                    dragging = true;
                    ox = e.clientX - win.offsetLeft;
                    oy = e.clientY - win.offsetTop;
                };
                document.onmousemove = e => {
                    if (dragging) {
                        win.style.left = (e.clientX - ox) + "px";
                        win.style.top = (e.clientY - oy) + "px";
                    }
                };
                document.onmouseup = () => dragging = false;
            }
            return {win, body, head};
        };

        const wins = {
            header: createWin("skylite.client v0.3", `
                <label style="font-size:15px"><input type="checkbox" id="statusToggle" ${statusDisplayEnabled?"checked":""}> Display Labels</label>
                <input type="text" id="statusDisplayKeyInput" placeholder="Key" value="${statusDisplayKey}" maxlength="12" style="width:60px;background:#0a0e14;color:white;border:1px solid #5a9acd;border-radius:4px;padding:4px;margin-left:8px;font-size:12px">
                <p>amberlit._ on discord</p>
            `, false, "220px"),
            misc: createWin("Miscellaneous", `
                <label><input type="checkbox" id="orbAuto"> AutoClicker Yellow Orb</label>
                <input type="text" id="orbAutoKeyInput" placeholder="Key" value="${orbAutoClickKey}" maxlength="12" style="width:60px;background:#0a0e14;color:white;border:1px solid #5a9acd;border-radius:4px;padding:4px;margin-left:8px;font-size:12px"><br><br>
                <div id="orbDrop" style="background:#1a2230;padding:8px;border-radius:7px;cursor:pointer;text-align:center;font-weight:600;font-size:14px">Orb Options</div>
                <div id="orbContent" style="display:none;padding-top:8px">
                    Delay (ms): <input id="orbDelay" type="number" min="0" max="5000" value="${orbClickDelay}" style="width:78px;background:#0a0e14;color:white;border:1px solid #5a9acd;border-radius:5px;padding:3px"><br><br>
                    Collect %: <input id="orbChance" type="number" min="0" max="100" value="${orbCollectChance}" style="width:78px;background:#0a0e14;color:white;border:1px solid #5a9acd;border-radius:5px;padding:3px">
                </div><br>
                <label><input type="checkbox" id="centerAuto"> Atom AutoClicker</label>
                <input type="text" id="centerAutoKeyInput" placeholder="Key" value="${centerAutoClickKey}" maxlength="12" style="width:60px;background:#0a0e14;color:white;border:1px solid #5a9acd;border-radius:4px;padding:4px;margin-left:8px;font-size:12px"><br><br>
                <div id="centerDrop" style="background:#1a2230;padding:8px;border-radius:7px;cursor:pointer;text-align:center;font-weight:600;font-size:14px">Atom Click Options</div>
                <div id="centerContent" style="display:none;padding-top:8px">CPS: <input id="cpsInput" type="number" min="1" max="10000" value="${CPS}" style="width:88px;background:#0a0e14;color:white;border:1px solid #5a9acd;border-radius:5px;padding:3px"></div>
            `, true, "300px"),
            visual: createWin("Visual Settings", `
                <label style="font-size:14px;display:block;margin:5px 0;">Outline <input type="color" id="ocol" value="${outlineColor}"></label>
                <label style="font-size:14px;display:block;margin:5px 0;">Glow <input type="color" id="gcol" value="${glowColor}"></label>
                <label style="font-size:14px;display:block;margin:5px 0;">Notif <input type="color" id="ncol" value="${notifColor}"></label>
                <label style="font-size:14px;display:block;margin:10px 0 5px 0;"><input type="checkbox" id="hline" ${headerLineEnabled?"checked":""}> Header Line</label>
                <input type="text" id="headerLineKeyInput" placeholder="Key" value="${headerLineKey}" maxlength="12" style="width:60px;background:#0a0e14;color:white;border:1px solid #5a9acd;border-radius:4px;padding:4px;margin-left:8px;font-size:12px">
                <hr style="border:none;border-top:1px solid #5a9acd;margin:15px 0">
                <p style="font-size:13px;font-weight:600;margin:8px 0 8px 0;color:#aaa">Status Display</p>
                <label style="font-size:14px;display:block;margin:5px 0;">Title</label>
                <input type="text" id="statusTitleInput" value="${statusTitle}" maxlength="30" style="width:100%;background:#0a0e14;color:white;border:1px solid #5a9acd;border-radius:5px;padding:6px;margin-bottom:8px">
                <label style="font-size:14px;display:block;margin:5px 0;">Background <input type="color" id="statusBg" value="${statusBgColor.match(/#[0-9a-f]{6}/i)?.[0] || '#0f141e'}"></label>
                <label style="font-size:14px;display:block;margin:5px 0;">Border <input type="color" id="statusBorder" value="${statusBorderColor.match(/#[0-9a-f]{6}/i)?.[0] || '#5a9acd'}"></label>
                <label style="font-size:14px;display:block;margin:5px 0;">Text <input type="color" id="statusText" value="${statusTextColor}"></label>
                <label style="font-size:14px;display:block;margin:8px 0 5px 0;">Opacity: <span id="opacityValue">${statusOpacity}%</span></label>
                <input type="range" id="statusOpacity" min="0" max="100" value="${statusOpacity}" style="width:100%;accent-color:#5a9acd">
                <p style="font-size:12px;margin:8px 0 4px 0;color:#aaa">Position:</p>
                <select id="statusPos" style="width:100%;background:#0a0e14;color:white;border:1px solid #5a9acd;border-radius:5px;padding:6px">
                    <option value="top-right" ${statusPosition==="top-right"?"selected":""}>Top Right</option>
                    <option value="top-left" ${statusPosition==="top-left"?"selected":""}>Top Left</option>
                    <option value="bottom-right" ${statusPosition==="bottom-right"?"selected":""}>Bottom Right</option>
                    <option value="bottom-left" ${statusPosition==="bottom-left"?"selected":""}>Bottom Left</option>
                </select>
            `, true, "240px"),
            keybind: createWin("Keybind", `
                <p style="margin:8px 0 4px;font-size:14px">Menu Toggle Key:</p>
                <input id="keybindInput" type="text" value="${menuKey===' '?"Space":menuKey}" maxlength="12"
                    style="width:100%;background:#0a0e14;color:white;border:1px solid #5a9acd;border-radius:6px;padding:8px;text-align:center;font-size:16px;font-weight:bold">
                <p style="margin:10px 0 0;font-size:12px;color:#aaa">Click box to press any key</p>
            `, true, "200px"),
            notif: createWin("Notifications", `
                <label style="font-size:15px"><input type="checkbox" id="notiEnabled" ${notificationsEnabled?"checked":""}> Enable Notifications</label>
                <input type="text" id="notificationsKeyInput" placeholder="Key" value="${notificationsKey}" maxlength="12" style="width:60px;background:#0a0e14;color:white;border:1px solid #5a9acd;border-radius:4px;padding:4px;margin-left:8px;font-size:12px">
            `, true, "280px")
        };

        const keybindInput = wins.keybind.body.querySelector("#keybindInput");
        keybindInput.onkeydown = e => {
            e.stopPropagation();
            e.preventDefault();
            const key = e.key === " " ? " " : e.key;
            const display = key === " " ? "Space" : key.length === 1 ? key.toUpperCase() : key;
            keybindInput.value = display;
            menuKey = key;
            settings.menuKey = key;
            save();
            notify(`Menu key to ${display}`);
        };
        keybindInput.onclick = () => keybindInput.focus();

        const setupKeybindInput = (inputId, settingKey, onToggle, displayName) => {
            const input = document.getElementById(inputId);
            if (!input) return;
            
            input.onkeydown = e => {
                e.stopPropagation();
                e.preventDefault();
                const key = e.key === " " ? " " : e.key;
                const display = key === " " ? "Space" : key.length === 1 ? key.toUpperCase() : key;
                input.value = display;
                
                if (settingKey === "orbAutoClickKey") orbAutoClickKey = key;
                else if (settingKey === "centerAutoClickKey") centerAutoClickKey = key;
                else if (settingKey === "notificationsKey") notificationsKey = key;
                else if (settingKey === "statusDisplayKey") statusDisplayKey = key;
                else if (settingKey === "headerLineKey") headerLineKey = key;
                
                settings[settingKey] = key;
                save();
                notify(`${displayName} key set to ${display}`);
            };
            input.onclick = () => input.focus();
        };

        setupKeybindInput("orbAutoKeyInput", "orbAutoClickKey", null, "Orb AutoClick");
        setupKeybindInput("centerAutoKeyInput", "centerAutoClickKey", null, "Atom AutoClicker");
        setupKeybindInput("notificationsKeyInput", "notificationsKey", null, "Notifications");
        setupKeybindInput("statusDisplayKeyInput", "statusDisplayKey", null, "Display Labels");
        setupKeybindInput("headerLineKeyInput", "headerLineKey", null, "Header Line");

        const updateColors = () => {
            Object.values(wins).forEach(w => {
                w.win.style.borderColor = outlineColor;
                w.win.style.boxShadow = `0 0 22px ${glowColor}90`;
            });
            document.querySelectorAll(".header-line").forEach(l => l.style.background = `linear-gradient(90deg,${outlineColor},${glowColor},${outlineColor})`);
        };

        const applyHeaderLine = enabled => {
            document.querySelectorAll(".win-fade > div:first-child").forEach(h => {
                h.querySelectorAll(".header-line").forEach(el => el.remove());
                if (enabled) {
                    const line = document.createElement("div");
                    line.className = "header-line";
                    h.style.position = "relative";
                    h.appendChild(line);
                }
            });
        };

        const setupOrbObserver = () => {
            if (observer) observer.disconnect();
            if (!orbAutoClick || !container) return;
            observer = new MutationObserver(muts => {
                muts.forEach(m => m.addedNodes.forEach(n => {
                    if (n.nodeType === 1 && n.classList?.contains("power-up") && n.classList?.contains("bonus-atom")) {
                        yellowOrbTotal++;
                        const shouldCollect = Math.random() * 100 < orbCollectChance;
                        if (shouldCollect) {
                            yellowOrbCount++;
                            setTimeout(() => n.click?.(), orbClickDelay);
                            const percentage = ((yellowOrbCount / yellowOrbTotal) * 100).toFixed(1);
                            notify(`Yellow Orbs: ${yellowOrbCount}/${yellowOrbTotal} (${percentage}%)`);
                            console.log(`[skylite.client]: Yellow Orb Collected: ${yellowOrbCount}/${yellowOrbTotal} (${percentage}%)`);
                        } else {
                            console.log(`[skylite.client]: Yellow Orb Skipped (${orbCollectChance}% chance)`);
                        }
                    }
                }));
            });
            observer.observe(container, {childList: true, subtree: true});
        };

        const setupCenterClicker = () => {
            if (centerClickInterval) clearInterval(centerClickInterval);
            if (!centerAutoClick || clickerPausedForMenu) return;
            const delayMs = 1000 / CPS;
            centerClickInterval = setInterval(() => {
                if (menuVisible) return;
                
                const electronShell = document.querySelector(".electron-shell.svelte-9i0pj0");
                if (!electronShell) return;
                
                const rect = electronShell.getBoundingClientRect();
                const isVisible = rect.width > 0 && rect.height > 0 && 
                                rect.top >= 0 && rect.bottom <= window.innerHeight &&
                                rect.left >= 0 && rect.right <= window.innerWidth;
                
                if (!isVisible) return;
                
                const viewportWidth = window.innerWidth;
                const viewportHeight = window.innerHeight;
                
                const centerX = viewportWidth / 2;
                const yOffset = viewportHeight < 600 ? viewportHeight * 0.1 : 100;
                const centerY = (viewportHeight / 2) - yOffset;
                
                const element = document.elementFromPoint(centerX, centerY);
                
                if (element && (
                    element.closest('.win-fade') || 
                    element.closest('.skylite-status-display') ||
                    element.classList.contains('win-fade') ||
                    element.classList.contains('skylite-status-display')
                )) {
                    return;
                }
                
                const clickEvent = new MouseEvent('click', {
                    view: window,
                    bubbles: true,
                    cancelable: true,
                    clientX: centerX,
                    clientY: centerY
                });
                
                if (element) {
                    element.dispatchEvent(clickEvent);
                }
            }, delayMs);
        };

        wins.misc.body.querySelector("#orbAuto").checked = orbAutoClick;
        wins.misc.body.querySelector("#centerAuto").checked = centerAutoClick;
        wins.notif.body.querySelector("#notiEnabled").checked = notificationsEnabled;
        wins.header.body.querySelector("#statusToggle").checked = statusDisplayEnabled;

        wins.header.body.querySelector("#statusToggle").onchange = e => {
            statusDisplayEnabled = e.target.checked;
            settings.statusDisplayEnabled = statusDisplayEnabled;
            save();
            updateStatusDisplay();
        };
        wins.misc.body.querySelector("#orbAuto").onchange = e => {
            orbAutoClick = e.target.checked;
            settings.orbAutoClick = orbAutoClick;
            save();
            setupOrbObserver();
            updateStatusDisplay();
        };
        wins.misc.body.querySelector("#centerAuto").onchange = e => {
            centerAutoClick = e.target.checked;
            settings.centerAutoClick = centerAutoClick;
            save();
            setupCenterClicker();
            updateStatusDisplay();
        };
        wins.notif.body.querySelector("#notiEnabled").onchange = e => {
            notificationsEnabled = e.target.checked;
            settings.notificationsEnabled = notificationsEnabled;
            save();
            updateStatusDisplay();
        };
        wins.misc.body.querySelector("#orbDelay").onchange = e => {
            orbClickDelay = Math.max(0, Math.min(5000, +(e.target.value || 0)));
            settings.orbClickDelay = orbClickDelay;
            save();
            updateStatusDisplay();
        };
        wins.misc.body.querySelector("#orbChance").onchange = e => {
            orbCollectChance = Math.max(0, Math.min(100, +(e.target.value || 100)));
            settings.orbCollectChance = orbCollectChance;
            save();
            updateStatusDisplay();
        };
        wins.misc.body.querySelector("#cpsInput").onchange = e => {
            CPS = Math.max(1, Math.min(10000, +(e.target.value || 1)));
            settings.CPS = CPS;
            save();
            setupCenterClicker();
            updateStatusDisplay();
        };
        wins.visual.body.querySelector("#ocol").oninput = e => {
            outlineColor = e.target.value;
            settings.outlineColor = outlineColor;
            updateColors();
            save();
        };
        wins.visual.body.querySelector("#gcol").oninput = e => {
            glowColor = e.target.value;
            settings.glowColor = glowColor;
            updateColors();
            save();
        };
        wins.visual.body.querySelector("#ncol").oninput = e => {
            notifColor = e.target.value;
            settings.notifColor = notifColor;
            save();
        };
        wins.visual.body.querySelector("#hline").onchange = e => {
            headerLineEnabled = e.target.checked;
            settings.headerLineEnabled = headerLineEnabled;
            save();
            applyHeaderLine(headerLineEnabled);
            updateStatusDisplay();
        };

        wins.visual.body.querySelector("#statusBg").oninput = e => {
            const hex = e.target.value;
            statusBgColor = `${hex}b3`;
            settings.statusBgColor = statusBgColor;
            save();
            updateStatusColors();
        };
        wins.visual.body.querySelector("#statusBorder").oninput = e => {
            const hex = e.target.value;
            statusBorderColor = `${hex}99`;
            settings.statusBorderColor = statusBorderColor;
            statusDisplay.style.borderWidth = "2px";
            statusDisplay.style.borderStyle = "solid";
            save();
            updateStatusColors();
        };
        wins.visual.body.querySelector("#statusText").oninput = e => {
            statusTextColor = e.target.value;
            settings.statusTextColor = statusTextColor;
            save();
            updateStatusColors();
        };
        wins.visual.body.querySelector("#statusPos").onchange = e => {
            statusPosition = e.target.value;
            settings.statusPosition = statusPosition;
            save();
            updateStatusPosition(statusPosition);
        };

        wins.visual.body.querySelector("#statusOpacity").oninput = e => {
            statusOpacity = parseInt(e.target.value);
            settings.statusOpacity = statusOpacity;
            wins.visual.body.querySelector("#opacityValue").textContent = statusOpacity + "%";
            save();
            updateStatusColors();
        };

        wins.visual.body.querySelector("#statusTitleInput").oninput = e => {
            statusTitle = e.target.value;
            settings.statusTitle = statusTitle;
            save();
            updateStatusColors();
        };

        wins.misc.body.querySelector("#orbDrop").onclick = () => {
            const c = wins.misc.body.querySelector("#orbContent");
            c.style.display = c.style.display === "block" ? "none" : "block";
        };
        wins.misc.body.querySelector("#centerDrop").onclick = () => {
            const c = wins.misc.body.querySelector("#centerContent");
            c.style.display = c.style.display === "block" ? "none" : "block";
        };

        const positionWindows = () => {
            const gap = 18, top = 28;
            let left = 20;
            [wins.header, wins.misc, wins.visual, wins.keybind, wins.notif].forEach(w => {
                w.win.style.left = left + "px";
                w.win.style.top = top + "px";
                left += w.win.offsetWidth + gap;
            });
        };

        let menuVisible = true;
        let clickerPausedForMenu = false;
        
        document.addEventListener("keydown", e => {
            if (document.activeElement.tagName === 'INPUT') return;
            
            if (e.key === menuKey) {
                e.preventDefault();
                menuVisible = !menuVisible;
                
                if (menuVisible) {
                    clickerPausedForMenu = true;
                    if (centerClickInterval) {
                        clearInterval(centerClickInterval);
                        centerClickInterval = null;
                    }
                } else {
                    clickerPausedForMenu = false;
                    if (centerAutoClick) {
                        setupCenterClicker();
                    }
                }
                
                Object.values(wins).forEach(w => {
                    if (menuVisible) {
                        w.win.style.display = "block";
                        void w.win.offsetWidth;
                        w.win.classList.add("fade-in");
                    } else {
                        w.win.style.transition = "none";
                        w.win.classList.remove("fade-in");
                        w.win.style.display = "none";
                        setTimeout(() => w.win.style.transition = "", 0);
                    }
                });
                if (menuVisible) {
                    setTimeout(positionWindows, 50);
                }
            }
            
            if (orbAutoClickKey && e.key === orbAutoClickKey) {
                e.preventDefault();
                orbAutoClick = !orbAutoClick;
                settings.orbAutoClick = orbAutoClick;
                wins.misc.body.querySelector("#orbAuto").checked = orbAutoClick;
                save();
                setupOrbObserver();
                updateStatusDisplay();
                notify(`Orb AutoClick ${orbAutoClick ? 'ON' : 'OFF'}`);
            }
            
            if (centerAutoClickKey && e.key === centerAutoClickKey) {
                e.preventDefault();
                centerAutoClick = !centerAutoClick;
                settings.centerAutoClick = centerAutoClick;
                wins.misc.body.querySelector("#centerAuto").checked = centerAutoClick;
                save();
                setupCenterClicker();
                updateStatusDisplay();
                notify(`Atom AutoClicker ${centerAutoClick ? 'ON' : 'OFF'}`);
            }
            
            if (notificationsKey && e.key === notificationsKey) {
                e.preventDefault();
                notificationsEnabled = !notificationsEnabled;
                settings.notificationsEnabled = notificationsEnabled;
                wins.notif.body.querySelector("#notiEnabled").checked = notificationsEnabled;
                save();
                updateStatusDisplay();
                if (notificationsEnabled) notify('Notifications ON');
            }
            
            if (statusDisplayKey && e.key === statusDisplayKey) {
                e.preventDefault();
                statusDisplayEnabled = !statusDisplayEnabled;
                settings.statusDisplayEnabled = statusDisplayEnabled;
                wins.header.body.querySelector("#statusToggle").checked = statusDisplayEnabled;
                save();
                updateStatusDisplay();
                notify(`Display Labels ${statusDisplayEnabled ? 'ON' : 'OFF'}`);
            }
            
            if (headerLineKey && e.key === headerLineKey) {
                e.preventDefault();
                headerLineEnabled = !headerLineEnabled;
                settings.headerLineEnabled = headerLineEnabled;
                wins.visual.body.querySelector("#hline").checked = headerLineEnabled;
                save();
                applyHeaderLine(headerLineEnabled);
                updateStatusDisplay();
                notify(`Header Line ${headerLineEnabled ? 'ON' : 'OFF'}`);
            }
        });

        Object.values(wins).forEach(w => {
            w.win.style.display = "block";
            w.win.classList.add("fade-in");
        });
        updateColors();
        applyHeaderLine(headerLineEnabled);
        setupOrbObserver();
        setupCenterClicker();
        updateStatusPosition(statusPosition);
        updateStatusDisplay();

        setTimeout(positionWindows, 100);

        window.addEventListener("resize", positionWindows);
    }
})();
