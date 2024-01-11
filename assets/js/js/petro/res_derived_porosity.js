// Resistivity derived porosity (resistivity porosity)

let aConstant = document.getElementById("aConstant");
let rw = document.getElementById("rw");
let rt = document.getElementById("rt");
let sw = document.getElementById("sw");
let n = document.getElementById("n");
let m = document.getElementById("m");
let result = document.getElementById("result");
let resultPorc = document.getElementById("resultPorc");
let calculateButton = document.getElementById("calculateButton");
let errorMessage = document.getElementById("errorMessage");

const activateButton = () => {
    if (aConstant.value.trim() !== "" || rw.value.trim() !== "" || rt.value.trim() !== "" || sw.value.trim() !== "" || n.value.trim() !== "" && m.value.trim() !== "") {
        calculateButton.removeAttribute("disabled");
    } else {
        calculateButton.setAttribute("disabled", "true");
    }
    result.value = "";
    resultPorc.value = "";
};

aConstant.onkeyup = activateButton;
rw.onkeyup = activateButton;
rt.onkeyup = activateButton;
sw.onkeyup = activateButton;
n.onkeyup = activateButton;
m.onkeyup = activateButton;

const clearErrorMessage = () => {
    setInterval(() => {
        errorMessage.innerHTML = "";
    }, 3000);
};

function calcPR() {
    errorMessage.innerHTML = "";
    let a = parseFloat(aConstant.value);
    let b = parseFloat(rw.value);
    let c = parseFloat(rt.value);
    let d = parseFloat(sw.value);
    let e = parseFloat(n.value);
    let f = parseFloat(m.value);

    if (isNaN(a) || isNaN(b) || isNaN(c) || isNaN(d) || isNaN(e) || isNaN(f)) {
        errorMessage.innerHTML = "All values must be numbers";
        clearErrorMessage();
        return;
    }

    if (!a || !b || !c || !d || !e || !f) {
        errorMessage.innerHTML = "All values are required";
        clearErrorMessage();
        return;
    }

    if (a < 0 || b < 0 || c < 0 || d < 0 || e < 0 || f < 0) {
        errorMessage.innerHTML = "All the values must be positive";
        clearErrorMessage();
        return;
    }

    if (d > 1) {
        errorMessage.innerHTML = "Saturation values must be a decimal number";
        clearErrorMessage();
        return;
    }

    let g = Math.pow(a * b / (c * Math.pow(d, e)), 1 / f).toFixed(4);
    let h = (100 * g).toFixed(2);

    if (h < 0 || h > 100) {
        errorMessage.innerHTML = "The result must not be higher than a 100% nor negative. Check your values";
        clearErrorMessage();
        return;
    }

    result.value = g;
    resultPorc.value = `${h} %`;
}

calculateButton.onclick = calcPR;