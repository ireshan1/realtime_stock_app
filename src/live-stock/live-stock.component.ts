import { Component, OnInit } from '@angular/core';
import { LiveStockWebsocketService } from '../services/live-stock-websocket.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Stock } from '../model/stock.model';
import { FormsModule } from '@angular/forms';
import { StockQuoteService } from '../services/stock-quote.service';

@Component({
  selector: 'app-live-stock',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './live-stock.component.html',
  styleUrl: './live-stock.component.scss',
})
export class LiveStockComponent implements OnInit {
  private subscription!: Subscription;
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
    private webSocketService: LiveStockWebsocketService,
    private stkService: StockQuoteService
  ) {}

  ngOnInit() {
    // Subscribe to multiple stock symbols
    this.webSocketService.subscribe('AAPL');
    this.webSocketService.subscribe('GOOGL');
    this.webSocketService.subscribe('MSFT');
    this.webSocketService.subscribe('TSLA');

    this.getLiveData(); // Listen for incoming data
    this.getDailyPrice(); //Get Daily Price
    this.getWeeklyPrice(); //Get 52 Weeks Price
  }

  // Listen for incoming data
  getLiveData(): void {
    this.subscription = this.webSocketService
      .getMessages()
      .subscribe((data) => {
        // console.log('Live stock update:', data.data);
        data?.data?.forEach((item: any) => {
          const stock = this.stocks.find((s) => s.symbol === item.s);
          if (stock && stock.active) {
            stock.previousPrice = stock.price;
            stock.price = item.p;
          }
        });
      });
  }

  //Get Daily Price
  getDailyPrice(): void {
    this.stkService.getMultipleQuotes().subscribe((results: any[]) => {
      results.forEach((item, index) => {
        if (this.stocks[index]) {
          this.stocks[index].daily_high_price = item?.h;
          this.stocks[index].daily_low_price = item?.l;
        }
      });
    });
  }

  //Get 52 Weeks Price
  getWeeklyPrice(): void {
    this.stkService.getMultipleWeeklyPrices().subscribe((results: any) => {
      results.forEach((item: any) => {
        const stock = this.stocks.find((s) => s.symbol == item?.symbol);

        if (stock && stock.active) {
          stock.fifty_two_week_high_price = item?.metric?.['52WeekHigh'];
          stock.fifty_two_week_low_price = item?.metric?.['52WeekLow'];
        }
      });
    });
  }

  //Swicth OFF and Switch ON specific stock
  toggleStock(stock: Stock): void {
    stock.active = !stock.active;
    if (stock.active) {
      this.webSocketService.subscribe(stock.symbol);
    } else {
      this.webSocketService.unsubscribe(stock.symbol);
    }
  }

  getCardClass(stock: Stock): string {
    if (!stock.active) return 'inactive';

    const price = Number(stock.price.toFixed(2));
    const previousPrice = Number(stock.previousPrice.toFixed(2));
    const priceDiff = price - previousPrice;
    if (priceDiff == 0) return 'up';
    if (priceDiff > 0) return 'up';
    if (priceDiff < 0) return 'down';
    return '';
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe(); // Clean up subscription
  }
}
