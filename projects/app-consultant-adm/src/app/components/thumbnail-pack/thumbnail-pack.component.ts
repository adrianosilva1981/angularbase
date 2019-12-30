import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-consultant-adm-thumbnail-pack',
  templateUrl: './thumbnail-pack.component.html',
  styleUrls: ['./thumbnail-pack.component.less']
})
export class ThumbnailPackComponent implements OnInit {

  /*Exemplo de dado do dataPack
  {
    id_supply: '',
    image: 'https://loremflickr.com/320/240?random=20' + Math.random() + 50,
    label: 'alta',
    title: 'Pack de Produtos PetShop',
    currency: 'BRL',
    value_sale: 179.70,
    value_resale: 299.70
  }*/

  @Input() dataPack: any = {};

  public listLabels: any = {
    'alta': 'Em Alta',
    'breve': 'Em Breve',
    'destaque': 'Em Destaque',
    'lancamento': 'Lançamento'
  };

  constructor() { }

  ngOnInit() {
    this.addNewNodes();
  }

  addNewNodes() {
    this.dataPack.label_text = this.listLabels[this.dataPack.label].replace(' ', '<br/>');
    this.dataPack.lucro = Number(this.dataPack.value_resale) - Number(this.dataPack.value_sale);
    if (Number(this.dataPack.value_sale) > 0) {
      this.dataPack.capital = Math.ceil((this.dataPack.lucro * 100) / Number(this.dataPack.value_sale));
    }
  }
}
