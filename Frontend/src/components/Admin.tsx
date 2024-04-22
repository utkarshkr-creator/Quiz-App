import { useEffect, useState } from "react"
import { io } from "socket.io-client";
import { ADMIN_PASSWORD } from "../utils/CommonEnums";
import { CreateProblem } from "./CreateProblem";
import { QuizControls } from "./QuizControls";


export const Admin = () => {
  const [socket, setSocket] = useState<null | any>(null);
  const [quizId, setQuizId] = useState("");
  const [roomId, setRoomId] = useState("");
  useEffect(() => {
    const socket = io("http://localhost:3000");
    console.log(socket)
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
    <div className="flex flex-col">
      <CreateProblem roomId={quizId} socket={socket} />
      <button className="w-1/4 m-3 bg-blue-500" type="submit" onClick={async () => {
        console.log("start called")
        await socket.emit("start", {
          roomId
        })
      }}>Start Test</button>
      <QuizControls socket={socket} roomId={roomId} />
    </div>
  )
}
