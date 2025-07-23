import { Component, Input, NgModule, OnInit } from '@angular/core';
import {
  LiveStockWebsocketService,
  StockData,
} from '../services/live-stock-websocket.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Stock } from '../model/stock.model';
import { FormsModule, NgModel } from '@angular/forms';

@Component({
  selector: 'app-live-stock',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './live-stock.component.html',
  styleUrl: './live-stock.component.scss',
})
export class LiveStockComponent  implements OnInit{
  
// isActive:boolean = false;
// stock: any;
  stocks: Stock[] = [
    { symbol: 'AAPL', name: 'Apple', price: 0, previousPrice: 0, active: true },
    {
      symbol: 'GOOGL',
      name: 'Alphabet',
      price: 0,
      previousPrice: 0,
      active: true,
    },
    {
      symbol: 'MSFT',
      name: 'Microsoft',
      price: 0,
      previousPrice: 0,
      active: true,
    },
    {
      symbol: 'BINANCE:BTCUSDT',
      name: 'BINANCE:BTCUSDT',
      price: 0,
      previousPrice: 0,
      active: true,
    },
  ];
  constructor(private wsService: LiveStockWebsocketService) {}

  ngOnInit() {
    this.stocks.forEach((stock) => {
      // this.wsService.subscribeToStock(stock.symbol);
    });

    this.wsService.getMessages().subscribe((data: any) => {
      data?.data?.forEach((item: any) => {
        const stock = this.stocks.find((s) => s.symbol === item.s);
        if (stock && stock.active) {
          stock.previousPrice = stock.price;
          stock.price = item.p;

          console.log("stock",stock);
        }
      });
    });
  }

  toggleStock(stock: Stock) {
    stock.active = !stock.active;
    console.log("stock",stock);
    if (stock.active) {
      this.wsService.getMessages();
    } else {
      // this.wsService.unsubscribeFromStock(stock.symbol);
    }
  }

  getCardClass(stock: Stock): string {
    if (!stock.active) return 'inactive';

    const priceDiff = (stock.price - stock.previousPrice);
    // if (stock.price > stock.previousPrice) return 'up';
    // if (stock.price == stock.previousPrice) return 'up';
    // if (stock.price < stock.previousPrice) return 'down';

    // console.log("priceDiff",priceDiff +' DD'+stock.price,stock.previousPrice)
    // console.log("TTTTT",118237.36 - 118237.37);
    // -0.00999999999476131
    if(priceDiff == 0) return 'up'
    if (priceDiff > 0) return 'up';
    if (priceDiff < 0) return 'down';
    return '';
  }


  // ..................................................
  // messages: { symbol: string; price: number; timestamp: string }[] = [];

  // private sub!: Subscription;
  // constructor(private liveStockWebSocketService: LiveStockWebsocketService) {}
  // ngOnInit() {
  //   this.sub = this.liveStockWebSocketService
  //     .getMessages()
  //     .subscribe((data) => {
  //       console.log("Data",data);
  //       if (data.type === 'trade') {
  //         // Extract symbol and price from each trade
  //         for (const trade of data.data) {
  //           this.messages.unshift({
  //             symbol: trade.s,
  //             price: trade.p,
  //             timestamp: new Date(trade.t).toLocaleTimeString(),
  //           });
  //         }

  //         // Optional: limit list to last 10 updates
  //         if (this.messages.length > 1) {
  //           this.messages = this.messages.slice(0, 1);
  //         }
  //       }
  //     });

  //   console.log('Live Stock', this.messages);
  // }


}
