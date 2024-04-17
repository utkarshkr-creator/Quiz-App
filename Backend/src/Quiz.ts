import { AllowedSubmission, currentStatesEnum, Problem, PROBLEM_END_TIME, User } from "./CommonTypes";
import { IoManager } from "./managers/IoManager";


export class Quiz {
    private roomId: string;
    private hasStarted: boolean;
    private problems: Problem[];
    private activeProblem: number;
    private users:User[];
    private currentStates:currentStatesEnum
    constructor(roomId: string) {
        this.roomId = roomId;
        this.hasStarted = false;
        this.problems = [];
        this.activeProblem = 0;
        this.users=[];
        this.currentStates=currentStatesEnum.Leaderboard
    }
    addProblem(problem: Problem) {
        this.problems.push(problem);
    }
    start() {
        this.hasStarted = true;
        this.setActiveProblem(this.problems[0]);
    }
    setActiveProblem(problem:Problem){
        this.currentStates=currentStatesEnum.Question;
        problem.startTime=new Date().getTime();
        problem.submissions=[];
        IoManager.getIo().to(this.roomId).emit("problem",{
            problem
        })
        setTimeout(()=>{
            this.sendLeaderBoard();
        },PROBLEM_END_TIME*1000);
    }
    sendLeaderBoard(){
        this.currentStates=currentStatesEnum.Leaderboard;
        const leaderboard=this.getLeaderboard();//top 10
        IoManager.getIo().to(this.roomId).emit(currentStatesEnum.Leaderboard,{
            leaderboard
        })
    }
    getLeaderboard(){
        return this.users.sort((a,b)=>a.points<b.points?1:-1).slice(0,10);
    }
    next() {
        this.activeProblem++;
        const problem = this.problems[this.activeProblem];
        if (problem) {
           this.setActiveProblem(problem);
        } else {
            this.currentStates=currentStatesEnum.Ended;
            const leaderboard=this.getLeaderboard();//top 10
            IoManager.getIo().to(this.roomId).emit(currentStatesEnum.Ended,{
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

    addUser(name:string){
        const id=this.getRandomString(7);
        this.users.push({
            id,
            name,
            points:0
        })
        return id;
    }
    submit(userId:string, roomId:string, problemId:string,submission:AllowedSubmission){
        const problem=this.problems.find(x=>x.id===problemId);
        const user=this.users.find(x=>x.id===userId);

        if(!problem || !user){
            console.log("User or Problem not Found");
        }
        const existingSubmission=problem?.submissions.find(x=>x.userId===userId);
        if(existingSubmission){
            console.log("Allready Submitted");
            return;
        }
        problem?.submissions.push({
            problemId,
            userId, 
            isCorrect:problem?.answer===submission,
            optionSelected:submission
        });
        // @ts-ignore
        user?.points+= (1000 - (500 * (new Date().getTime() - problem.startTime) / (PROBLEM_TIME_S * 1000)));
    }
    getCurrentState() {
        if (this.currentStates ===currentStatesEnum.Not_Started) {
            return {
                type: currentStatesEnum.Not_Started
            }
        }
        if (this.currentStates ===currentStatesEnum.Ended) {
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