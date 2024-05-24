import { Component } from "preact";
import { Link } from "preact-router/match";

class CardMaterials extends Component {
  render() {
    const { title, description, href, imgSrc } = this.props;

    return (
      <div className="card">
        <div className="card-image">
          <figure className="image is-3by4">
            <img src={imgSrc} alt={title} />
          </figure>
        </div>
        <div className="card-content">
          <p className="is-size-5 has-text-centered">{description}</p>
        </div>
        <footer className="card-footer">
          <Link className="card-footer-item has-text-weight-bold " href={href}>
            Acesse aqui!
          </Link>
        </footer>
      </div>
    );
  }
}

export default CardMaterials;
