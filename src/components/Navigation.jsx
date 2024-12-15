import { Component } from "preact";
import { Link } from "preact-router/match";

class Navbar extends Component {
  state = { isActive: false };

  toggleIsActive = () => {
    this.setState((prevState) => ({ isActive: !prevState.isActive }));
  };

  render({}, { isActive }) {
    return (
      <nav
        class="navbar has-shadow"
        role="navigation"
        aria-label="main navigation"
      >
        <div className="container">
          <div class="navbar-brand">
            <a class="navbar-item" href="/">
              <img src="/logotipo_final.svg" />
            </a>

            <a
              role="button"
              class={`navbar-burger burger ${isActive ? "is-active" : ""}`}
              aria-label="menu"
              aria-expanded="false"
              onClick={this.toggleIsActive}
            >
              <span aria-hidden="true"></span>
              <span aria-hidden="true"></span>
              <span aria-hidden="true"></span>
              <span aria-hidden="true"></span>
            </a>
          </div>

          <div class={`navbar-menu ${isActive ? "is-active" : ""}`}>
            <div class="navbar-end">
              <Link class="navbar-item" href="/">
                Início
              </Link>

              <div class="navbar-item has-dropdown is-hoverable">
                <a class="navbar-link">Sobre</a>

                <div class="navbar-dropdown">
                  <Link class="navbar-item" href="/about/about-site">
                    Sobre o site
                  </Link>
                  <Link class="navbar-item" href="/about/about-geophysics">
                    Sobre a Geofísica
                  </Link>
                  <Link class="navbar-item" href="/about/geophysics-uff">
                    Geofísica - UFF
                  </Link>
                </div>
              </div>
              <div class="navbar-item has-dropdown is-hoverable">
                <a class="navbar-link">Ferramentas</a>

                <div class="navbar-dropdown">
                  <h2 class="navbar-item has-text-weight-bold is-size-6">
                    Pesquisa
                  </h2>
                  <Link class="navbar-item" href="/tools/research/articles">
                    Artigos
                  </Link>
                  <hr class="navbar-divider" />
                  <h2 class="navbar-item has-text-weight-bold is-size-6">
                    Calculadoras
                  </h2>
                  <Link
                    class="navbar-item"
                    href="/tools/calculator/calculator-hub"
                  >
                    Geral
                  </Link>
                  <Link class="navbar-item" href="/tools/calculator/petrocalc">
                    PetroCalc
                  </Link>
                  <hr class="navbar-divider" />
                  <h2 class="navbar-item has-text-weight-bold is-size-6">
                    Mais ferramentas
                  </h2>
                  <Link class="navbar-item" href="/tools/other-tools/resources">
                    Recursos
                  </Link>
                  <Link class="navbar-item" href="/tools/other-tools/events">
                    Eventos
                  </Link>
                  <Link
                    class="navbar-item"
                    href="/tools/other-tools/lucky-draw"
                  >
                    Sorteio
                  </Link>
                </div>
              </div>
              <div class="navbar-item has-dropdown is-hoverable">
                <a class="navbar-link">Materiais</a>
                <div class="navbar-dropdown">
                  <Link class="navbar-item" href="/materials/HUB">
                    HUB
                  </Link>
                  <Link class="navbar-item" href="/materials/geophysics">
                    Geofísica
                  </Link>
                  <Link class="navbar-item" href="/materials/geology">
                    Geologia
                  </Link>
                  <Link class="navbar-item" href="/materials/calculus">
                    Cálculo
                  </Link>
                  <Link class="navbar-item" href="/materials/physics">
                    Física
                  </Link>
                  <Link class="navbar-item" href="/materials/programming">
                    Programação
                  </Link>
                  <hr class="navbar-divider" />
                  <Link class="navbar-item" href="/materials/exercises">
                    Exercícios
                  </Link>
                </div>
              </div>
              <Link class="navbar-item" href="/contact">
                Contato
              </Link>
            </div>
          </div>
        </div>
      </nav>
    );
  }
}

export default Navbar;
