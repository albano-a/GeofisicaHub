import { h, Component } from "preact";

class ExpandableSideBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: true,
      activeLink: "/materials/HUB", // Set initial active link
    };
  }

  setActiveLink = (link) => {
    this.setState({ activeLink: link });
  };

  toggleSidebar = () => {
    this.setState((prevState) => ({
      isOpen: !prevState.isOpen,
    }));
  };

  render() {
    const { isOpen } = this.state;

    return (
      <div
        className="column is-2"
        style={{
          width: "250px",
          transition: "width 0.3s ease-in-out",
        }}
      >
        <button
          className="button is-link"
          onClick={this.toggleSidebar}
          style={{ position: "absolute", right: "0" }}
        >
          {isOpen ? (
            <i className="fa-solid fa-arrow-right"></i>
          ) : (
            <i className="fa-solid fa-arrow-left"></i>
          )}
        </button>
        <aside
          className="menu box"
          style={{
            opacity: isOpen ? "0" : "1",
            transition: "opacity 0.3s ease-in-out",
          }}
        >
          <p className="menu-label is-size-5">Acesso rápido</p>
          <ul className="menu-list is-size-5">
            <li class="is-active">
              <a
                href="/materials/HUB"
                className={activeLink === "/materials/HUB" ? "is-active" : ""}
                onClick={() => this.setActiveLink("/materials/HUB")}
              >
                HUB
              </a>
            </li>
            <li>
              <a class="is-active" href="/materials/geophysics">
                Geofísica
              </a>
            </li>
            <li>
              <a href="/materials/geology">Geologia</a>
            </li>
            <li>
              <a href="/materials/calculus">Cálculo</a>
            </li>
            <li>
              <a href="/materials/physics">Física</a>
            </li>
            <li>
              <a href="/materials/programming">Programação</a>
            </li>
          </ul>
        </aside>
      </div>
    );
  }
}

export default ExpandableSideBar;
