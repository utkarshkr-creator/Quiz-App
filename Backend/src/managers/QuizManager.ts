import { AllowedSubmission } from "../CommonTypes";
import { Quiz } from "../Quiz";
import { IoManager } from "./IoManager";
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
            return;
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
            return;
        }
        quiz.next();
    }

    addUser(roomId: string, name: string) {
        return this.getQuiz(roomId)?.addUser(name);
    }

    submit(userId: string, roomId: string, problemId: string, submission: AllowedSubmission) {
        this.getQuiz(roomId)?.submit(userId, roomId, problemId, submission);
    }
    getQuiz(roomId: string) {
        // @ts-ignore
        return this.quizes.find(x => x.roomId === roomId) ?? null;
    }
    addQuiz(roomId:string){
        if(this.getQuiz(roomId)){
            return;
        }
        const quiz=new Quiz(roomId);
        this.quizes.push(quiz);
    }
    getCurrentState(roomId:string){
         // @ts-ignore
        const quiz=this.quizes.find(x=>x.roomId===roomId);
        if(!quiz){
            return null;
        }
        return quiz.getCurrentState();
    }
}