"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Quiz = void 0;
const CommonTypes_1 = require("./CommonTypes");
const IoManager_1 = require("./managers/IoManager");
class Quiz {
    constructor(roomId) {
        this.roomId = roomId;
        this.hasStarted = false;
        this.problems = [];
        this.activeProblem = 0;
        this.users = [];
        this.currentStates = CommonTypes_1.currentStatesEnum.Not_Started;
    }
    addProblem(problem) {
        this.problems.push(problem);
    }
    start() {
        this.hasStarted = true;
        if (!this.problems[0]) {
            throw new Error("Problem not Added");
        }
        this.setActiveProblem(this.problems[0]);
    }
    setActiveProblem(problem) {
        this.currentStates = CommonTypes_1.currentStatesEnum.Question;
        problem.startTime = new Date().getTime();
        problem.submissions = [];
        console.log("roomId", this.roomId);
        const res = Promise.resolve(IoManager_1.IoManager.getIo().to(this.roomId).emit(CommonTypes_1.currentStatesEnum.Question, {
            problem
        }));
        console.log("res", res);
        setTimeout(() => {
            this.sendLeaderBoard();
        }, CommonTypes_1.PROBLEM_END_TIME * 1000);
    }
    sendLeaderBoard() {
        console.log("send Leaderboard called");
        this.currentStates = CommonTypes_1.currentStatesEnum.Leaderboard;
        const leaderboard = this.getLeaderboard(); //top 10
        IoManager_1.IoManager.getIo().to(this.roomId).emit(CommonTypes_1.currentStatesEnum.Leaderboard, {
            leaderboard
        });
    }
    getLeaderboard() {
        return this.users.sort((a, b) => a.points < b.points ? 1 : -1).slice(0, 10);
    }
    next() {
        if (!this.hasStarted) {
            throw new Error("Quiz not Started");
        }
        this.activeProblem++;
        this.currentStates = CommonTypes_1.currentStatesEnum.Question;
        const problem = this.problems[this.activeProblem];
        if (problem) {
            this.setActiveProblem(problem);
        }
        else {
            this.currentStates = CommonTypes_1.currentStatesEnum.Ended;
            const leaderboard = this.getLeaderboard(); //top 10
            IoManager_1.IoManager.getIo().to(this.roomId).emit(CommonTypes_1.currentStatesEnum.Ended, {
                leaderboard
            });
        }
    }
    getRandomString(length) {
        var chars = 'ABCDFGHIJKLMNOPQRSTUVWYZ!@#$%^&*abcdefghijklmnopqrstuvwxyz';
        var charLength = chars.length;
        var result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * charLength));
        }
        return result;
    }
    addUser(name) {
        const id = this.getRandomString(7);
        this.users.push({
            id,
            name,
            points: 0
        });
        return id;
    }
    submit(userId, roomId, problemId, submission) {
        const problemIndex = this.problems.findIndex(x => x.id === problemId);
        const userIndex = this.users.findIndex(x => x.id === userId);
        if (problemIndex === -1 || userIndex === -1) {
            console.log("User or Problem not Found");
            throw new Error("User or room not found");
        }
        const problem = this.problems[problemIndex];
        const existingSubmission = problem.submissions.find(x => x.userId === userId && x.roomId === roomId);
        if (existingSubmission) {
            console.log("Already Submitted");
            throw new Error("Already Submitted");
        }
        problem.submissions.push({
            problemId,
            userId,
            roomId,
            isCorrect: problem.answer === submission,
            optionSelected: submission
        });
        // Calculate points based on correctness and time
        const timeElapsed = new Date().getTime() - problem.startTime;
        const maxTime = CommonTypes_1.PROBLEM_END_TIME * 1000;
        const timeFactor = 1000 - (500 * timeElapsed / maxTime);
        const pointsToAdd = problem.answer === submission ? timeFactor : 0;
        console.log("user", this.users);
        console.log("uss", this.users[userIndex]);
        this.users[userIndex].points += pointsToAdd;
        console.log("User points updated:", this.users[userIndex].points);
    }
    getCurrentState() {
        if (this.currentStates === CommonTypes_1.currentStatesEnum.Not_Started) {
            return {
                type: CommonTypes_1.currentStatesEnum.Not_Started
            };
        }
        if (this.currentStates === CommonTypes_1.currentStatesEnum.Ended) {
            return {
                type: CommonTypes_1.currentStatesEnum.Ended,
                leaderboard: this.getLeaderboard()
            };
        }
        if (this.currentStates === CommonTypes_1.currentStatesEnum.Leaderboard) {
            return {
                type: CommonTypes_1.currentStatesEnum.Leaderboard,
                leaderboard: this.getLeaderboard()
            };
        }
        if (this.currentStates === CommonTypes_1.currentStatesEnum.Question) {
            const problem = this.problems[this.activeProblem];
            return {
                type: CommonTypes_1.currentStatesEnum.Question,
                problem
            };
        }
    }
}
exports.Quiz = Quiz;
