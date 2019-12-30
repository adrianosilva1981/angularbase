import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HyperToastsService } from 'lib-services';
import { SharedService } from '@app-admin-back-office/services/shared.service';
import { Router, ActivatedRoute } from '@angular/router';
import * as _ from 'lodash';

@Component({
    selector: 'app-admin-back-office-associate-edit',
    templateUrl: './associate-edit.component.html',
    styleUrls: ['./associate-edit.component.less']
})
export class AssociateEditComponent implements OnInit {

    associateForm: FormGroup;
    status: any;
    associate: any;
    married: any;
    photo_profile = 'https://office.youhub.com.br/assets/img/user-photo-default.png';
    maskCPF = [/\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/, /\d/];
    maskCNPJ = [/\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/];
    maskCel = ['(', /[1-9]/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
    maskDate = [/[0-3]/, /\d/, '/', /[0-1]/, /\d/, '/', /[1-2]/, /\d/, /\d/, /\d/];
    maskCEP = [/\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/];


    isAdmin = false;

    optionsTypeAssociate = [
        {
            label: 'Pessoa Física',
            value: 'P'
        },
        {
            label: 'Pessoa Jurídica',
            value: 'B'
        },
    ];
    optionsGender = [
        {
            label: 'Masculino',
            value: 'M'
        },
        {
            label: 'Feminino',
            value: 'F'
        },
    ];
    optionsMarried = [
        {
            label: 'Sim',
            value: 'S'
        },
        {
            label: 'Não',
            value: 'N'
        },
    ];


    constructor(
        private _sharedService: SharedService,
        private _hyperToastsService: HyperToastsService,
        private _router: Router,
        private _activatedRoute: ActivatedRoute) {

        this._sharedService.getOneAssociate(this._activatedRoute.snapshot.params['id']).subscribe(
            (response) => {
                if (response.return) {
                    this.associate = response.data;
                    this.setForm();
                } else {
                    this._hyperToastsService.addToast('warn', 'Atenção', response.msg);
                }
            },
            (err) => {
                this._hyperToastsService.addToast('error', 'Erro', 'Ocorreu um erro inesperado. Atualize a página e tente novamente');
                this._router.navigate(['/login']);
            }
        );
        let flag = false;
        this._sharedService.getUserPermissions().forEach(element => {
            if (element === 'admin') {
                flag = true;
            }
        });
        this.isAdmin = flag;
        this.associateForm = new FormGroup({
            name: new FormControl(
                { value: null, disabled: false }, Validators.compose([])
            ),
            username: new FormControl(
                { value: null, disabled: false }, Validators.compose([])
            ),
            email: new FormControl(
                { value: null, disabled: false }, Validators.compose([])
            ),
            cnpj_cpf: new FormControl(
                { value: null, disabled: false }, Validators.compose([])
            ),
            ie_rg: new FormControl(
                { value: null, disabled: false }, Validators.compose([])
            ),
            cellphone: new FormControl(
                { value: null, disabled: false }, Validators.compose([])
            ),
            street: new FormControl(
                { value: null, disabled: false }, Validators.compose([])
            ),
            number: new FormControl(
                { value: null, disabled: false }, Validators.compose([])
            ),
            complement: new FormControl(
                { value: null, disabled: false }, Validators.compose([])
            ),
            neighborhood: new FormControl(
                { value: null, disabled: false }, Validators.compose([])
            ),
            city: new FormControl(
                { value: null, disabled: false }, Validators.compose([])
            ),
            state: new FormControl(
                { value: null, disabled: false }, Validators.compose([])
            ),
            zipcode: new FormControl(
                { value: null, disabled: false }, Validators.compose([])
            ),
            status: new FormControl(
                { value: null, disabled: false }, Validators.compose([])
            ),
            birthday: new FormControl(
                { value: null, disabled: false }, Validators.compose([])
            ),
            corporative_name: new FormControl(
                { value: null, disabled: false }, Validators.compose([])
            ),
            created: new FormControl(
                { value: null, disabled: false }, Validators.compose([])
            ),
            first_holder: new FormControl(
                { value: null, disabled: false }, Validators.compose([])
            ),
            first_holder_document: new FormControl(
                { value: null, disabled: false }, Validators.compose([])
            ),
            gender: new FormControl(
                { value: null, disabled: false }, Validators.compose([])
            ),
            married: new FormControl(
                { value: null, disabled: false }, Validators.compose([])
            ),
            phone: new FormControl(
                { value: null, disabled: false }, Validators.compose([])
            ),
            recognition_name: new FormControl(
                { value: null, disabled: false }, Validators.compose([])
            ),
            type: new FormControl(
                { value: null, disabled: false }, Validators.compose([])
            ),
            website: new FormControl(
                { value: null, disabled: false }, Validators.compose([])
            ),
        });
    }

    ngOnInit() {

    }

    setForm() {
        this._sharedService.listEnumStatus().forEach(element => {
            if (element.value == this.associate.status) {
                this.status = element.label;
            }
        });
        this.photo_profile = (this.associate.photo_profile ? this.associate.photo_profile : this.photo_profile);
        this.married = this.associate.married;
        this.associateForm = new FormGroup({
            name: new FormControl(
                { value: this.associate.name, disabled: false }, Validators.compose([])
            ),
            username: new FormControl(
                { value: this.associate.username, disabled: false }, Validators.compose([])
            ),
            email: new FormControl(
                { value: this.associate.email, disabled: false }, Validators.compose([])
            ),
            cnpj_cpf: new FormControl(
                { value: this.associate.cnpj_cpf, disabled: false }, Validators.compose([])
            ),
            ie_rg: new FormControl(
                { value: this.associate.ie_rg, disabled: false }, Validators.compose([])
            ),
            cellphone: new FormControl(
                { value: this.associate.cellphone, disabled: false }, Validators.compose([])
            ),
            street: new FormControl(
                { value: this.associate.street, disabled: false }, Validators.compose([])
            ),
            number: new FormControl(
                { value: this.associate.number, disabled: false }, Validators.compose([])
            ),
            complement: new FormControl(
                { value: this.associate.complement, disabled: false }, Validators.compose([])
            ),
            neighborhood: new FormControl(
                { value: this.associate.neighborhood, disabled: false }, Validators.compose([])
            ),
            city: new FormControl(
                { value: this.associate.city, disabled: false }, Validators.compose([])
            ),
            state: new FormControl(
                { value: this.associate.state, disabled: false }, Validators.compose([])
            ),
            zipcode: new FormControl(
                { value: this.associate.zipcode, disabled: false }, Validators.compose([])
            ),
            status: new FormControl(
                { value: this.status, disabled: false }, Validators.compose([])
            ),
            birthday: new FormControl(
                { value: this.associate.birthday, disabled: false }, Validators.compose([])
            ),
            corporative_name: new FormControl(
                { value: this.associate.corporative_name, disabled: false }, Validators.compose([])
            ),
            created: new FormControl(
                { value: this.associate.created, disabled: false }, Validators.compose([])
            ),
            first_holder: new FormControl(
                { value: this.associate.first_holder, disabled: false }, Validators.compose([])
            ),
            first_holder_document: new FormControl(
                { value: this.associate.first_holder_document, disabled: false }, Validators.compose([])
            ),
            gender: new FormControl(
                { value: this.associate.gender, disabled: false }, Validators.compose([])
            ),
            married: new FormControl(
                { value: this.associate.married, disabled: false }, Validators.compose([])
            ),
            phone: new FormControl(
                { value: this.associate.phone, disabled: false }, Validators.compose([])
            ),
            recognition_name: new FormControl(
                { value: this.associate.recognition_name, disabled: false }, Validators.compose([])
            ),
            type: new FormControl(
                { value: this.associate.type, disabled: false }, Validators.compose([])
            ),
            website: new FormControl(
                { value: this.associate.website, disabled: false }, Validators.compose([])
            ),
        });
    }

    updateUser() {
        let date = null;
        if (this.associateForm.get('birthday').value && this.isAdmin) {
            const dateString = this.associateForm.get('birthday').value as string;
            date = dateString.split('/');
        }
        if (this.associateForm.valid) {
            const data = {
                id: this.associate.id,
                name: this.associateForm.get('name').value,
                email: this.associateForm.get('email').value,
                birthday: this.associateForm.get('birthday').value && this.isAdmin ? (date[1] + '/' + date[0] + '/' + date[2]) : this.associate.birthday,
                cellphone: this.isAdmin ? this.associateForm.get('cellphone').value : this.associate.cellphone,
                cnpj_cpf: this.isAdmin ? this.associateForm.get('cnpj_cpf').value : this.associate.cnpj_cpf,
                city: this.isAdmin ? this.associateForm.get('city').value : this.associate.city,
                complement: this.isAdmin ? this.associateForm.get('complement').value : this.associate.complement,
                corporative_name: this.isAdmin ? this.associateForm.get('corporative_name').value : this.associate.corporative_name,
                first_holder: this.isAdmin ? this.associateForm.get('first_holder').value : this.associate.first_holder,
                first_holder_document: this.isAdmin ? this.associateForm.get('first_holder_document').value : this.associate.first_holder_document,
                gender: this.isAdmin ? this.associateForm.get('gender').value : this.associate.gender,
                ie_rg: this.isAdmin ? this.associateForm.get('ie_rg').value : this.associate.ie_rg,
                married: this.isAdmin ? this.associateForm.get('married').value : this.associate.married,
                neighborhood: this.isAdmin ? this.associateForm.get('neighborhood').value : this.associate.neighborhood,
                number: this.isAdmin ? this.associateForm.get('number').value : this.associate.number,
                phone: this.isAdmin ? this.associateForm.get('phone').value : this.associate.phone,
                recognition_name: this.isAdmin ? this.associateForm.get('recognition_name').value : this.associate.recognition_name,
                state: this.isAdmin ? this.associateForm.get('state').value : this.associate.state,
                street: this.isAdmin ? this.associateForm.get('street').value : this.associate.street,
                type: this.isAdmin ? this.associateForm.get('type').value : this.associate.type,
                website: this.isAdmin ? this.associateForm.get('website').value : this.associate.website,
                zipcode: this.isAdmin ? this.associateForm.get('zipcode').value : this.associate.zipcode,
            };
            this._sharedService.updateUser(data).subscribe(
                (answer: any) => {
                    if (answer.return) {
                        this._hyperToastsService.addToast('success', 'Successo', 'Alterações salvas com sucesso!');
                        this._router.navigate(['/associates/associate-edit']);
                    } else {
                        this._hyperToastsService.addToast('warn', 'Atenção', answer.msg);
                    }
                },
                err => {
                    console.log(err);
                }
            );
        } else {
            this.associateForm.errors.forEach(element => {
                this._hyperToastsService.addToast('error', 'Error', element);
            });
        }
    }

    // onUpload(event, form) {
    //   console.log(event.files);
    //   for (const file of event.files) {
    //     this.myFile.push(file);
    //   }
    //   this.associateForm.get('image').setValue(this.myFile[0]);
    //   console.log(this.myFile[0].objectURL);
    // }
}
