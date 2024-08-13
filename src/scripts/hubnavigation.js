const buttons = [
  { id: "geophy", url: "../geophysics" },
  { id: "geol", url: "../geology" },
  { id: "calc", url: "../calculus" },
  { id: "phy", url: "../physics" },
  { id: "pro", url: "../programming" },
];

buttons.forEach(({ id, url }) => {
  const button = document.querySelector(`#${id}`);
  if (button) {
    button.addEventListener("click", () => {
      window.location.href = url;
    });
  }
});
