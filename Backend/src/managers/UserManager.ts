import { Socket } from "socket.io";
import { QuizManager } from "./QuizManager";
import { ADMIN_PASSWORD, AllowedSubmission } from "../CommonTypes";

export class UserManager {
  private quizManager;

  constructor() {
    this.quizManager = new QuizManager();
  }

  addUser(socket: Socket) {
    this.createHandlers(socket);
  }

  private createHandlers(socket: Socket) {
    socket.on("joinUser", (data) => {
      const userId = this.quizManager.addUser(data.roomId, data.name);
      socket.emit("init", {
        userId,
        state: this.quizManager.getCurrentState(data.roomId)
      });
      socket.join(data.roomId);
    });

    socket.on("joinAdmin", (data) => {
      if (data.password !== ADMIN_PASSWORD) {
        return;
      }

    });
    socket.on("createQuiz", data => {
      try {
        this.quizManager.addQuiz(data.roomId);
      } catch (e) {
        console.error("Error creating quiz:", e);
      }
    });
    socket.on("start", data => {
      console.log("start", data.roomId)
      try {
        this.quizManager.start(data.roomId)
      } catch (error) {
        console.error("Error in starting quiz")
      }
    })
    socket.on("createProblem", data => {
      try {
        this.quizManager.addProblem(data.roomId, data.problem);
      } catch (e) {
        console.error("Error creating problem:", e);
      }
    });

    socket.on("next", data => {
      try {
        this.quizManager.next(data.roomId);
      } catch (e) {
        console.error("Error moving to next problem:", e);
      }
    });

    socket.on("submit", (data: {
      userId: string,
      problemId: string,
      submission: AllowedSubmission,
      roomId: string
    }) => {
      try {
        const { userId, problemId, submission, roomId } = data;
        this.quizManager.submit(userId, roomId, problemId, submission);
      } catch (e) {
        console.error("Error submitting quiz:", e);
      }
    });
  }

}
