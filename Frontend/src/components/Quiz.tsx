import { useEffect, useState } from 'react';
export function Quiz({ quizData, socket, userId, problemId, roomId }: {
  quizData: {
    title: string;
    description: string;
    options: {
      title?: string,
      id: number
    }[];
  },
  socket: any;
  roomId: string;
  userId: string;
  problemId: string;
}) {
  const [submitted, setSubmitted] = useState(false);
  const [submission, setSubmission] = useState(0);

  const [countdown, setCountdown] = useState(15);
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (countdown > 0) {
      interval = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [])
  return (
    <div className="w-full sm:w-1/2 mx-auto  p-6 rounded-lg shadow-md bg-slate-400">
      <div className="p-2 flex w-full justify-center lg:max-w-3xl mx-auto">
        <div className="w-full">
          <div className='text-2xl text-red-500'>
            Time Left:{countdown}s
          </div>
          <SingleQuiz
            choices={quizData.options}
            title={quizData.title}
            description={quizData.description}
            imageURL={""}
            setSelected={setSubmission}
          />
          <div className="flex justify-between w-full mt-4">
            {!submitted && <button
              className="bg-[#2C2C2D] text-white w-64 px-8 py-4 rounded-full shadow-md hover:bg-[#2c2c2df1] focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 cursor-pointer"
              disabled={submitted}
              onClick={async () => {
                setSubmitted(true);
                await socket.emit("submit", {
                  userId,
                  problemId,
                  submission: Number(submission),
                  roomId,
                })
              }}
            >
              Submit
            </button>}
          </div>

          {submitted && <div className='text-4xl text-teal-600'>Submited</div>}
        </div>
      </div>
    </div>
  );
}

type SingleQuizProps = {
  title: string;
  description: string;
  choices: {
    title?: string,
    id: number
  }[];
  imageURL?: string;
  setSelected: any;
};
function SingleQuiz({
  title,
  description,
  choices,
  imageURL,
  setSelected
}: SingleQuizProps) {
  return (
    <article>
      <div className="text-2xl lg:text-4xl font-bold text-lime-700">{title}</div>
      <div className="text-2xl text-white">{description}</div>
      {imageURL && <img src={imageURL} alt="" />}
      {choices.length &&
        choices.map((choice, index) => {
          return (
            <label
              key={index}
              htmlFor={choice.id.toString()}
              className="p-4 lg:p-6 rounded-lg lg:rounded-3xl text-left text-black outline-offset-2 outline-4 focus-within:outline outline-[#E8E9FF] border focus-within:border-purple-500 hover:border flex items-center w-full mt-4 cursor-pointer"
            >
              <input
                type="radio"
                name="option"
                id={choice.id.toString()}
                value={choice.title}
                className="w-6 h-6 checked:bg-purple-500"
                onClick={() => {
                  setSelected(index)
                }}
              />
              <p className="ml-6 ">{choice.title}</p>
            </label>
          );
        })}
      <div className="flex flex-col items-start w-full"></div>
    </article>
  );
}
