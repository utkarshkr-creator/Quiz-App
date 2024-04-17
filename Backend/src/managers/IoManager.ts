import { Server } from "socket.io";
import http from 'http'
const server=http.createServer();
export class IoManager{
    private static io:Server;

    public static getIo(){
        if(!this.io){
            const io=new Server(server,{
                cors:{
                    origin:'http://localhost:3000',
                    methods:["GET","POST"]
                }
            });
            this.io=io;
        }
        return this.io;
    }

}