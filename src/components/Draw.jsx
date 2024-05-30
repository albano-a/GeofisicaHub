import { h } from "preact";
import { useState } from "preact/hooks";
import "bulma/css/bulma.min.css";

const Sorteios = () => {
  const [fileContent, setFileContent] = useState("");
  const [numOfPeople, setNumOfPeople] = useState(1);
  const [nameResult, setNameResult] = useState("");
  const [countdown, setCountdown] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFileContent(e.target.result);
      };
      reader.readAsText(file);
    }
  };

  const generateName = () => {
    const names = fileContent
      .split(",")
      .map((name) => name.trim())
      .filter((name) => name !== "");
    selectRandomNames(names, numOfPeople);
  };

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  };

  const selectRandomNames = (names, numOfPeople) => {
    shuffleArray(names);
    const selectedNames = names.slice(0, numOfPeople);
    if (countdown) {
      let countdownValue = 5;
      setNameResult(countdownValue);
      const countdownInterval = setInterval(() => {
        countdownValue--;
        if (countdownValue >= 0) {
          setNameResult(countdownValue);
        } else {
          clearInterval(countdownInterval);
          setNameResult(selectedNames.join(", "));
        }
      }, 1000);
    } else {
      setNameResult(selectedNames.join(", "));
    }
  };

  return (
    <div class="container">
      <div class="field">
        <label class="label">Arquivo de nomes</label>
        <div class="control">
          <input class="input" type="file" onChange={handleFileChange} />
        </div>
      </div>
      <div class="field">
        <label class="label">Número de pessoas</label>
        <div class="control">
          <input
            class="input"
            type="number"
            value={numOfPeople}
            onInput={(e) => setNumOfPeople(e.target.value)}
          />
        </div>
      </div>
      <div class="field">
        <div class="control">
          <label class="checkbox">
            <input
              type="checkbox"
              checked={countdown}
              onChange={(e) => setCountdown(e.target.checked)}
            />
            Contagem regressiva
          </label>
        </div>
      </div>
      <div class="field">
        <div class="control">
          <button class="button is-primary" onClick={generateName}>
            Gerar Nome
          </button>
        </div>
      </div>
      <div class="field">
        <div class="control">
          <textarea class="textarea" readOnly value={fileContent}></textarea>
        </div>
      </div>
      <div class="field">
        <div class="control">
          <div
            class="box"
            id="nameResult"
            style={{ fontSize: countdown ? "3em" : "initial" }}
          >
            {nameResult}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sorteios;
