const InputNumber = ({ name, onChange, placeHolder }) => {
  return (
    <div>
      <div className="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600">
        <input
          id={name}
          name={name}
          type="number"
          placeholder={placeHolder}
          className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
          onChange={onChange}
        />
      </div>
    </div>
  );
}

export default InputNumber;