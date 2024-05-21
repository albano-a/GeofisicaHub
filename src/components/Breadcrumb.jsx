import { h } from "preact";

const Breadcrumb = ({ crumbs }) => (
  <nav className="breadcrumb" aria-label="breadcrumbs">
    <ul>
      {crumbs.map((crumb, index) => (
        <li className={index === crumbs.length - 1 ? "is-active" : ""}>
          <a href={crumb.link}>{crumb.name}</a>
        </li>
      ))}
    </ul>
  </nav>
);

export default Breadcrumb;

// Use
{
  /* <Breadcrumb crumbs={[
  { name: 'Home', link: '/' },
  { name: 'Page 1', link: '/page1' },
  { name: 'Page 2', link: '/page2' },
]} /> */
}
