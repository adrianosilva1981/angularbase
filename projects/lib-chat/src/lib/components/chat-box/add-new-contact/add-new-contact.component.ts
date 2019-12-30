import { Component, OnInit, OnDestroy, Inject, trigger, transition, animate, style, state } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ChatBoxService } from './../chat-box.service';
import { Subscription } from 'rxjs/Rx';

// tslint:disable-next-line:max-line-length
const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
declare function unescape(s: string): string;
@Component({
  selector: 'app-add-new-contact',
  templateUrl: './add-new-contact.component.html',
  styleUrls: ['./add-new-contact.component.css'],
  animations: [
    trigger('animationAddRemove', [
      state('in', style({ opacity: '*' })), //estado inicial
      transition('* => void', [ //REMOVE
        style({ opacity: '*' }),
        animate('0.5s ease', style({ opacity: '0' }))
      ]),
      transition('void => false', [//INICIAL
        style({ opacity: '0' }),
        animate('0.5s ease', style({ opacity: '*' }))
      ]),
      transition('void => *', [//ADICIONA
        style({ opacity: '0' }),
        animate('0.5s ease', style({ opacity: '*' }))
      ])
    ])
  ]
})
export class AddNewContactComponent implements OnInit, OnDestroy {

  public listContact: any;
  public user = '';
  public animationInitialized = false;
  public message = 'Olá, gostaria de adicioná-lo como contato.';
  public valid = false;
  public errorMessage = '';

  private refGetUserByUsernameOrMail = new Subscription;
  private refAddContacts = new Subscription;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AddNewContactComponent>,
    private _chatBoxService: ChatBoxService
  ) {
    this.listContact = [];
  }

  ngOnInit() {
  }

  validate() {
    this.errorMessage = '';

    if (this.user.indexOf(' ') !== -1) {
      this.errorMessage = 'O nome de usuário nao pode conter espaços em branco';
    }

    this.valid = this.user.length > 0 && this.user.indexOf(' ') === -1;

    if (this.user.indexOf('@') !== -1 && this.valid) {
      this.valid = EMAIL_REGEX.test(this.user);
    }
  }

  addNewContact() {
    if (this.valid) {
      this.refGetUserByUsernameOrMail = this._chatBoxService.getUserByUsernameOrMail(this.user).subscribe(
        response => {
          if (response.return) {

            const exists = this.listContact.find(aux => aux.id === response.data.id);

            if (!exists) {
              this.listContact.unshift(response.data);
              this.errorMessage = '';
            }

          } else {
            this.errorMessage = response.msg;
          }
        },
        err => {
          this.errorMessage = 'Ocorreu um erro';
        }
      );
      this.user = '';
    }
  }

  confirmAdd() {
    let base64 = '';
    let base64Reverse = '';

    const vetUsers: any = {
      message: this.message,
      users: []
    };

    this.errorMessage = '';
    this.listContact.forEach(element => {
      vetUsers.users.push(element.id);
    });

    base64 = window.btoa(unescape(encodeURI(JSON.stringify(vetUsers))));
    base64 = base64.replace('A', '_');
    base64 = base64.replace('a', '-');
    base64Reverse = base64.split('').reverse().join('');

    this.refAddContacts = this._chatBoxService.addContacts(base64Reverse).subscribe(
      response => {
        if (response.return) {
          this.dialogRef.close('success');
          this.errorMessage = '';
        } else {
          this.errorMessage = response.msg;
        }
      },
      err => {
        this.errorMessage = 'Ocorreu um erro';
      }
    );
  }

  deleteContact(idx) {
    this.listContact.splice(idx, 1);
  }

  ngOnDestroy() {
    this.refGetUserByUsernameOrMail.unsubscribe();
  }
}
