# BREADCRUMBS

- Adicionar o componente de breadCrumb no layout acima do router-outlet
```html
<lib-navbar-nav-top></lib-navbar-nav-top>
<lib-components-breadcrumb></lib-components-breadcrumb>
<router-outlet></router-outlet>
```

- Na tela emita o evento com os dados para o breadcrumb

```javascript
BroadcastEventService.event('onBreadCrumb').emit(
	[
		{ 'text': 'Minha Conta', 'router': '/my-account' },
		{ 'text': 'Pedidos da Loja', 'router': '' }
	]
);
```

- DICA: Criar um metodo no serviço compartilhado e chamar este serviço no OnInit e nao no contructor

```javascript
//Serviço
addBreadCrumb(obj) {
	BroadcastEventService.event('onBreadCrumb').emit(obj);
}

// Na tela que ira utilizar o BreadCrumb
 ngOnInit() {
    this._sharedService.addBreadCrumb(
      [
        { 'text': 'Minha Conta', 'router': '' }
      ]
    );
  }
```

# CHECKOUT

- Conteudo da hash do checkout
```javascript
{
	"plot":"1",
	"price":"12.00",
	"price_virtual":"32.62",
	"discount": "0.00",
	"discount_virtual": "0.00",
	"coin": "BRL",
	"type":"PRODUCT"
}
```

- Exemplos de `method_data`
```javascript
"itens_cart": [
		{
		    "post":{
		        "id": "id product",
                "qtd": 2,
                "hash": "RG55RGGH55RGHGHH5554HGGF5",
                "data": {}
		    },
		    "view":{
		      "plot":1,
	          "price": 10.56,
              "price_virtual": 4.00,
              "discount": "0.00",
	          "discount_virtual": "0.00",
              "coin": "BRL",
              "type": "product"
		    }
		},
		{
		    "post":{
		        "id": "id service",
                "qtd": 1,
                "hash": "RG55RGGH55RGHGHH5554HGGF5",
                "data": {}
		    },
		    "view":{
		      "plot":1,
	          "price": 10.56,
              "price_virtual": 0.00,
              "discount": "0.00",
	          "discount_virtual": "0.00",
              "coin": "BRL",
              "type": "service"
		    }
		},
		{
		    "post":{
		        "id": null,
                "qtd": 1,
                "hash": "RG55RGGH55RGHGHH5554HGGF5",
                "data": {
                    "id_delivery_address": "id address"
                }
		    },
		    "view":{
		      "plot":1,
	          "price": 11.91,
              "price_virtual": 0.00,
              "discount": "0.00",
	          "discount_virtual": "0.00",
              "coin": "BRL",
              "type": "shipping"
		    }
		},
		{
		    "post":{
		        "id": "id plano consultor",
                "qtd": 1,
                "hash": "RG55RGGH55RGHGHH5554HGGF5",
                "data": {}
		    },
		    "view":{
		      "plot":1,
	          "price": 39.90,
              "price_virtual": 0.00,
              "discount": "0.00",
	          "discount_virtual": "0.00",
              "coin": "BRL",
              "type": "be-consultant"
		    }
		},
		{
		    "post":{
		        "id": "id serviço",
                "qtd": 1,
                "hash": "RG55RGGH55RGHGHH5554HGGF5",
                "data": {
                    "consultant":"id consultor"
                }
		    },
		    "view":{
		      "plot":1,
	          "price": 20.00,
              "price_virtual": 0.00,
              "discount": "0.00",
	          "discount_virtual": "0.00",
              "coin": "BRL",
              "type": "consultant-service"
		    }
		},
		{
		    "post":{
		        "id": null,
                "qtd": 1,
                "hash": "RG55RGGH55RGHGHH5554HGGF5",
                "data": {
                    "credit_value": 120.50
                }
		    },
		    "view":{
		      "plot":1,
	          "price": 120.50,
              "price_virtual": 0.00,
              "discount": "0.00",
	          "discount_virtual": "0.00",
              "coin": "BRL",
              "type": "insert-credit"
		    }
		}
	]
```

- Cartão de Credito
```javascript
"method_data": {
	"payment_method":'credit_card',
	"plots": 2,
	"card_name":"Fabio Junior Moreira",
	"card_number":"4444444444444448",
	"card_month":"06",
	"card_year":"2020",
	"card_cvv":"123"
}
```

 - Boleto
```javascript
"method_data": {
	"payment_method":'billet',
	"plots": 1,
	"document":"08546988754"
}
```

 - Creditos da plataforma
```javascript
"method_data": {
	"payment_method":'hjpay',
	"plots": 1
}
```

- Exemplo de um post de checkout
```javascript
{
	"method_data": {
		"payment_method":'credit_card',
		"plots": 2,
	    "name":"Fabio Junior Moreira",
	    "number":"4444444444444448",
	    "month":"06",
	    "year":"2020",
	    "cvv":"123",
	},	
	"post_data": [
		{
			"id": "ID DO PRODUTO",
			"qtd": 2,
			"hash": "HASH DO PRODUTO",
			"data": {}
		},
		{
			"id": "ID SO SERVIÇO",
			"qtd": 3,
			"hash": "HASH DO SERVICO",
			"data": {}
		},
		{
			"id": null,
			"qtd": 1,
			"hash": "HASH DO FRETE",
			"data": {
				"address": "ID DO ENDEREÇO"
			}
		},
		{
			"id": "ID DO PLANO",
			"qtd": 1,
			"hash": "HASH DO PLANO",
			"data": {}
		},
		{
			"id": "ID DO PLANO",
			"qtd": 1,
			"hash": "HASH DO CONSULTOR",
			"data": {
				"consultant": "ID OD CONSULTOR"
			}
		}
	]
}
```

# NOT FOUND

- Página padrão para o erro 404. Para utiliza-lo basta chamar em seu arquivo de rotas

```javascript
import { NotFoundComponent } from 'lib-components';
...

{
	path: '**',
	component: NotFoundComponent
}
```

# PHOTO GALLERY

- Componentes para exibição de uma lista de photos

```xml
<lib-components-photo-gallery [listPhotos]="listPhotos"></lib-components-photo-gallery>
```

# PROGRESS INTERCEPTOR

- Componente criado para interceptar todas as requisições http. Uma barra de progresso aparece e após 3 segundos a tela é bloqueada e passados mais 30 segundos a tela desbloqueia automaticamente para que o usuário nao fique sem acesso

```xml
<lib-components-progress-interceptor></lib-components-progress-interceptor>
```

# SELECT-INPUT-SEARCH

- Componente para adicionar um search como queryparam

```xml
<lib-components-select-input-search [objOptions]="objOptonsSearch"></lib-components-select-input-search>
```

```javascript
this.objOptonsSearch = {
	id_default: 1,
	config: [
	{
		label: 'Buscar Produtos',
		value: { id: 1, color: '', type: '', redirect: '', placeholder: '' }
	},
	{
		label: 'Buscar Servicos',
		value: { id: 2, background: '', color: '', type: '', redirect: '', placeholder: '' }
	},
	{
		label: 'Buscar Qualquer coisa',
		value: { id: 2, background: 'green', type: 'link', redirect: 'http://google.com.br', placeholder: 'Buscar serviços' }
	}
	]
};
```