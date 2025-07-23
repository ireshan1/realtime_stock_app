import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StockQuoteService {

  private apiKey = 'd205nnhr01qmbi8r7qogd205nnhr01qmbi8r7qp0';
  private baseUrl = 'https://finnhub.io/api/v1';

  constructor(private http: HttpClient) {}

  getQuote(symbol: string): Observable<any> {
  const params = new HttpParams()
    .set('symbol', symbol)
    .set('token', this.apiKey);

  return this.http.get(`${this.baseUrl}/quote`, { params });
  }

  getMultipleQuotes(symbols: string[]): Observable<any[]> {
    const requests = symbols.map(symbol => this.getQuote(symbol));
    return forkJoin(requests);
  }
}
