import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="container empty notfound">
      <h1 className="grad-text">404</h1>
      <h2>This page doesn’t exist.</h2>
      <p>It may have been moved, or the link is incorrect.</p>
      <Link to="/" className="btn btn--primary">Go Home</Link>
    </div>
  );
}
