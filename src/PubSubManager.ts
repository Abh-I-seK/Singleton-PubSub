import { RedisClientType, createClient } from "redis"
import WebSocket from "ws"

export class PubSubManager {
  private static instance: PubSubManager
  private RedisClient: RedisClientType
  private subscriptions: Map<string, WebSocket[]>

  private constructor() {
    this.RedisClient = createClient()
    this.RedisClient.connect()
    this.subscriptions = new Map()
  }

  public static getInstance(): PubSubManager {
    if (!PubSubManager.instance) {
      return (this.instance = new PubSubManager())
    }
    return this.instance
  }

  addUser(userId: WebSocket, ticker: string) {
    if (!this.subscriptions.has(ticker)) {
      this.subscriptions.set(ticker, [])
    }
    this.subscriptions.get(ticker)?.push(userId)

    if (this.subscriptions.get(ticker)?.length === 1) {
      this.RedisClient.subscribe(ticker, (msg) => {
        this.forwardMessageToUser(ticker, msg)
      })
      console.log("Subscribed to channel : " + ticker)
    }
  }

  // must be called on an instance
  removeUser(userId: WebSocket, ticker: string) {
    if (!this.subscriptions.has(ticker)) {
      return
    }

    let a = this.subscriptions.get(ticker)?.filter((a) => a !== userId)
    if (!a) {
      a = []
    }
    this.subscriptions.set(ticker, a)

    if (this.subscriptions.get(ticker)?.length === 0) {
      this.RedisClient.unsubscribe(ticker)
      console.log("unsubscribed from : " + ticker)
    }
  }

  private forwardMessageToUser(ticker: string, msg: string) {
    let a = this.subscriptions.get(ticker)
    if (!a) {
      return
    }
    for (let i = 0; i < a.length; i++) {
      const client = a[i]
      client.send(msg)
    }
  }

  public async disconnect() {
    await this.RedisClient.quit()
  }
}
