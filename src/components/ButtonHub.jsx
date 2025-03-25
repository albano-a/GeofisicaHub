import { h } from "preact";
import { useState, useEffect } from "preact/hooks";

const HubButtons = () => {
  const [selectedButton, setSelectedButton] = useState(null);

  const buttons = [
    { id: "geophy", label: "Geofísica", url: "/materials/geophysics" },
    { id: "geol", label: "Geologia", url: "/materials/geology" },
    { id: "calc", label: "Cálculo", url: "/materials/calculus" },
    { id: "phy", label: "Física", url: "/materials/physics" },
    { id: "pro", label: "Programação", url: "/materials/programming" },
  ];

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Verificar a URL atual e definir o botão selecionado
      const currentUrl = window.location.pathname;
      const matchedButton = buttons.find((button) => button.url === currentUrl);
      if (matchedButton) {
        setSelectedButton(matchedButton.id);
      }
    }
  }, []);

  const navigateTo = (url, id) => {
    setSelectedButton(id);
    if (typeof window !== "undefined") {
      window.location.href = url;
    }
  };

  return (
    <div>
      <div class="buttons has-addons are-large is-centered">
        {buttons.map(({ id, label, url }) => (
          <button
            class={`button ${
              selectedButton === id ? "is-primary is-active" : ""
            }`}
            id={id}
            key={id}
            onClick={() => navigateTo(url, id)}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default HubButtons;
