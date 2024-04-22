import { useEffect, useState } from "react"
import { io } from "socket.io-client";
import { ADMIN_PASSWORD } from "../utils/CommonEnums";
import { CreateProblem } from "./CreateProblem";
import { QuizControls } from "./QuizControls";


export const Admin = () => {
  const [socket, setSocket] = useState<null | any>(null);
  const [quizId, setQuizId] = useState("");
  const [roomId, setRoomId] = useState("");
  const [start, setStart] = useState(false);
  useEffect(() => {
    const socket = io("http://localhost:3000");
    setSocket(socket);
    socket.on("connect", () => {
      socket.emit("joinAdmin", {
        password: ADMIN_PASSWORD
      })
    });
  }, []);
  if (!quizId) {
    return <div>
      <input type="text" onChange={(e) => {
        setRoomId(e.target.value)
      }} />
      <br />
      <button onClick={() => {
        socket.emit("createQuiz", {
          roomId
        });
        setQuizId(roomId);
      }}>Create room</button>

    </div>
  }
  return (
    < div className="flex flex-col w-full sm:w-1/2 p-2" >
      <div className="text-4xl font-bold text-zinc-600 my-2 flex justify-center">Room ID: {roomId}</div>
      <CreateProblem roomId={quizId} socket={socket} />
      <div className="flex flex-row w-full">
        {!start && <button
          className="w-1/4 m-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md shadow-md"
          type="submit"
          disabled={start}
          onClick={async () => {
            await socket.emit("start", {
              roomId
            })
            setStart(true)
          }}
        >
          Start Test
        </button>}
        {start && <QuizControls socket={socket} roomId={roomId} />}
      </div >
    </div>
  )
}
