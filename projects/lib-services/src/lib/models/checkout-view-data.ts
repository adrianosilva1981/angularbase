export class CheckoutViewData {
  plot: number;                // Parcelado em ate:
  price: number;              // Preço normal
  price_virtual: number;      // Preço em HyperCoins
  discount: number;           // Desconto normal
  discount_virtual: number;   // Desconto Virtual
  coin: string;               // Moeda
  type: string;               // Tipo EX.: product | service | plan | shipping | insert_credit | ...
}