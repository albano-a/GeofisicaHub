import { h } from "preact";
import { useState } from "preact/hooks";

const QuizCard = ({ question, options, correctIndex }) => {
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState("");

  const handleSubmit = () => {
    if (selected === null) {
      setFeedback("Por favor, selecione uma opção.");
      return;
    }

    if (selected === correctIndex) {
      setFeedback("Você acertou!");
    } else {
      setFeedback(
        `Resposta errada. A resposta correta é: ${options[correctIndex]}`
      );
    }
  };

  return (
    <div class="card">
      <div class="card-content">
        <div class="content has-text-left">
          <h3 class="title is-5">{question}</h3>
          <ul class="has-text-left">
            {options.map((option, index) => (
              <li key={index} class="mb-2">
                <label class="radio">
                  <input
                    type="radio"
                    name="quiz-option"
                    value={index}
                    checked={selected === index}
                    onChange={() => setSelected(index)}
                  />
                  <span class="ml-2">{option}</span>
                </label>
              </li>
            ))}
          </ul>
          <button class="button is-primary mt-3" onClick={handleSubmit}>
            Enviar
          </button>
          {feedback && (
            <p
              class={`mt-3 ${
                selected === correctIndex
                  ? "has-text-success"
                  : "has-text-danger"
              }`}
            >
              {feedback}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizCard;
