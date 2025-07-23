import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StockQuoteService {
  symboles:any = ['AAPL', 'GOOGL', 'MSFT', 'TSLA'];
  constructor(private http: HttpClient) {}

  getQuote(symbol: string): Observable<any> {
  const params = new HttpParams()
    .set('symbol', symbol)
    .set('token', environment.api_key);

  return this.http.get(`${environment.apiUrl}/quote`, { params });
  }

  getMultipleQuotes(): Observable<any> {
    const requests = this.symboles.map((symbol:any) => this.getQuote(symbol));
    return forkJoin(requests);
  }

  getWeeklyPirce(symboles:any): Observable<any> {
  const params = new HttpParams()
    .set('symbol', symboles)
    .set('metric', 'all')
    .set('token', environment.api_key);

  return this.http.get(`${environment.apiUrl}/stock/metric`, { params });
  }

  getMultipleWeeklyPirce(): Observable<any> {
    const requests = this.symboles.map((symbol:any) => this.getWeeklyPirce(symbol));
    return forkJoin(requests);
  }
}
