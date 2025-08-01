import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LiveStockComponent } from "../live-stock/live-stock.component";


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LiveStockComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'realtime_stock_app';
}
