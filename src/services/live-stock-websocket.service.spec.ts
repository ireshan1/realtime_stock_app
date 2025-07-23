import { TestBed } from '@angular/core/testing';

import { LiveStockWebsocketService } from './live-stock-websocket.service';

describe('LiveStockWebsocketService', () => {
  let service: LiveStockWebsocketService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LiveStockWebsocketService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
