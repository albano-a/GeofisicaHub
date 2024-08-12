import { Component } from "preact";

class ContactForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      email: "",
      message: "",
    };
  }

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const { name, email, message } = this.state;

    return (
      <div className="columns">
        <div className="column"></div>
        <div className="column is-three-fifths">
          <form
            action="https://send.pageclip.co/97hG06fDuHb11qT1WrStPJe0ozO4bwZO"
            className="box pageclip-form"
            method="post"
          >
            <div className="field">
              <label className="label" htmlFor="name"></label>
              <div className="control has-icons-left">
                <input
                  className="input is-medium"
                  type="text"
                  id="name"
                  name="name"
                  value={name}
                  onChange={this.handleChange}
                  placeholder="Nome"
                />
                <span className="icon is-small is-left">
                  <i class="fa-solid fa-signature"></i>
                </span>
              </div>
            </div>
            <div className="field">
              <label className="label" htmlFor="email"></label>

              <div className="control has-icons-left">
                <input
                  className="input is-medium"
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={this.handleChange}
                  placeholder="Email"
                />
                <span class="icon is-small is-left">
                  <i class="fas fa-envelope"></i>
                </span>
              </div>
            </div>
            <div className="field">
              <label className="label" htmlFor="message"></label>
              <div className="control has-icons-left">
                <textarea
                  className="textarea"
                  id="message"
                  name="message"
                  value={message}
                  onChange={this.handleChange}
                  placeholder="Escreva sua mensagem aqui"
                />
              </div>
            </div>
            <div className="field has-text-centered">
              <div className="control">
                <button
                  className="button is-primary pageclip-form__submit"
                  type="submit"
                >
                  <span>Enviar</span>
                </button>
              </div>
            </div>
          </form>
        </div>
        <div className="column"></div>
      </div>
    );
  }
}

export default ContactForm;
