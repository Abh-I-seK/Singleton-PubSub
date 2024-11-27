import WebSocket from "ws"
import { PubSubManager } from "./PubSubManager"

const server1 = new WebSocket.Server({ port: 3000 })
server1.on("connection", (socket) => {
  console.log("Client Connected to Server1")
  socket.on("message", (msg) => {
    console.log("Server1 recieved : " + msg)
    PubSubManager.getInstance().addUser(socket, msg.toString())
  })

  socket.on("close", () => {
    socket.send("Disconnected !")
    // Here I hard coded the stock ticker which I have to remove
    // but actually should take the input from user in the msg as a json or something then do it
    PubSubManager.getInstance().removeUser(socket, "APPLE")
  })
})

const server2 = new WebSocket.Server({ port: 3001 })
server2.on("connection", (socket) => {
  console.log("Client Connected to Server2")
  socket.on("message", (msg) => {
    console.log("Server2 recieved : " + msg)
    PubSubManager.getInstance().addUser(socket, msg.toString())
  })

  socket.on("close", () => {
    socket.send("Disconnected !")
    // Here I hard coded the stock ticker which I have to remove
    // but actually should take the input from user in the msg as a json or something then do it
    PubSubManager.getInstance().removeUser(socket, "APPLE")
  })
})

/*
    1 -> And make the msg come as json and then decide whether to subscribe or unsubscribe 
*/