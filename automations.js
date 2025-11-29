(function () {
    const style = document.createElement("style");
    style.textContent = `
        .byzan-loading{position:fixed;inset:0;background:#0d0d0d;z-index:999999999;display:flex;flex-direction:column;align-items:center;justify-content:center;pointer-events:all;transition:opacity .6s ease,visibility .6s ease}
        .byzan-loading.hidden{opacity:0;visibility:hidden;pointer-events:none}
        .byzan-logo{width:320px;height:320px;animation:ghost-pulse 2s infinite;display:block}
        .byzan-bar{width:320px;height:8px;background:rgba(180,199,254,.2);border-radius:4px;overflow:hidden;margin-top:22px}
        .byzan-progress{height:100%;width:0%;background:linear-gradient(90deg,#b4c7fe,#93baf6);border-radius:4px;transition:width .4s ease}
        .byzan-txt{color:#aaa;margin-top:10px;font-size:15px;font-family:system-ui,sans-serif}
        @keyframes ghost-pulse{0%,10%{filter:drop-shadow(0 0 0px rgba(180,199,254,0))}70%{filter:drop-shadow(0 0 20px rgba(180,199,254,.6))}}
        @keyframes slideIn{from{opacity:0;transform:translateY(-15px) scale(0.96)}to{opacity:1;transform:none}}
        @keyframes fadeIn{from{opacity:0;transform:scale(0.94)}to{opacity:1;transform:scale(1)}}
        @keyframes headerLineAnim{0%{background-position:0% 50%}100%{background-position:300% 50%}}
        .smooth{animation:slideIn .45s ease forwards}
        .win-fade{opacity:0}
        .win-fade.fade-in{animation:fadeIn .28s cubic-bezier(.67,0,.33,1) forwards}
        .header-line{position:absolute;bottom:0;left:0;width:100%;height:4px;background-size:300%;animation:headerLineAnim 4s linear infinite}
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
    const pauses = [{pct:90,ms:550}];
    const animate = () => {
        if (pauses.length && progress >= pauses[0].pct) {
            setTimeout(()=>{pauses.shift();animate();},pauses[0].ms);
            return;
        }
        if (progress >= 100) {
            setTimeout(()=>{loader.classList.add("hidden");setTimeout(()=>{loader.remove();startClient();},700);},400);
            return;
        }
        progress += Math.random()*12+4;
        if (pauses.length && progress > pauses[0].pct) progress = pauses[0].pct;
        if (progress > 100) progress = 100;
        bar.style.width = progress + "%";
        requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);

    function startClient() {
        console.clear();
        console.log("%cbyzan.lol client injected - v0.3","color:#8a7bff;font-weight:bold;font-size:20px");

        const font = document.createElement("link");
        font.rel="stylesheet";
        font.href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap";
        document.head.appendChild(font);

        const DEFAULT_SETTINGS = {
            orbAutoClick:true,atomAutoClick:true,CPS:500,orbClickDelay:0,
            notificationsEnabled:true,outlineColor:"#6a5acd",glowColor:"#8a7bff",
            notifColor:"#8a7bff",headerLineEnabled:true,menuKey:"Tab"
        };
        let settings = {...DEFAULT_SETTINGS};
        try {
            const saved = localStorage.getItem("byzanSettings");
            if (saved) settings = {...DEFAULT_SETTINGS,...JSON.parse(saved)};
        } catch(e){}

        const save = ()=>localStorage.setItem("byzanSettings",JSON.stringify(settings));

        let {orbAutoClick,atomAutoClick,CPS,orbClickDelay,notificationsEnabled,
             outlineColor,glowColor,notifColor,headerLineEnabled,menuKey} = settings;

        let yellowOrbCount = 0, observer = null, atomInterval = null;
        const container = document.querySelector("#app")||document.body;

        document.head.insertAdjacentHTML("beforeend",`<style>
            .header-line{background:linear-gradient(90deg,${outlineColor},${glowColor},${outlineColor})}
        </style>`);

        const notifBox = document.createElement("div");
        Object.assign(notifBox.style,{position:"fixed",top:"15px",left:"50%",transform:"translateX(-50%)",
            zIndex:999999999,display:"flex",flexDirection:"column",gap:"10px",pointerEvents:"none",
            fontFamily:"'Poppins',sans-serif"});
        document.body.appendChild(notifBox);

        const notify = text => {
            if (!notificationsEnabled) return;
            const n = document.createElement("div");
            n.textContent = text;
            Object.assign(n.style,{background:notifColor,padding:"11px 26px",borderRadius:"12px",
                color:"white",fontWeight:"600",fontSize:"15px",boxShadow:"0 8px 30px rgba(0,0,0,0.5)",
                opacity:0,transform:"scale(0.9)"});
            notifBox.appendChild(n);
            requestAnimationFrame(()=>{n.style.transition="all .3s";n.style.opacity=1;n.style.transform="scale(1)"});
            setTimeout(()=>{n.style.opacity=0;n.style.transform="scale(0.9)";setTimeout(()=>n.remove(),300)},2700);
        };

        const createWin = (title,html="",drag=true,width="260px") => {
            const win = document.createElement("div");
            win.className="smooth win-fade";
            Object.assign(win.style,{position:"fixed",background:"#0f0f0f",color:"white",
                border:`3px solid ${outlineColor}`,borderRadius:"14px",width,minWidth:width,
                paddingBottom:"10px",fontFamily:"'Poppins',sans-serif",zIndex:99999999,
                userSelect:"none",boxShadow:`0 0 22px ${glowColor}90`,display:"none"});
            const head = document.createElement("div");
            Object.assign(head.style,{padding:"11px",background:"#1a1a1a",textAlign:"center",
                fontWeight:"700",fontSize:"16px",cursor:drag?"move":"default",
                borderRadius:"11px 11px 0 0",position:"relative"});
            head.textContent = title;
            win.appendChild(head);
            const body = document.createElement("div");
            body.innerHTML = html;
            body.style.padding = "10px";
            win.appendChild(body);
            document.body.appendChild(win);

            if (drag) {
                let dragging=false,ox,oy;
                head.onmousedown = e=>{dragging=true;ox=e.clientX-win.offsetLeft;oy=e.clientY-win.offsetTop;};
                document.onmousemove = e=>{if(dragging){win.style.left=(e.clientX-ox)+"px";win.style.top=(e.clientY-oy)+"px";}};
                document.onmouseup = ()=>dragging=false;
            }
            return {win,body,head};
        };

        const wins = {
            header:createWin("byzan.lol client v0.3","",false,"220px"),
            misc:createWin("Miscellaneous", `
                <label><input type="checkbox" id="orbAuto"> Auto Orb Clicker</label><br><br>
                <div id="orbDrop" style="background:#222;padding:8px;border-radius:7px;cursor:pointer;text-align:center;font-weight:600;font-size:14px">Orb Options</div>
                <div id="orbContent" style="display:none;padding-top:8px">Delay (ms: <input id="orbDelay" type="number" min="0" max="5000" value="${orbClickDelay}" style="width:78px;background:#111;color:white;border:1px solid #555;border-radius:5px;padding:3px"></div><br>
                <label><input type="checkbox" id="atomAuto"> Auto Atom Clicker</label><br><br>
                <div id="atomDrop" style="background:#222;padding:8px;border-radius:7px;cursor:pointer;text-align:center;font-weight:600;font-size:14px">Atom Options</div>
                <div id="atomContent" style="display:none;padding-top:8px">CPS: <input id="cpsInput" type="number" min="1" max="10000" value="${CPS}" style="width:88px;background:#111;color:white;border:1px solid #555;border-radius:5px;padding:3px"></div>
            `,true,"280px"),
            visual:createWin("Visual Settings", `
                <label style="font-size:14px;display:block;margin:5px 0;">Outline <input type="color" id="ocol" value="${outlineColor}"></label>
                <label style="font-size:14px;display:block;margin:5px 0;">Glow <input type="color" id="gcol" value="${glowColor}"></label>
                <label style="font-size:14px;display:block;margin:5px 0;">Notif <input type="color" id="ncol" value="${notifColor}"></label>
                <label style="font-size:14px;display:block;margin:10px 0 5px 0;"><input type="checkbox" id="hline" ${headerLineEnabled?"checked":""}> Header Line</label>
            `,true,"240px"),
            keybind:createWin("Keybind", `
                <p style="margin:8px 0 4px;font-size:14px">Menu Toggle Key:</p>
                <input id="keybindInput" type="text" value="${menuKey===' '?"Space":menuKey}" maxlength="12"
                    style="width:100%;background:#111;color:white;border:1px solid #555;border-radius:6px;padding:8px;text-align:center;font-size:16px;font-weight:bold">
                <p style="margin:10px 0 0;font-size:12px;color:#aaa">Click box to press any key</p>
            `,true,"200px"),
            notif:createWin("Notifications", `
                <label style="font-size:15px"><input type="checkbox" id="notiEnabled" ${notificationsEnabled?"checked":""}> Enable Notifications</label>
            `,true,"260px")
        };

        const keybindInput = wins.keybind.body.querySelector("#keybindInput");
        keybindInput.onkeydown = e => {
            e.stopPropagation();
            e.preventDefault();
            const key = e.key===" "?" ":e.key;
            const display = key===" "?"Space":key.length===1?key.toUpperCase():key;
            keybindInput.value = display;
            menuKey = key;
            settings.menuKey = key;
            save();
            notify(`Menu key to ${display}`);
        };
        keybindInput.onclick = () => keybindInput.focus();

        const updateColors = () => {
            Object.values(wins).forEach(w=>{
                w.win.style.borderColor=outlineColor;
                w.win.style.boxShadow=`0 0 22px ${glowColor}90`;
            });
            document.querySelectorAll(".header-line").forEach(l=>l.style.background=`linear-gradient(90deg,${outlineColor},${glowColor},${outlineColor})`);
        };

        const applyHeaderLine = enabled => {
            document.querySelectorAll(".win-fade > div:first-child").forEach(h=>{
                h.querySelectorAll(".header-line").forEach(el=>el.remove());
                if(enabled){
                    const line=document.createElement("div");
                    line.className="header-line";
                    h.style.position="relative";
                    h.appendChild(line);
                }
            });
        };

        const setupOrbObserver = () => {
            if(observer)observer.disconnect();
            if(!orbAutoClick||!container)return;
            observer = new MutationObserver(muts=>{
                muts.forEach(m=>m.addedNodes.forEach(n=>{
                    if(n.nodeType===1&&n.classList?.contains("power-up")&&n.classList?.contains("bonus-atom")){
                        yellowOrbCount++;
                        setTimeout(()=>n.click?.(),orbClickDelay);
                        notify(`Yellow Orbs Collected: ${yellowOrbCount}`);
                        console.log("[byzan.client.paid]: Yellow Orb Count: ${yellowOrbCount}");
                    }
                }));
            });
            observer.observe(container,{childList:true,subtree:true});
        };

        const setupAtomClicker = () => {
            if(atomInterval)clearInterval(atomInterval);
            if(!atomAutoClick)return;
            atomInterval = setInterval(()=>{
                const nucleus = document.querySelector(".nucleus");
                if(nucleus)nucleus.click();
            },1000/CPS);
        };

        wins.misc.body.querySelector("#orbAuto").checked = orbAutoClick;
        wins.misc.body.querySelector("#atomAuto").checked = atomAutoClick;
        wins.notif.body.querySelector("#notiEnabled").checked = notificationsEnabled;

        wins.misc.body.querySelector("#orbAuto").onchange = e=>{orbAutoClick=e.target.checked;settings.orbAutoClick=orbAutoClick;save();setupOrbObserver();};
        wins.misc.body.querySelector("#atomAuto").onchange = e=>{atomAutoClick=e.target.checked;settings.atomAutoClick=atomAutoClick;save();setupAtomClicker();};
        wins.notif.body.querySelector("#notiEnabled").onchange = e=>{notificationsEnabled=e.target.checked;settings.notificationsEnabled=notificationsEnabled;save();};
        wins.misc.body.querySelector("#orbDelay").onchange = e=>{orbClickDelay=Math.max(0,Math.min(5000,+(e.target.value||0)));settings.orbClickDelay=orbClickDelay;save();};
        wins.misc.body.querySelector("#cpsInput").onchange = e=>{CPS=Math.max(1,Math.min(10000,+(e.target.value||1)));settings.CPS=CPS;save();setupAtomClicker();};
        wins.visual.body.querySelector("#ocol").oninput = e=>{outlineColor=e.target.value;settings.outlineColor=outlineColor;updateColors();save();};
        wins.visual.body.querySelector("#gcol").oninput = e=>{glowColor=e.target.value;settings.glowColor=glowColor;updateColors();save();};
        wins.visual.body.querySelector("#ncol").oninput = e=>{notifColor=e.target.value;settings.notifColor=notifColor;save();};
        wins.visual.body.querySelector("#hline").onchange = e=>{headerLineEnabled=e.target.checked;settings.headerLineEnabled=headerLineEnabled;save();applyHeaderLine(headerLineEnabled);};

        wins.misc.body.querySelector("#orbDrop").onclick = ()=>{const c=wins.misc.body.querySelector("#orbContent");c.style.display=c.style.display==="block"?"none":"block";};
        wins.misc.body.querySelector("#atomDrop").onclick = ()=>{const c=wins.misc.body.querySelector("#atomContent");c.style.display=c.style.display==="block"?"none":"block";};

        const positionWindows = () => {
            const gap=18,top=28;let left=20;
            [wins.header,wins.misc,wins.visual,wins.keybind,wins.notif].forEach(w=>{
                w.win.style.left=left+"px";left+=w.win.offsetWidth+gap;w.win.style.top=top+"px";
            });
        };

        let menuVisible = true;
        document.addEventListener("keydown", e => {
            if (e.key === menuKey && document.activeElement !== keybindInput) {
                e.preventDefault();
                menuVisible = !menuVisible;
                Object.values(wins).forEach(w=>{
                    if(menuVisible){
                        w.win.style.display="block";
                        void w.win.offsetWidth;
                        w.win.classList.add("fade-in");
                    }else{
                        w.win.style.display="none";
                        w.win.classList.remove("fade-in");
                    }
                });
            }
        });

        Object.values(wins).forEach(w=>{w.win.style.display="block";w.win.classList.add("fade-in");});
        updateColors();
        applyHeaderLine(headerLineEnabled);
        setupOrbObserver();
        setupAtomClicker();
        positionWindows();
        window.addEventListener("resize",positionWindows);
    }
})();
