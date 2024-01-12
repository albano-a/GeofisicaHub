// Resistivity derived porosity (Sw= 1)
let aConstant = document.getElementById("aConstant");
let rw = document.getElementById("rw");
let rt = document.getElementById("rt");
let m = document.getElementById("m");
let result = document.getElementById("result");
let resultPorc = document.getElementById("resultPorc");
let calculateButton = document.getElementById("calculateButton");
let errorMessage = document.getElementById("errorMessage");

const activateButton = () => {
    if (aConstant.value.trim() !== "" || rw.value.trim() !== "" || rt.value.trim() !== "" || m.value.trim() !== "") {
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
m.onkeyup = activateButton;

const clearErrorMessage = () => {
    setInterval(() => {
        errorMessage.innerHTML = "";
    }, 3000);
};

function calcPRSW() {
    errorMessage.innerHTML = "";
    let a = parseFloat(aConstant.value);
    let b = parseFloat(rw.value);
    let c = parseFloat(rt.value);
    let d = parseFloat(m.value);

    if (isNaN(a) || isNaN(b) || isNaN(c) || isNaN(d)) {
        errorMessage.innerHTML = "All values must be numbers";
        clearErrorMessage();
        return;
    }

    if (!a || !b || !c || !d) {
        errorMessage.innerHTML = "All values are required";
        clearErrorMessage();
        return;
    }

    if (a < 0 || b < 0 || c < 0 || d < 0) {
        errorMessage.innerHTML = "All the values must be positive";
        clearErrorMessage();
        return;
    }

    let e = Math.pow(a * b / c, 1 / d).toFixed(4);
    let f = (100 * e).toFixed(2);

    if (f < 0 || f > 100) {
        errorMessage.innerHTML = "The result must not be higher than a 100% nor negative. Check your values";
        clearErrorMessage();
        return;
    }

    result.value = e;
    resultPorc.value = `${f} %`;
}

calculateButton.onclick = calcPRSW;