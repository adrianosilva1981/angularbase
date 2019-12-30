import { CheckoutViewData } from './checkout-view-data';
import { CheckoutPostData } from './checkout-post-data';

// Classe esperada no parameto(Input Property) do componente de checkout
export class CheckoutParameter {
  itens_cart: Array<ItensCart>;  // Lista de itens que estao sendo comprados
  disableMethods?: string[];     // Methodos de pagamento que serão desabilitados EX.: ['billet','hjpay']
  woner: number;
}

export class ItensCart {
  post: CheckoutPostData;   // Objeto que será enviado no post do checkout
  view: CheckoutViewData;   // Objeto que terá as informaçoes necessárias para exibir no componente checkout
}