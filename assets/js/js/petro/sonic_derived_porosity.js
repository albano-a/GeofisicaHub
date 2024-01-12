let Δtlog = document.getElementById("\u0394tlog");
let Δtma = document.getElementById("\u0394tma");
let Δtfl = document.getElementById("\u0394tfl");
let result = document.getElementById("result");
let resultPorc = document.getElementById("resultPorc");
let calculateButton = document.getElementById("calculateButton");
let errorMessage = document.getElementById("errorMessage");

const activateButton = () => {
    if ("" !== Δtlog.value.trim() && "" !== Δtma.value.trim() && "" !== Δtfl.value.trim()) {
        calculateButton.removeAttribute("disabled");
    } else {
        calculateButton.setAttribute("disabled", "true");
    }
    result.value = "";
    resultPorc.value = "";
};

Δtlog.onkeyup = activateButton;
Δtma.onkeyup = activateButton;
Δtfl.onkeyup = activateButton;

const clearErrorMessage = () => {
    setInterval(() => {
        errorMessage.innerHTML = "";
    }, 3000);
};

function calcPSW() {
    errorMessage.innerHTML = "";
    let a = parseFloat(Δtlog.value);
    let b = parseFloat(Δtma.value);
    let c = parseFloat(Δtfl.value);

    if (isNaN(a) || isNaN(b) || isNaN(c)) {
        errorMessage.innerHTML = "Todos os valores devem ser números!";
        return clearErrorMessage();
    }

    if (!a || !b || !c) {
        errorMessage.innerHTML = "Todos os valores são requeridos.";
        return clearErrorMessage();
    }

    if (0 > a || 0 > b || 0 > c) {
        errorMessage.innerHTML = "Todos os valores devem ser positivos.";
        return clearErrorMessage();
    }

    let d = ((a - b) / (c - b)).toFixed(4);
    let e = (100 * d).toFixed(2);

    if (0 > e || 100 < e) {
        errorMessage.innerHTML = "Algo está errado! O resultado não deve ser mais alto que 100% nem negativo. Cheque seus valores.";
        return clearErrorMessage();
    }

    result.value = d;
    resultPorc.value = `${e} %`;
}

calculateButton.onclick = calcPSW;