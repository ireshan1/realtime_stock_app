import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import { environment } from '../environments/environment';


export interface Quote {
  c: number; // current price
  h: number; // high price (daily)
  l: number; // low price (daily)
  pc: number; // previous close
  t: number; // timestamp
}

export interface MetricResponse {
  metric: {
    '52WeekHigh': number;
    '52WeekLow': number;
    // Add other metrics if needed
  };
  symbol: string;
}
@Injectable({
  providedIn: 'root'
})
export class StockQuoteService {
  private symbols: string[] = ['AAPL', 'GOOGL', 'MSFT', 'TSLA'];
  constructor(private http: HttpClient) {}

  // Get current quote data for a single stock
  getQuote(symbol: string): Observable<Quote> {
    const params = new HttpParams()
      .set('symbol', symbol)
      .set('token', environment.api_key);

    return this.http.get<Quote>(`${environment.apiUrl}/quote`, { params });
  }

  // Get multiple quote data
  getMultipleQuotes(): Observable<Quote[]> {
    const requests = this.symbols.map(symbol => this.getQuote(symbol));
    return forkJoin(requests);
  }

  // Get weekly price metrics (e.g., 52-week high/low)
  getWeeklyPrice(symbol: string): Observable<MetricResponse> {
    const params = new HttpParams()
      .set('symbol', symbol)
      .set('metric', 'all')
      .set('token', environment.api_key);

    return this.http.get<MetricResponse>(`${environment.apiUrl}/stock/metric`, { params });
  }

  // Get multiple weekly price metrics
  getMultipleWeeklyPrices(): Observable<MetricResponse[]> {
    const requests = this.symbols.map(symbol => this.getWeeklyPrice(symbol));
    return forkJoin(requests);
  }

}
