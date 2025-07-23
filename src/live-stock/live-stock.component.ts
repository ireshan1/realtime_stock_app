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
  
  stocks: Stock[] = [
    {
      symbol: 'AAPL',
      name: 'Apple Inc',
      price: 0,
      previousPrice: 0,
      daily_high_price: 0,
      daily_low_price: 0,
      fifty_two_week_high_price: 0,
      fifty_two_week_low_price: 0,
      active: true,
    },
    {
      symbol: 'GOOGL',
      name: 'Alphabet Inc',
      price: 0,
      previousPrice: 0,
      daily_high_price: 0,
      daily_low_price: 0,
      fifty_two_week_high_price: 0,
      fifty_two_week_low_price: 0,
      active: true,
    },
    {
      symbol: 'MSFT',
      name: 'Microsoft',
      price: 0,
      previousPrice: 0,
      daily_high_price: 0,
      daily_low_price: 0,
      fifty_two_week_high_price: 0,
      fifty_two_week_low_price: 0,
      active: true,
    },
    {
      symbol: 'TSLA',
      name: 'Tesla Inc',
      price: 0,
      previousPrice: 0,
      daily_high_price: 0,
      daily_low_price: 0,
      fifty_two_week_high_price: 0,
      fifty_two_week_low_price: 0,
      active: true,
    },
  ];
  constructor(
    private wsService: LiveStockWebsocketService,
    private stkService: StockQuoteService
  ) {}

  ngOnInit() {
    this.wsService.getMessages().subscribe((data: any) => {
      data?.data?.forEach((item: any) => {
        const stock = this.stocks.find((s) => s.symbol === item.s);
        if (stock && stock.active) {
          stock.previousPrice = stock.price;
          stock.price = item.p;
        }
      });
    });

    this.getDailyPrice();
    this.getWeeklyPrice();
  }

  getDailyPrice(): void {
    this.stkService
      .getMultipleQuotes()
      .subscribe((results: any[]) => {
        results.forEach((item, index) => {
          if (this.stocks[index]) {
            this.stocks[index].daily_high_price = item?.h;
            this.stocks[index].daily_low_price = item?.l;
          }
        });
        // console.log('results', results);
        // console.log('this.stocks', this.stocks);
      });
  }

  getWeeklyPrice(): void {
    this.stkService
      .getMultipleWeeklyPirce()
      .subscribe((results: any) => {
        results.forEach((item: any) => {
          const stock = this.stocks.find((s) => s.symbol == item?.symbol);

          if (stock && stock.active) {
            stock.fifty_two_week_high_price = item?.metric?.['52WeekHigh'];
            stock.fifty_two_week_low_price = item?.metric?.['52WeekLow'];
          }
        });
        // console.log('results', results);
        console.log('stocks', this.stocks);
      });
  }

  toggleStock(stock: Stock) {
    stock.active = !stock.active;
    console.log('stock', stock);
    if (stock.active) {
      this.wsService.subscribe(stock.symbol);
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
}
