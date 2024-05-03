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
  localStorage.setItem(
    "dropdownActive",
    dropdownFunc.classList.contains("is-active")
  );
});

document.addEventListener("DOMContentLoaded", () => {
  const themeMap = {
    claro: "light",
    escuro: "dark",
  };

  const dropdownItems = document.querySelectorAll(".dropdown-item");
  dropdownItems.forEach((item) => {
    item.addEventListener("click", function () {
      dropdownItems.forEach((item) => {
        item.classList.remove("is-active");
      });
      this.classList.add("is-active");

      const theme = this.textContent.trim().toLowerCase();
      if (theme === "sistema") {
        document.documentElement.removeAttribute("data-theme");
        localStorage.removeItem("theme");
      } else {
        const mappedTheme = themeMap[theme] || theme;
        document.documentElement.setAttribute("data-theme", mappedTheme);
        localStorage.setItem("theme", mappedTheme);
      }
    });
  });

  const storedTheme = localStorage.getItem("theme");
  if (storedTheme) {
    document.documentElement.setAttribute("data-theme", storedTheme);
  }

  // Restore the dropdown state when the page loads
  window.onload = () => {
    const dropdownActive = localStorage.getItem("dropdownActive");
    if (dropdownActive === "true") {
      dropdownFunc.classList.add("is-active");
    }
  };
});
