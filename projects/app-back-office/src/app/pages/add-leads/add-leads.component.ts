import { Component, OnInit } from '@angular/core';
import { Contact } from '@app-back-office/models/contact';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HyperToastsService } from 'lib-services';
import { SharedService } from '@app-back-office/services/shared.service';

// tslint:disable-next-line:max-line-length
// const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

@Component({
  selector: 'app-back-office-add-leads',
  templateUrl: './add-leads.component.html',
  styleUrls: ['./add-leads.component.less']
})
export class AddLeadsContainerComponent implements OnInit {

  public newContacts = [];
  public objContato: Contact;
  public saving = false;

  public CELLPHONEMASK = ['(', /[1-9]/, /[1-9]/, ')', ' ', /9/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];

  public CELLPHONE_REGEX: RegExp = /^(?:\()[0-9]{2}(?:\))\s?9[0-9]{4}(?:-)[0-9]{4}$/;
  public EMAIL_REGEX: RegExp = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

  newContactForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private _sharedService: SharedService,
    private _hyperToastsService: HyperToastsService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.newContactForm = this.fb.group(
      {
        name: ['', [Validators.required, Validators.minLength(6)]],
        email: ['', [Validators.required, Validators.pattern(this.EMAIL_REGEX)]],
        cellphone: ['', [Validators.required, Validators.pattern(this.CELLPHONE_REGEX)]]
      }
    );
  }

  ngOnInit() { }

  addContact() {
    this.newContacts.push({
      name: this.newContactForm.controls.name.value,
      email: this.newContactForm.controls.email.value,
      cellphone: this.newContactForm.controls.cellphone.value
    });
    this.newContactForm.reset();
    // console.log(this.newContactForm.valid);
  }

  removeNewContact(data) {
    this.newContacts.splice(this.newContacts.indexOf(data), 1);
  }

  changeListener(files: FileList) {

    if (files && files.length > 0) {
      const file: File = files.item(0);
      const reader: FileReader = new FileReader();
      reader.readAsText(file);
      reader.onload = (e) => {
        let csv: any = reader.result;
        const re = /"/gi; // regex aspas
        csv = csv.replace(re, ''); // retira aspas
        // console.log(csv);

        this.newContacts = [];
        const matriz = csv.split('\n');
        const cabecalho = matriz[0].split(',');
        const tamanho = matriz.length;
        delete matriz[0]; // retira cabeçalho
        if (matriz[tamanho - 1] === '') {
          delete matriz[tamanho - 1]; // retira ultima linha
        }

        let email_position: number;
        if (cabecalho.indexOf('E-mail Address') > 0) {
          email_position = cabecalho.indexOf('E-mail Address');
        } else if (cabecalho.indexOf('E-mail 1 - Value') > 0) {
          email_position = cabecalho.indexOf('E-mail 1 - Value');
        } else {
          email_position = cabecalho.indexOf('Email');
        }

        let mobile_position: number;
        if (cabecalho.indexOf('Mobile Phone') > 0) {
          mobile_position = cabecalho.indexOf('Mobile Phone');
        } else if (cabecalho.indexOf('Phone 1 - Value') > 0) {
          mobile_position = cabecalho.indexOf('Phone 1 - Value');
        } else {
          mobile_position = cabecalho.indexOf('Mobile');
        }

        // console.log('mobile_position: ' + mobile_position);
        // console.log('email_position: ' + email_position);

        let nameok: boolean;

        matriz.forEach(element => {
          const linha = element.split(',');
          let string = '';
          this.objContato = new Contact();
          nameok = false;

          if ((linha[email_position] !== undefined) && (linha[mobile_position] !== undefined)) {
            // email ou celular
            if (linha[0] !== '' || linha[1] !== '' || linha[2] !== '') {
              if (linha[0] !== '') {
                string += linha[0];
              }
              if (linha[1] !== '') {
                string += ' ' + linha[1];
              }
              if (linha[2] !== '') {
                string += ' ' + linha[2];
              }
            }
            string = string.replace('  ', '');
            this.objContato.name = this.ltrim(string);

            if (linha[email_position].length > 0 && linha[email_position] !== '') {
              this.objContato.email = linha[email_position];
              nameok = true;
            }

            if (linha[mobile_position].length > 0 && linha[mobile_position] !== '') {
              this.objContato.cellphone = linha[mobile_position];
              nameok = true;
            }

            if (this.objContato.name === '') {
              nameok = false;
            }

          }
          if (nameok) {
            this.newContacts.push(this.objContato);
          }
        });

        // console.log(this.newContacts);
      };
    }
  }

  ltrim(str) {
    return str.replace(/^\s+/, '');
  }

  saveContacts() {
    this.saving = true;
    this._sharedService.addLeads({ leads: this.newContacts }).subscribe(
      response => {
        if (response.return) {
          this.saving = false;
          this._hyperToastsService.addToast('success', 'Sucesso', response.msg);
          this.newContacts = [];
          this.goToRoute('/contacts');
        } else {
          this.saving = false;
          this._hyperToastsService.addToast('warn', 'Atenção', response.msg);
        }
      },
      err => {
        this.saving = false;
        this._hyperToastsService.addToast('error', 'Erro', 'Ocorreu um erro inesperado. Atualize a página e tente novamente');
      }
    );
  }


  goToRoute(path) {
    this.router.navigate(['office' + path]);
  }
}
