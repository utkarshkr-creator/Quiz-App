import { AllowedSubmission } from "../CommonTypes";
import { Quiz } from "../Quiz";

let globalProblemId = 0;
export class QuizManager {
    private quizes: Quiz[];
    constructor() {
        this.quizes = [];
    }
    public start(roomId: string) {
        const quiz = this.getQuiz(roomId);
        if (!quiz) {
            return;
        }
        quiz.start();
    }
    public addProblem(roomId: string, problem: {
        title: string;
        description: string;
        image?: string;
        options: {
            id: number;
            title: string;
        }[];
        answer: AllowedSubmission;
    }) {
        const quiz = this.getQuiz(roomId);
        if (!quiz) {
            throw new Error("Invalid Room Id");
        }
        quiz.addProblem({
            ...problem,
            id: (globalProblemId++).toString(),
            startTime: new Date().getTime(),
            submissions: []
        });
    }
    public next(roomId: string) {
        const quiz = this.getQuiz(roomId);
        if (!quiz) {
            throw new Error("Invalid RoomId")
        }
        quiz.next();
    }

    addUser(roomId: string, name: string) {
        return this.getQuiz(roomId)?.addUser(name);
    }

    submit(userId: string, roomId: string, problemId: string, submission: AllowedSubmission) {
        console.log("here");
        this.getQuiz(roomId)?.submit(userId, roomId, problemId, submission);
    }
    getQuiz(roomId: string) {
        
        return this.quizes.find((x) => x.roomId === roomId) ?? null;
    }
    addQuiz(roomId:string){
        if(this.getQuiz(roomId)){
            console.log("Quiz already created")
            return;
        }
        const quiz=new Quiz(roomId);
        this.quizes.push(quiz);
    }
    getCurrentState(roomId:string){ 
        const quiz=this.quizes.find(x=>x.roomId===roomId);
        if(!quiz){
            return null;
        }
        return quiz.getCurrentState();
    }
}