import { h, Component } from "preact";


class Draw extends Component {
  state = {
    file: null,
    names: '',
    numNames: 0,
    countdown: 5
  };

  handleFileChange = (e) => {
    this.setState({ file: e.target.files[0] });
  };

  handleNamesChange = (e) => {
    this.setState({ names: e.target.value });
  };

  handleNumNamesChange = (e) => {
    this.setState({ numNames: e.target.value });
  };

  handleCountdownChange = (e) => {
    this.setState({ countdown: e.target.value });
  };

  handleDraw = () => {
    // Implement the draw functionality here
  };

  render() {
    return (
      <div class="container">
        <div class="field">
          <div class="file is-info">
            <label class="file-label">
              <input
                class="file-input"
                type="file"
                name="resume"
                accept=".txt,.csv"
                onChange={this.handleFileChange}
              />
              <span class="file-cta">
                <span class="file-icon">
                  <i class="fas fa-upload"></i>
                </span>
                <span class="file-label">Choose a file…</span>
              </span>
            </label>
          </div>
        </div>
        <div class="field">
          <textarea class="textarea" placeholder="Add names here" onChange={this.handleNamesChange}></textarea>
        </div>
        <div class="field">
          <label class="label">How many names would you like to draw?</label>
          <input class="input" type="number" placeholder="Number of names" onChange={this.handleNumNamesChange} />
        </div>
        <div class="field">
          <label class="label">Countdown option</label>
          <div class="select">
            <select onChange={this.handleCountdownChange}>
              <option>5</option>
              <option>10</option>
              <option>15</option>
            </select>
          </div>
        </div>
        <div class="field">
          <button class="button is-primary" onClick={this.handleDraw}>Draw</button>
        </div>
      </div>
    );
  }
}

export default Draw;