import { h } from 'preact';

const Breadcrumb = ({ crumbs }) => (
  <nav aria-label="breadcrumb">
    <ol>
      {crumbs.map((crumb, index) => (
        <li>
          <a href={crumb.link}>{crumb.name}</a>
          {index < crumbs.length - 1 && ' / '}
        </li>
      ))}
    </ol>
  </nav>
);

export default Breadcrumb;

// Use
{/* <Breadcrumb crumbs={[
  { name: 'Home', link: '/' },
  { name: 'Page 1', link: '/page1' },
  { name: 'Page 2', link: '/page2' },
]} /> */}