import { h, Component } from "preact";

class SmallButton extends Component {
  state = {
    isFocused: false,
  };

  handleMouseEnter = () => {
    this.setState({ isFocused: true });
  };

  handleMouseLeave = () => {
    this.setState({ isFocused: false });
  };

  render() {
    const { isFocused } = this.state;
    const { children, href, color } = this.props;
    const buttonClass = `button is-rounded ${color} ${isFocused ? "is-focused" : ""} `;

    return (
      <a
        href={href}
        class={buttonClass}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
      >
        {children}
      </a>
    );
  }
}

export default SmallButton;
