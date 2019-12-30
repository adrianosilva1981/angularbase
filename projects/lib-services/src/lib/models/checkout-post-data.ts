export class CheckoutPostData {
  id: string;    // ID do item
  qtd: number;   // Quantidade
  hash: string;  // Hash com informações do item como preco, preco virtual, tipo, moeda, ...
  data: object;  // Dados adicionais especificos de cada item
}