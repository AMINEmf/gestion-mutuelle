import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="text-center py-5">
      <h1 className="display-1 text-muted">404</h1>
      <h2 className="mb-4">Page non trouvée</h2>
      <p className="text-muted mb-4">
        La page que vous recherchez n'existe pas ou a été déplacée.
      </p>
      <Link to="/" className="btn btn-primary">
        <i className="bi bi-house me-2"></i>Retour à l'accueil
      </Link>
    </div>
  );
}
