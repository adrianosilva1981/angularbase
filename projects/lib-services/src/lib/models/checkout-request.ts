import { CheckoutPostData } from './checkout-post-data';

// Objeto que será enviado no momento do post do checkout
export class CheckoutRequest {
  method_data: object;            // Dados do metodo selecionado EX.: se method=credit_card deve passar os dados de cartao de creditos aqui
  post_data: CheckoutPostData[];  // Lista de itens que estao sendo comprados
}