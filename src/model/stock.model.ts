export interface Stock {
  symbol: string;
  name: string;
  price: number;
  previousPrice: number;
  daily_high_price:number;
  daily_low_price:number;
  fifty_two_week_high_price :number;
  fifty_two_week_low_price :number;
  active: boolean;
}