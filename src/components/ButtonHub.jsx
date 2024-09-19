import { h } from "preact";

const HubButtons = () => {
  const buttons = [
    { id: "geophy", label: "Geofísica", url: "/materials/geophysics" },
    { id: "geol", label: "Geologia", url: "/materials/geology" },
    { id: "calc", label: "Cálculo", url: "/materials/calculus" },
    { id: "phy", label: "Física", url: "/materials/physics" },
    { id: "pro", label: "Programação", url: "/materials/programming" },
  ];

  const navigateTo = (url) => {
    window.location.href = url;
  };

  return (
    <div>
      <div class="buttons has-addons are-large is-centered">
        {buttons.map(({ id, label, url }) => (
          <button
            class="button"
            id={id}
            key={id}
            onClick={() => navigateTo(url)}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default HubButtons;
