import { Component, Input, NgModule, OnInit } from '@angular/core';
import {
  LiveStockWebsocketService,
  StockData,
} from '../services/live-stock-websocket.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Stock } from '../model/stock.model';
import { FormsModule, NgModel } from '@angular/forms';
import { StockQuoteService } from '../services/stock-quote.service';

@Component({
  selector: 'app-live-stock',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './live-stock.component.html',
  styleUrl: './live-stock.component.scss',
})
export class LiveStockComponent implements OnInit {
  symbol: string = 'AAPL,TSLA';
  stocks: Stock[] = [
    {
      symbol: 'AAPL',
      name: 'Apple Inc',
      price: 0,
      previousPrice: 0,
      daily_high_price: 0,
      daily_low_price: 0,
      active: true,
    },
    {
      symbol: 'GOOGL',
      name: 'Alphabet Inc',
      price: 0,
      previousPrice: 0,
      daily_high_price: 0,
      daily_low_price: 0,
      active: true,
    },
    {
      symbol: 'MSFT',
      name: 'Microsoft',
      price: 0,
      previousPrice: 0,
      daily_high_price: 0,
      daily_low_price: 0,
      active: true,
    },
    {
      symbol: 'TSLA',
      name: 'Tesla Inc',
      price: 0,
      previousPrice: 0,
      daily_high_price: 0,
      daily_low_price: 0,
      active: true,
    },
  ];
  constructor(
    private wsService: LiveStockWebsocketService,
    private stkService: StockQuoteService
  ) {}

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
          console.log('stock', stock);
        }
      });
    });

    this.stkService
      .getMultipleQuotes(['AAPL', 'GOOGL', 'MSFT', 'TSLA'])
      .subscribe((results: any[]) => {
        results.forEach((item, index) => {
          if (this.stocks[index]) {
            this.stocks[index].daily_high_price = item?.h;
            this.stocks[index].daily_low_price = item?.l;
          }
        });

        console.log('results', results);
        console.log('this.stocks', this.stocks);
      });
  }

  toggleStock(stock: Stock) {
    stock.active = !stock.active;
    console.log('stock', stock);
    if (stock.active) {
      this.wsService.getMessages();
    } else {
      this.wsService.unsubscribe(stock.symbol);
    }
  }

  // getCardClass(stock: Stock): string {
  //   if (!stock.active) return 'inactive';

  //   const priceDiff = (stock.price - stock.previousPrice);
  //   if(priceDiff == 0) return 'up'
  //   if (priceDiff > 0) return 'up';
  //   if (priceDiff < 0) return 'down';
  //   return '';
  // }

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
