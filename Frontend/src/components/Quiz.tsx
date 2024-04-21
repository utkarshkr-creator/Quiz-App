import { useState } from 'react';
export function Quiz({ quizData, socket, userId, problemId, roomId }: {
  quizData: {
    title: string;
    options: string[];
  },
  socket: any;
  roomId: string;
  userId: string;
  problemId: string;
}) {
  const [submitted, setSubmitted] = useState(false);
  const [submission, setSubmission] = useState(0);
  console.log(quizData);
  return (
    <div className="">
      <div className="p-2 flex w-full justify-center lg:max-w-3xl mx-auto">
        <div className="w-full">
          <SingleQuiz
            choices={quizData.options}
            title={quizData.title}
            imageURL={""}
            setSelected={setSubmission}
          />
          <div className="flex justify-between w-full mt-4">
            <button
              className="bg-[#2C2C2D] text-white w-64 px-8 py-4 rounded-full shadow-md hover:bg-[#2c2c2df1] focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 cursor-pointer"
              disabled={submitted}
              onClick={() => {
                setSubmitted(true);
                console.log("submite", submission)
                socket.emit("submit", {
                  userId,
                  problemId,
                  submission: Number(submission),
                  roomId,
                })
              }}
            >
              Submit
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

type SingleQuizProps = {
  title: string;
  choices: string[];
  imageURL?: string;
  setSelected: any;
};
function SingleQuiz({
  title,
  choices,
  imageURL,
  setSelected
}: SingleQuizProps) {
  console.log("inside quiz")
  return (
    <article className='w-full'>
      <div className="my-4 text-2xl lg:text-4xl font-bold">{title}</div>
      {imageURL && <img src={imageURL} alt="" />}
      {choices.length &&
        choices.map((choice, index) => {
          console.log(choice, "inside map")
          return (
            <label
              key={index}
              htmlFor={choice}
              className="p-4 lg:p-6 rounded-lg lg:rounded-3xl text-left text-black outline-offset-2 outline-4 focus-within:outline outline-[#E8E9FF] border focus-within:border-purple-500 hover:border flex items-center w-full mt-4 cursor-pointer"
            >
              <input
                type="radio"
                name="option"
                id={choice}
                value={choice}
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
