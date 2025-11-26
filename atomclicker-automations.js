(function() {
    console.log("byzan.lol atom clicker automation");

    const container = document.querySelector('#app') || document.body;

    let orbAutoClick = true;
    let nucleusAutoClick = true;
    let CPS = 20;

    const orbObserver = new MutationObserver((mutationsList) => {
        if (!orbAutoClick) return;
        for (let mutation of mutationsList) {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(node => {
                    if (
                        node.nodeType === 1 &&
                        node.classList.contains('power-up') &&
                        node.classList.contains('bonus-atom')
                    ) {
                        console.log('Logged Yellow orb at:', node);
                        node.click();
                    }
                });
            }
        }
    });

    orbObserver.observe(container, { childList: true, subtree: true });

    let autoClickNucleusInterval;
    const startNucleusClicker = () => {
        if (autoClickNucleusInterval) clearInterval(autoClickNucleusInterval);
        autoClickNucleusInterval = setInterval(() => {
            if (!nucleusAutoClick) return;
            const nucleus = document.querySelector('.nucleus');
            if (nucleus) nucleus.click();
        }, 1000 / CPS);
    };
    startNucleusClicker();

    const ui = document.createElement("div");
    Object.assign(ui.style, {
        position: "fixed",
        top: "20px",
        right: "20px",
        background: "#111",
        color: "#fff",
        padding: "12px",
        border: "2px solid #6a5acd",
        borderRadius: "8px",
        zIndex: 99999999,
        fontFamily: "'Poppins', sans-serif",
        fontSize: "14px",
        width: "220px",
        boxShadow: "0 0 15px rgba(106,90,205,0.5)",
        cursor: "move"
    });

    ui.innerHTML = `
        <h4 style="margin:0 0 10px; font-weight:500;">byzan.lol automations</h4>
        <p><small>made by mrdavidss@discord</small></p>
        <label><input type="checkbox" id="orbToggle" checked> automattic orb clicker</label><br><br>
        <label><input type="checkbox" id="nucleusToggle" checked> automattic atom clicker</label><br><br>
        <label>CPS: <input type="number" id="cpsInput" value="${CPS}" style="width:60px;"></label><br><br>
        <button id="stopAutomation" style="
            padding:5px 10px;
            background:#6a5acd;
            color:#fff;
            border:none;
            border-radius:5px;
            cursor:pointer;
        ">Stop All</button>
    `;

    document.body.appendChild(ui);

    let isDragging = false;
    let offsetX, offsetY;

    ui.addEventListener("mousedown", (e) => {
        isDragging = true;
        offsetX = e.clientX - ui.getBoundingClientRect().left;
        offsetY = e.clientY - ui.getBoundingClientRect().top;
        ui.style.cursor = "grabbing";
    });

    document.addEventListener("mousemove", (e) => {
        if (!isDragging) return;
        ui.style.left = e.clientX - offsetX + "px";
        ui.style.top = e.clientY - offsetY + "px";
        ui.style.right = "auto";
    });

    document.addEventListener("mouseup", () => {
        if (isDragging) {
            isDragging = false;
            ui.style.cursor = "move";
        }
    });

    document.getElementById("orbToggle").addEventListener("change", (e) => {
        orbAutoClick = e.target.checked;
        console.log("Auto Orb Click:", orbAutoClick);
    });

    document.getElementById("nucleusToggle").addEventListener("change", (e) => {
        nucleusAutoClick = e.target.checked;
        console.log("Auto atom Click:", nucleusAutoClick);
    });

    document.getElementById("cpsInput").addEventListener("change", (e) => {
        const newCPS = parseFloat(e.target.value);
        if (!isNaN(newCPS) && newCPS > 0) {
            CPS = newCPS;
            startNucleusClicker();
            console.log("Updated CPS:", CPS);
        }
    });

    document.getElementById("stopAutomation").addEventListener("click", () => {
        orbObserver.disconnect();
        clearInterval(autoClickNucleusInterval);
        ui.remove();
        console.log("byzan.lol automation stopped");
    });

    console.log("byzan.lol automattion loaded");
})();
