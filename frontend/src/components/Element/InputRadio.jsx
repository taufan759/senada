export default function InputRadio({ id, name, label, value, onChange }) {
  return (
    <div className="flex items-center">
      <input
        type="radio"
        id={id}
        name={name}
        value={value}
        className="h-4 w-4 text-primary border-gray-300 focus:ring-primary"
        onChange={onChange}
      />
      <label htmlFor={id} className="ml-2 text-sm text-gray-700">
        {label}
      </label>
    </div>
  );
}