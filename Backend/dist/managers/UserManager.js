"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserManager = void 0;
const QuizManager_1 = require("./QuizManager");
const CommonTypes_1 = require("../CommonTypes");
class UserManager {
    constructor() {
        this.quizManager = new QuizManager_1.QuizManager();
    }
    addUser(socket) {
        this.createHandlers(socket);
    }
    createHandlers(socket) {
        socket.on("joinUser", (data) => {
            const userId = this.quizManager.addUser(data.roomId, data.name);
            socket.emit("init", {
                userId,
                state: this.quizManager.getCurrentState(data.roomId)
            });
            socket.join(data.roomId);
        });
        socket.on("joinAdmin", (data) => {
            if (data.password !== CommonTypes_1.ADMIN_PASSWORD) {
                return;
            }
        });
        socket.on("createQuiz", data => {
            try {
                this.quizManager.addQuiz(data.roomId);
            }
            catch (e) {
                console.error("Error creating quiz:", e);
            }
        });
        socket.on("start", data => {
            try {
                this.quizManager.start(data.roomId);
            }
            catch (error) {
                console.error("Error in starting quiz");
            }
        });
        socket.on("createProblem", data => {
            try {
                this.quizManager.addProblem(data.roomId, data.problem);
            }
            catch (e) {
                console.error("Error creating problem:", e);
            }
        });
        socket.on("next", data => {
            try {
                this.quizManager.next(data.roomId);
            }
            catch (e) {
                console.error("Error moving to next problem:", e);
            }
        });
        socket.on("submit", (data) => {
            try {
                const { userId, problemId, submission, roomId } = data;
                this.quizManager.submit(userId, roomId, problemId, submission);
            }
            catch (e) {
                console.error("Error submitting quiz:", e);
            }
        });
    }
}
exports.UserManager = UserManager;
