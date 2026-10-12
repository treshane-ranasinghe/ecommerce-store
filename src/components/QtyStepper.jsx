import { MinusIcon, PlusIcon } from './Icons';

export default function QtyStepper({ value, onChange, min = 1, max = 10, small }) {
  return (
    <div className={`stepper ${small ? 'stepper--sm' : ''}`}>
      <button type="button" onClick={() => onChange(value - 1)} disabled={value <= min && min > 0} aria-label="Decrease quantity"><MinusIcon width={16} height={16} /></button>
      <span aria-live="polite">{value}</span>
      <button type="button" onClick={() => onChange(value + 1)} disabled={value >= max} aria-label="Increase quantity"><PlusIcon width={16} height={16} /></button>
    </div>
  );
}
