import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LiveStockWebsocketService {
  // private socket$: WebSocketSubject<any>;
  //   private readonly FINNHUB_TOKEN = 'd205nnhr01qmbi8r7qogd205nnhr01qmbi8r7qp0'; // Replace with your key
  //   private readonly FINNHUB_URL = `wss://ws.finnhub.io?token=${this.FINNHUB_TOKEN}`;

  //   private priceSubject = new Subject<{ symbol: string, price: number }>();

  //   constructor() {
  //     this.socket$ = webSocket(this.FINNHUB_URL);
  //     this.socket$.subscribe({
  //       next: (msg: any) => {
  //         if (msg?.data?.length) {
  //           msg.data.forEach((item: any) => {
  //             this.priceSubject.next({ symbol: item.s, price: item.p });
  //           });
  //         }
  //       },
  //       error: err => console.error('WebSocket error:', err),
  //       complete: () => console.log('WebSocket closed')
  //     });
  //   }

  //   subscribeToStock(symbol: string) {
  //     this.socket$.next({ type: 'subscribe', symbol });
  //   }

  //   unsubscribeFromStock(symbol: string) {
  //     this.socket$.next({ type: 'unsubscribe', symbol });
  //   }

  //   getPriceUpdates(): Observable<{ symbol: string, price: number }> {
  //     return this.priceSubject.asObservable();
  //   }

  private socket!: WebSocket; // WebSocket instance
  private messageSubject = new Subject<any>(); // Emits incoming messages to subscribers
  private readonly FINNHUB_URL = `wss://ws.finnhub.io?token=${environment.api_key}`; // Finnhub WebSocket endpoint
  private reconnectAttempts = 0; // Used for exponential backoff reconnection
  private messageQueue: any[] = []; // Stores messages until the socket is open
  private subscribedSymbols: Set<string> = new Set(); // Tracks currently subscribed symbols

  constructor() {
    this.connect(); // Start connection on service initialization

    // Ensure socket is closed when browser tab or window closes
    window.addEventListener('beforeunload', () => this.closeSocket());
  }

  /**
   * Establishes a WebSocket connection and sets up event handlers.
   * Also re-subscribes to previously subscribed stock symbols.
   */
  private connect(): void {
    // Avoid opening a new connection if one already exists
    if (
      this.socket &&
      (this.socket.readyState === WebSocket.OPEN ||
        this.socket.readyState === WebSocket.CONNECTING)
    ) {
      return;
    }

    this.socket = new WebSocket(this.FINNHUB_URL);

    // Connection opened
    this.socket.addEventListener('open', () => {
      console.log('WebSocket connected');
      this.reconnectAttempts = 0; // Reset reconnection attempts

      this.flushMessageQueue(); // Send any messages queued before socket was open

      // Re-subscribe to all previously subscribed stock symbols
      this.subscribedSymbols.forEach((symbol) => this.subscribe(symbol));
    });

    // Handle incoming message from the server
    this.socket.addEventListener('message', (event) => {
      const data = JSON.parse(event.data);
      this.messageSubject.next(data); // Emit message to subscribers
    });

    // Handle error and attempt reconnection
    this.socket.addEventListener('error', (error) => {
      console.error('WebSocket error:', error);
      this.reconnect();
    });

    // Handle disconnection and trigger reconnection
    this.socket.addEventListener('close', () => {
      console.warn('WebSocket closed. Attempting reconnect...');
      this.reconnect();
    });
  }

  /**
   * Automatically attempts to reconnect the WebSocket using exponential backoff.
   */
  private reconnect(): void {
    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000); // Cap at 30 seconds
    this.reconnectAttempts++;
    setTimeout(() => this.connect(), delay);
  }

  /**
   * Sends all queued messages after the socket has successfully opened.
   */
  private flushMessageQueue(): void {
    while (
      this.messageQueue.length &&
      this.socket.readyState === WebSocket.OPEN
    ) {
      const msg = this.messageQueue.shift();
      this.socket.send(JSON.stringify(msg));
    }
  }

  /**
   * Sends a message through the WebSocket or queues it if the socket isn't ready.
   * @param msg Object to send to the server
   */
  private sendMessage(msg: any): void {
    if (this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(msg));
    } else {
      this.messageQueue.push(msg); // Queue the message until socket opens
    }
  }

  /**
   * Returns an observable for receiving live messages from the WebSocket.
   */
  getMessages(): Observable<any> {
    return this.messageSubject.asObservable();
  }

  /**
   * Subscribes to a stock symbol (e.g., AAPL, TSLA).
   * @param symbol The stock ticker symbol to subscribe to
   */
  subscribe(symbol: string): void {
    this.subscribedSymbols.add(symbol); // Track the subscribed symbol
    this.sendMessage({ type: 'subscribe', symbol });
  }

  /**
   * Unsubscribes from a stock symbol.
   * @param symbol The stock ticker symbol to unsubscribe from
   */
  unsubscribe(symbol: string): void {
    this.subscribedSymbols.delete(symbol); // Remove from subscription list
    this.sendMessage({ type: 'unsubscribe', symbol });
  }

  /**
   * Closes the WebSocket connection safely.
   */
  private closeSocket(): void {
    if (this.socket) {
      this.socket.close(); // Close the socket when called
    }
  }
}
