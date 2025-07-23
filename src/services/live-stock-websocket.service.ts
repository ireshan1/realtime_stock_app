import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import {webSocket, WebSocketSubject} from 'rxjs/webSocket';
import { environment } from '../environments/environment';

export interface StockData {
  symbol: string;
  current: number;
  high: number;
  low: number;
  prev: number | null;
  change: 'up' | 'down' | 'same';
}

@Injectable({
  providedIn: 'root'
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
  

 private socket!: WebSocket;
  private messageSubject = new Subject<any>();
  private readonly FINNHUB_URL = `wss://ws.finnhub.io?token=${environment.api_key}`;

  constructor() {
    this.connect();
  }

  private connect(): void {
    this.socket = new WebSocket(this.FINNHUB_URL);

    this.socket.addEventListener('open', () => {
      // Subscribe to symbols
      this.subscribe('AAPL');
      this.subscribe('GOOGL');
      this.subscribe('MSFT');
      this.subscribe('TSLA');
    });

    this.socket.addEventListener('message', (event) => {
      const data = JSON.parse(event.data);
      this.messageSubject.next(data);
    });

    this.socket.addEventListener('error', (error) => {
      console.error('WebSocket error:', error);
    });

    this.socket.addEventListener('close', () => {
      console.log('WebSocket connection closed');
    });
  }

  // Public method to listen to messages
  getMessages(): Observable<any> {
    return this.messageSubject.asObservable();
  }

  // Subscribe to a symbol
  subscribe(symbol: string): void {
    this.sendMessage({ type: 'subscribe', symbol });
  }

  // Unsubscribe from a symbol
  unsubscribe(symbol: string): void {
    this.sendMessage({ type: 'unsubscribe', symbol });
  }

  private sendMessage(msg: any): void {
    if (this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(msg));
    } else {
      // Delay if socket not open yet
      const interval = setInterval(() => {
        if (this.socket.readyState === WebSocket.OPEN) {
          this.socket.send(JSON.stringify(msg));
          clearInterval(interval);
        }
      }, 100);
    }
  }

  ngOnDestroy(): void {
    this.socket.close();
    this.messageSubject.complete();
  }
}