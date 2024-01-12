// Porosity - Density Log *******
// working! *******
let pma = document.getElementById("pma");
let pb = document.getElementById("pb");
let pfl = document.getElementById("pfl");
let result = document.getElementById("result");
let resultPorc = document.getElementById("resultPorc");
let calculateButton = document.getElementById("calculateButton");
let errorMessage = document.getElementById("errorMessage");

const activateButton = () => {
    if (pma.value.trim() !== "" || pb.value.trim() !== "" || pfl.value.trim() !== "") {
        calculateButton.removeAttribute("disabled");
    } else {
        calculateButton.setAttribute("disabled", "true");
    }
    result.value = "";
    resultPorc.value = "";
};

pma.onkeyup = activateButton;
pb.onkeyup = activateButton;
pfl.onkeyup = activateButton;

const clearErrorMessage = () => {
    setInterval(() => {
        errorMessage.innerHTML = "";
    }, 3000);
};

function calcPD() {
    errorMessage.innerHTML = "";
    let a = parseFloat(pma.value);
    let b = parseFloat(pb.value);
    let c = parseFloat(pfl.value);

    if (isNaN(a) || isNaN(b) || isNaN(c)) {
        errorMessage.innerHTML = "All values must be numbers";
        clearErrorMessage();
        return;
    }

    if (a < 0 || b < 0 || c < 0) {
        errorMessage.innerHTML = "All the values must be positive";
        clearErrorMessage();
        return;
    }

    if (!a || !b || !c) {
        errorMessage.innerHTML = "All values are required";
        clearErrorMessage();
        return;
    }

    let d = ((a - b) / (a - c)).toFixed(4);
    let e = (100 * d).toFixed(2);

    if (e < 0 || e > 100) {
        errorMessage.innerHTML = "The result must not be higher than a 100% nor negative. Check your values";
        clearErrorMessage();
        return;
    }

    result.value = d;
    resultPorc.value = `${e} %`;
}

calculateButton.onclick = calcPD;