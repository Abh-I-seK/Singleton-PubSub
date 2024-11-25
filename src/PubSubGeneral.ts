import { RedisClientType , createClient } from "redis";


export class PubSubGeneral{
    private static instance : PubSubGeneral;
    private RedisClient : RedisClientType;
    private subscriptions : Map<string , string[]>;

    private constructor(){
        this.RedisClient = createClient();
        this.RedisClient.connect();
        this.subscriptions = new Map();
    }

    public static getInstance(){
        if(!this.instance){
            this.instance = new PubSubGeneral();
            return this.instance;
        }
        return this.instance;
    }

    addNewUser(userId : string , ticker : string){
        if(!this.subscriptions.get(ticker)){
            this.subscriptions.set(ticker , []);
        }

        this.subscriptions.get(ticker)?.push(userId);

        if(this.subscriptions.get(ticker)?.length === 1){
            this.RedisClient.subscribe(ticker , (msg)=>{
                this.forwardMessage(ticker , msg);
            })
        }
    }


    deleteUser(userId : string , ticker : string){
        this.subscriptions.get(ticker)?.filter((a) => a != userId);

        if(this.subscriptions.get(ticker)?.length === 0){
            this.RedisClient.unsubscribe(ticker);
        }
    }
    
    private forwardMessage(ticker : string , msg : string){
        let a = this.subscriptions.get(ticker);
        if(!a){
            return;
        }
        
        for(let i = 0 ; i < a.length ; i++){
            console.log("---------------");
            console.log("user : " + a[i]);
            console.log("Recieved : " + msg);
            console.log("---------------");
        }
    }
}