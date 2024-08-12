import { h, Component } from "preact";

class Tab extends Component {
  constructor(props) {
    super(props);
    const firstTab = Array.isArray(this.props.tabs)
      ? this.props.tabs[0]
      : undefined;
    this.state = {
      activeTab: firstTab ? firstTab.name : "",
    };
  }

  onClickTabItem = (tab) => {
    this.setState({ activeTab: tab });
  };

  render({ tabs }, { activeTab }) {
    if (!Array.isArray(tabs)) {
      return null;
    }

    return (
      <div>
        <div className="tabs is-boxed is-centered is-large">
          <ul>
            {tabs.map((tab) => {
              const isActive = activeTab === tab.name ? "is-active" : "";
              return (
                <li
                  className={isActive}
                  onClick={() => this.onClickTabItem(tab.name)}
                >
                  <a>
                    <i className={`fa ${tab.icon}`} aria-hidden="true"></i>{" "}
                    &nbsp;
                    {tab.name}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="tab-content">
          <div className="columns has-text-centered">
            <div className="column"></div>
            <div className="column is-three-quarters">
              {tabs.map((tab) => {
                if (tab.name !== activeTab) return null;
                return (
                  <div>
                    {tab.content}
                    <div className="container has-text-centered mt-5">
                      <button className="button is-primary is-medium">
                        <a className="has-text-light" href={tab.link}>
                          Saiba Mais!
                        </a>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="column"></div>
          </div>
        </div>
      </div>
    );
  }
}

export default Tab;
