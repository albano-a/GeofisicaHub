let grlog = document.getElementById("grlog");
let grmin = document.getElementById("grmin");
let grmax = document.getElementById("grmax");
let result = document.getElementById("result");
let resultPorc = document.getElementById("resultPorc");
let calculateButton = document.getElementById("calculateButton");
let errorMessage = document.getElementById("errorMessage");

const activateButton = () => {
    if (grlog.value.trim() !== "" && grmin.value.trim() !== "" && grmax.value.trim() !== "") {
        calculateButton.removeAttribute("disabled");
    } else {
        calculateButton.setAttribute("disabled", "true");
    }
    result.value = "";
    resultPorc.value = "";
};

grlog.onkeyup = activateButton;
grmin.onkeyup = activateButton;
grmax.onkeyup = activateButton;

const clearErrorMessage = () => {
    setInterval(() => {
        errorMessage.innerHTML = "";
    }, 3000);
};

function calc() {
    errorMessage.innerHTML = "";
    let a = parseFloat(grlog.value);
    let b = parseFloat(grmin.value);
    let c = parseFloat(grmax.value);

    if (!a || !b || !c) {
        errorMessage.innerHTML = "Todos os valores são necessários";
        clearErrorMessage();
        return;
    }

    if (a < 0 || b < 0 || c < 0) {
        errorMessage.innerHTML = "Todos os valores devem ser positivos";
        clearErrorMessage();
        return;
    }

    if (isNaN(a) || isNaN(b) || isNaN(c)) {
        errorMessage.innerHTML = "Todos os valores devem ser números";
        clearErrorMessage();
        return;
    }

    let d = ((a - b) / (c - b)).toFixed(4);
    let e = (100 * d).toFixed(2);

    if (e < 0 || e > 100) {
        errorMessage.innerHTML = "O resultado não deve ser superior a 100% nem negativo. Verifique seus valores";
        clearErrorMessage();
        return;
    }

    result.value = d;
    resultPorc.value = `${e} %`;
}

calculateButton.onclick = calc;