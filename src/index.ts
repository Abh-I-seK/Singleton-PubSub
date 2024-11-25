import { PubSubGeneral } from "./PubSubGeneral"

// setInterval(()=>{
    PubSubGeneral.getInstance().addNewUser(Math.random()+"" , "APPLE");
// },5000)