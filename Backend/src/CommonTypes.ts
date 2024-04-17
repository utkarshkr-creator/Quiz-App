export type AllowedSubmission= 0 | 1 | 2 | 3;
export const PROBLEM_END_TIME=20;
export const ADMIN_PASSWORD="adminhu"

export interface Problem {
    id:string;
    title: string;
    description: string;
    image?: string;
    startTime:number;
    answer: AllowedSubmission; 
    options: {
        id: number;
        title: string;
    }[];
    submissions:Submission[]
}
 
export interface User {
    name: string;
    id: string;
    points:number ;
}

export interface Submission{
    problemId:string;
    userId:string;
    isCorrect:boolean;
    optionSelected:AllowedSubmission;
}

export enum currentStatesEnum{
    Leaderboard="leaderboard",
    Question="question",
    Not_Started="not_started",
    Ended="ended"
}


