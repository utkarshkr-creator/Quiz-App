import { useState } from "react";

export const QuizControls = ({ socket, roomId }: { socket: any; roomId: string }) => {
  const [disabled, setDisabled] = useState(false);
  const [count, setCount] = useState(1);
  const handleNextProblem = () => {
    setDisabled(true);
    socket.emit("next", { roomId });
    setCount((prevCount) => prevCount + 1);
    setTimeout(() => {
      setDisabled(false);
    }, 15000); // Enable button after 15 seconds
  };

  return (
    <div>
      {!disabled && (
        <div className="w-full m-3 bg-green-500 hover:bg-green-800 text-white font-semibold py-2 px-4 rounded-md shadow-md">
          <button type="button" onClick={handleNextProblem}>
            Next problem ..{count + 1}
          </button>
        </div>
      )}
    </div>
  );
};

