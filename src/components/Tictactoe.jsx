import { h } from "preact";
import { useState } from "preact/hooks";

function Game() {
  const [playerChoice, setPlayerChoice] = useState(null);
  const [computerChoice, setComputerChoice] = useState(null);
  const [result, setResult] = useState(null);

  const choices = ["Pedra", "Papel", "Tesoura"];

  function handlePlayerChoice(choice) {
    const computerChoice = choices[Math.floor(Math.random() * choices.length)];
    setPlayerChoice(choice);
    setComputerChoice(computerChoice);

    if (choice === computerChoice) {
      setResult("Empate!");
    } else if (
      (choice === "Pedra" && computerChoice === "Tesoura") ||
      (choice === "Papel" && computerChoice === "Pedra") ||
      (choice === "Tesoura" && computerChoice === "Papel")
    ) {
      setResult("Você ganhou!!!");
    } else {
      setResult("Você perdeu!");
    }
  }

  return (
    <div className="container has-text-centered box">
      <h2 className="is-size-5">Pedra, Papel ou Tesoura</h2>
      {choices.map((choice) => (
        <button
          className="button mx-3"
          onClick={() => handlePlayerChoice(choice)}
        >
          {choice}
        </button>
      ))}
      {playerChoice && computerChoice && (
        <div>
          <p className="is-size-5">Você escolheu: {playerChoice}</p>
          <p className="is-size-5">O computador escolheu: {computerChoice}</p>
          <p className="is-size-5 has-text-weight-bold">{result}</p>
        </div>
      )}
    </div>
  );
}

export default Game;
