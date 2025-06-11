export default function CardOption({ title, icon, description, tujuan, onClick }) {
  return (
    <div
      className={`border rounded-lg p-4 transition-all duration-300 cursor-pointer
          ${tujuan === title
          ? 'border-blue-500 bg-blue-50 shadow-md'
          : 'border-gray-200 hover:border-blue-500 hover:bg-blue-50 hover:shadow-md'}`}
      onClick={onClick}
    >
      <div className="text-3xl mb-2">{icon}</div>
      <h3 className="font-semibold mb-1">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
}