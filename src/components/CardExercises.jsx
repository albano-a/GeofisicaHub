import { Component } from "preact";
import { Link } from "preact-router/match";

class CardExercises extends Component {
  render() {
    const { title, description, href } = this.props;

    return (
      <>
        <div className="card">
          <div className="card-content">
            <p className="title">{title}</p>
            <p className="subtitle">{description}</p>
          </div>
          <footer className="card-footer">
            <Link href={href} className="card-footer-item">
              Clique aqui
            </Link>
          </footer>
        </div>
      </>
    );
  }
}

export default CardExercises;
