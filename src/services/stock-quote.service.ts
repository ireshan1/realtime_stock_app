import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import { environment } from '../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class StockQuoteService {
  private symbols: string[] = ['AAPL', 'GOOGL', 'MSFT', 'TSLA'];
  constructor(private http: HttpClient) {}

  // Get current quote data for a single stock
  getQuote(symbol: string): Observable<any> {
    const params = new HttpParams()
      .set('symbol', symbol)
      .set('token', environment.api_key);

    return this.http.get<any>(`${environment.apiUrl}/quote`, { params });
  }

  // Get multiple quote data
  getMultipleQuotes(): Observable<any[]> {
    const requests = this.symbols.map(symbol => this.getQuote(symbol));
    return forkJoin(requests);
  }

  // Get weekly price metrics (e.g., 52-week high/low)
  getWeeklyPrice(symbol: string): Observable<any> {
    const params = new HttpParams()
      .set('symbol', symbol)
      .set('metric', 'all')
      .set('token', environment.api_key);

    return this.http.get<any>(`${environment.apiUrl}/stock/metric`, { params });
  }

  // Get multiple weekly price metrics
  getMultipleWeeklyPrices(): Observable<any[]> {
    const requests = this.symbols.map(symbol => this.getWeeklyPrice(symbol));
    return forkJoin(requests);
  }

}
