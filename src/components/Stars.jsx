import { StarIcon } from './Icons';

export default function Stars({ rating, reviews }) {
  return (
    <span className="stars" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => <StarIcon key={n} className={n <= Math.round(rating) ? 'on' : ''} />)}
      <span className="stars__txt">{rating}{reviews ? ` (${reviews.toLocaleString()})` : ''}</span>
    </span>
  );
}
