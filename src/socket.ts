import WebSocket from "ws";
import { PubSubManager } from "./PubSubManager";


const server1 = new WebSocket.Server({port:3000})
server1.on('connection',(socket)=>{
    console.log("Client Connected to Server1");
    socket.on('message',(msg)=>{
        console.log("Server1 recieved : " + msg);
        PubSubManager.getInstance().addUser(socket,msg.toString());
    })
})



const server2 = new WebSocket.Server({port:3001})
server2.on('connection',(socket)=>{
    console.log("Client Connected to Server2");
    socket.on('message',(msg)=>{
        console.log("Server2 recieved : " + msg);
        PubSubManager.getInstance().addUser(socket,msg.toString());
    })
})

/*

    1 -> Add logic for when a client leaves the socket connection
    2 -> And make the msg come as json and then decide whether to subscribe or unsubscribe 

*/