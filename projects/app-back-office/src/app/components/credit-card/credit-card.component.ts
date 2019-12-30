import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import swal from 'sweetalert2';

@Component({
  selector: 'app-back-office-credit-card',
  templateUrl: './credit-card.component.html',
  styleUrls: ['./credit-card.component.less']
})
export class CreditCardComponent implements OnInit {

  @Input() card: any;
  @Input() position: any;
  @Output() objCard: EventEmitter<any> = new EventEmitter;
  @Output() deleteId: EventEmitter<any> = new EventEmitter;

  constructor() { }

  ngOnInit() { }


  selectCard(id) {

    // console.log(id);
    // console.log(this.cardForm.controls.controlCvv.value);
    swal({
      title: 'Pagar!',
      text: 'Você tem certeza que quer pagar com o cartao final: ' + this.card.last_numbers,
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sim',
      cancelButtonText: 'Não',
      confirmButtonClass: 'btn green spacing',
      cancelButtonClass: 'btn red spacing',
      buttonsStyling: false,
      reverseButtons: true
    }).then((result) => {
      if (result.value === true) {
        const obj = {
          id: id
        };
        this.objCard.emit(obj);
      }
    });

  }

  removeCard(id) {
    swal({
      title: 'Remover!',
      text: 'Você tem certeza que deseja remover esse cartão da sua lista de cartões',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sim',
      cancelButtonText: 'Não',
      confirmButtonClass: 'btn green spacing',
      cancelButtonClass: 'btn red spacing',
      buttonsStyling: false,
      reverseButtons: true
    }).then((result) => {
      if (result.value === true) {
        const obj = {
          id: id,
          position: this.position
        };
        this.deleteId.emit(obj);
      }
    });
  }

}
