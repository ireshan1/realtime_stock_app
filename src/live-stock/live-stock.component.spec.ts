import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveStockComponent } from './live-stock.component';

describe('LiveStockComponent', () => {
  let component: LiveStockComponent;
  let fixture: ComponentFixture<LiveStockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LiveStockComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LiveStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
