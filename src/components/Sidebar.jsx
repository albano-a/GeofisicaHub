import { h, Component } from "preact";

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => (
  <div className="columns is-gapless">
    <button
      className="button is-primary"
      onClick={() => setSidebarOpen(!sidebarOpen)}
    >
      {sidebarOpen ? "Hide" : "Show"} Sidebar
    </button>
    <aside
      className={`column is-narrow menu ${sidebarOpen ? "" : "is-hidden"}`}
    >
      <p className="menu-label">General</p>
      <ul className="menu-list">
        <li>
          <a>Dashboard</a>
        </li>
        <li>
          <a>Customers</a>
        </li>
      </ul>
      <p className="menu-label">Administration</p>
      <ul className="menu-list">
        <li>
          <a>Team Settings</a>
        </li>
        <li>
          <a>Manage Your Team</a>
        </li>
      </ul>
    </aside>
  </div>
);

export default Sidebar;
