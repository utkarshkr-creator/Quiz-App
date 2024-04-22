

import { useEffect, useState } from "react";

const initialState = "";
const initialOptionsState = [
  { id: 0, title: "" },
  { id: 1, title: "" },
  { id: 2, title: "" },
  { id: 3, title: "" }
];

export const CreateProblem = ({ socket, roomId }: { socket: any; roomId: string }) => {
  const [title, setTitle] = useState(initialState);
  const [description, setDescription] = useState(initialState);
  const [answer, setAnswer] = useState(0);
  const [options, setOptions] = useState(initialOptionsState);
  const [count, setCount] = useState(0);
  const resetInputs = () => {
    setTitle(initialState);
    setDescription(initialState);
    setOptions(initialOptionsState);
    setAnswer(0);
  };

  useEffect(() => {
    resetInputs();
  }, []); // Reset inputs only on component mount

  const handleInputChange = (optionId: number, value: string) => {
    setOptions((prevOptions) =>
      prevOptions.map((option) =>
        option.id === optionId ? { ...option, title: value } : option
      )
    );
  };

  const handleAddProblem = async () => {
    setCount((prevCount) => prevCount + 1);
    await socket.emit("createProblem", {
      roomId,
      problem: {
        title,
        description,
        options,
        answer
      }
    });
    resetInputs(); // Clear inputs after adding the problem
  };

  return (
    <div className="w-full mx-auto  p-6 rounded-lg shadow-md bg-slate-400">
      <h1 className="text-lg font-semibold mb-4">Create problem</h1>
      <label htmlFor="title" className="block mb-2">Title:</label>
      <input
        id="title"
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm mb-2"
      />
      <label htmlFor="description" className="block mb-2">Description:</label>
      <input
        id="description"
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm mb-4"
      />
      <label htmlFor="description" className="block mb-2">Options:</label>
      {options.map((option) => (
        <div key={option.id} className="flex items-center mb-2">
          <input
            type="radio"
            checked={option.id === answer}
            onChange={() => setAnswer(option.id)}
            className="mr-2"
          />
          <input
            type="text"
            value={option.title}
            onChange={(e) => handleInputChange(option.id, e.target.value)}
            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
      ))}
      <div className="flex">
        <button
          onClick={handleAddProblem}
          className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-md shadow-md"
        >
          Add problem
        </button>
        <div className="flex justify-center items-center mx-2">
          Problem Created: {count}
        </div>
      </div>
    </div>
  );
};

export default CreateProblem;

