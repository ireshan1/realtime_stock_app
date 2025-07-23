import { TestBed } from '@angular/core/testing';

import { StockQuoteService } from './stock-quote.service';

describe('StockQuoteService', () => {
  let service: StockQuoteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StockQuoteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
