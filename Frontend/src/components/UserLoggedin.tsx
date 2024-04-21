import { useEffect, useState } from "react"
import { io } from "socket.io-client";
import { currentStateType } from "../utils/CommonEnums";
import { LeaderBoard } from "./LeaderBoard";
import { Quiz } from "./Quiz";
export const UserLoggedin = ({ code, name }: { code: string, name: string }) => {
  const [socket, setSocket] = useState<any>(null);
  const roomId = code;
  const [currentState, setCurrentState] = useState<currentStateType>(currentStateType.Not_Started);
  const [currentQuestion, setCurrentQuestion] = useState<any>(null);
  const [leaderBoard, setLeaderBoard] = useState([]);
  const [userId, setUserId] = useState("");
  useEffect(() => {
    const socket = io("http://localhost:3000");
    setSocket(socket);

    socket.on("connect", () => {
      socket.emit("joinUser", {
        roomId,
        name
      })
    });
    //@ts-ignore
    socket.on("init", ({ userId, state }) => {
      setUserId(userId);
      console.log(state);
      if (state.leaderboard) {
        setLeaderBoard(state.leaderboard);
      }
      if (state.problem) {
        setCurrentQuestion(state.problem);
      }
      setCurrentState(state.type);
    });

    socket.on(currentStateType.Leaderboard, (data: any) => {
      setCurrentState(currentStateType.Leaderboard);
      setLeaderBoard(data.leaderboard);
    });

    socket.on(currentStateType.Problem, (data: any) => {
      setCurrentState(currentStateType.Question);
      setCurrentQuestion(data.problem);
    });

  }, []);
  console.log(currentState);
  if (currentState === currentStateType.Not_Started) {
    return <div>
      This quiz hasn't started Yet
    </div>
  }

  if (currentState === currentStateType.Question) {
    console.log("quiz dta", currentQuestion)
    return <Quiz
      roomId={roomId}
      userId={userId}
      problemId={currentQuestion?.id}
      quizData={{
        title: currentQuestion?.description,
        options: currentQuestion?.options,
      }}
      setCurrentState
      socket={socket}
    />
  }

  if (currentState === currentStateType.Leaderboard) {
    return <LeaderBoard
      leaderboardData={leaderBoard.map((x: any) => ({
        points: x.points,
        username: x.name,
        image: x.image,
      }))}
    />
  }
  return (
    <div>
      Quiz han ended
    </div>
  )
}
