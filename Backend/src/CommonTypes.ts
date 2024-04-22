export type AllowedSubmission= 0 | 1 | 2 | 3;
export const PROBLEM_END_TIME=15;
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
    roomId:string;
    optionSelected:AllowedSubmission;
}

export enum currentStatesEnum{
    Invalid="Invalid_RoomId",
    Leaderboard="leaderboard",
    Question="question",
    Not_Started="not_started",
    Ended="ended"
}


