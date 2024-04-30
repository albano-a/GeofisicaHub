// Mobile menu burger

const burgerIcon = document.querySelector("#nav-burger");
const navbarMenu = document.querySelector("#nav-menu-items");

burgerIcon.addEventListener("click", () => {
  navbarMenu.classList.toggle("is-active");
});

// Theme dropdown

dropdownFunc = document.querySelector("#dropdown-btn");

dropdownFunc.addEventListener("click", () => {
  dropdownFunc.classList.toggle("is-active");
});

document.addEventListener("DOMContentLoaded", () => {
  const themeMap = {
    claro: "light",
    escuro: "dark",
  };

  const dropdownItems = document.querySelectorAll(".dropdown-item");
  dropdownItems.forEach((item) => {
    item.addEventListener("click", function () {
      // Remove the is-selected class from all items
      dropdownItems.forEach((item) => {
        item.classList.remove("is-active");
      });
      // Add the is-selected class to the clicked item
      this.classList.add("is-active");

      const theme = this.textContent.trim().toLowerCase();
      if (theme === "sistema") {
        document.documentElement.removeAttribute("data-theme");
      } else {
        const mappedTheme = themeMap[theme] || theme;
        document.documentElement.setAttribute("data-theme", mappedTheme);
      }
    });
  });
});
