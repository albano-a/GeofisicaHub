document.addEventListener("DOMContentLoaded", function () {
    var generateButton = document.querySelector("#generateName");
    generateButton.addEventListener("click", generateName);

    var fileInput = document.querySelector('input[type="file"]');
    fileInput.addEventListener("change", function() {
        if (fileInput.files && fileInput.files[0]) {
            var reader = new FileReader();
            reader.onload = function (e) {
                var content = e.target.result;
                var textarea = document.querySelector("textarea");
                textarea.value = content; // Update the textarea with the file content
            };
            reader.readAsText(fileInput.files[0]);
        }
    });
});

function generateName() {
    var input = document.querySelector('input[type="file"]');
    var textarea = document.querySelector("textarea");
    var numOfPeople = document.getElementById("numOfPeople").value;
    var nameResult = document.getElementById("nameResult");

    var names = [];
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            var content = e.target.result;
            var lines = content.split(",");
            for (var i = 0; i < lines.length; i++) {
                if (lines[i].trim() !== "") {
                    names.push(lines[i].trim());
                }
            }
            selectRandomNames(names, numOfPeople, nameResult);
        };
        reader.readAsText(input.files[0]);
    } else {
        var textContent = textarea.value;
        var lines = textContent.split(",");
        for (var i = 0; i < lines.length; i++) {
            if (lines[i].trim() !== "") {
                names.push(lines[i].trim());
            }
        }
        selectRandomNames(names, numOfPeople, nameResult);
    }
}

function selectRandomNames(names, numOfPeople, nameResult) {
    var selectedNames = [];
    for (var i = 0; i < numOfPeople; i++) {
        if (names.length > 0) {
            var randomIndex = Math.floor(Math.random() * names.length);
            selectedNames.push(names[randomIndex]);
            names.splice(randomIndex, 1); // Remove the selected name from the names array
        } else {
            break;
        }
    }
    nameResult.innerHTML = selectedNames.join("<br>");
}
