import { AllowedSubmission, currentStatesEnum, Problem, PROBLEM_END_TIME, User } from "./CommonTypes";
import { IoManager } from "./managers/IoManager";


export class Quiz {
  public roomId: string;
  private hasStarted: boolean;
  private problems: Problem[];
  private activeProblem: number;
  private users: User[];
  private currentStates: currentStatesEnum
  constructor(roomId: string) {
    this.roomId = roomId;
    this.hasStarted = false;
    this.problems = [];
    this.activeProblem = 0;
    this.users = [];
    this.currentStates = currentStatesEnum.Not_Started
  }
  addProblem(problem: Problem) {
    this.problems.push(problem);
  }
  start() {
    this.hasStarted = true;
    if (!this.problems[0]) {
      throw new Error("Problem not Added")
    }
    this.setActiveProblem(this.problems[0]);
  }
  setActiveProblem(problem: Problem) {
    this.currentStates = currentStatesEnum.Question;
    problem.startTime = new Date().getTime();
    problem.submissions = [];
    const res = Promise.resolve(IoManager.getIo().to(this.roomId).emit(currentStatesEnum.Question, {
      problem
    }));
    setTimeout(() => {
      this.sendLeaderBoard();
    }, PROBLEM_END_TIME * 1000);
  }
  sendLeaderBoard() {
    this.currentStates = currentStatesEnum.Leaderboard;
    const leaderboard = this.getLeaderboard();//top 10
    IoManager.getIo().to(this.roomId).emit(currentStatesEnum.Leaderboard, {
      leaderboard
    })
  }
  getLeaderboard() {
    return this.users.sort((a, b) => a.points < b.points ? 1 : -1).slice(0, 10);
  }
  next() {
    if (!this.hasStarted) {
      throw new Error("Quiz not Started")
    }
    this.activeProblem++;
    this.currentStates = currentStatesEnum.Question
    const problem = this.problems[this.activeProblem];
    if (problem) {
      this.setActiveProblem(problem);
    } else {
      this.currentStates = currentStatesEnum.Ended;
      const leaderboard = this.getLeaderboard();//top 10
      IoManager.getIo().to(this.roomId).emit(currentStatesEnum.Ended, {
        leaderboard
      })
    }
  }
  getRandomString(length: number) {
    var chars = 'ABCDFGHIJKLMNOPQRSTUVWYZ!@#$%^&*abcdefghijklmnopqrstuvwxyz';
    var charLength = chars.length;
    var result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * charLength));
    }
    return result;
  }

  addUser(name: string) {
    const id = this.getRandomString(7);
    this.users.push({
      id,
      name,
      points: 0
    })
    return id;
  }
  submit(userId: string, roomId: string, problemId: string, submission: AllowedSubmission) {
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
    const maxTime = PROBLEM_END_TIME * 1000;
    const timeFactor = 1000 - (500 * timeElapsed / maxTime);
    const pointsToAdd = problem.answer === submission ? timeFactor : 0;
    this.users[userIndex].points += pointsToAdd;
  }

  getCurrentState() {
    if (this.currentStates === currentStatesEnum.Not_Started) {
      return {
        type: currentStatesEnum.Not_Started
      }
    }
    if (this.currentStates === currentStatesEnum.Ended) {
      return {
        type: currentStatesEnum.Ended,
        leaderboard: this.getLeaderboard()
      }
    }
    if (this.currentStates === currentStatesEnum.Leaderboard) {
      return {
        type: currentStatesEnum.Leaderboard,
        leaderboard: this.getLeaderboard()
      }
    }
    if (this.currentStates === currentStatesEnum.Question) {
      const problem = this.problems[this.activeProblem];
      return {
        type: currentStatesEnum.Question,
        problem
      }
    }
  }



}
