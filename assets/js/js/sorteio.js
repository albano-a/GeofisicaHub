document.addEventListener("DOMContentLoaded", function () {
  var generateButton = document.querySelector("#generateName");
  generateButton.addEventListener("click", generateName);

  var fileInput = document.querySelector('input[type="file"]');
  fileInput.addEventListener("change", function () {
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

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function selectRandomNames(names, numOfPeople, nameResult) {
  shuffleArray(names);
  var selectedNames = names.slice(0, numOfPeople);

  // Check if the countdown checkbox is checked
  var countdownCheckbox = document.getElementById("cdowncheck");
  if (countdownCheckbox.checked) {
    // Start the countdown
    var countdown = 5;
    nameResult.style.fontSize = "3em";
    var countdownInterval = setInterval(function () {
      nameResult.innerHTML = countdown;
      countdown--;
      if (countdown < 0) {
        clearInterval(countdownInterval);
        // Show the results after the countdown
        nameResult.innerHTML = selectedNames.join("<br>");
      }
    }, 1000);
  } else {
    // If the checkbox is not checked, show the results immediately
    nameResult.innerHTML = selectedNames.join("<br>");
  }
}
