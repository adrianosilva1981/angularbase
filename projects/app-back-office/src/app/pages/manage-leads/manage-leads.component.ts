import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { EditLeadDialogComponent } from '@app-back-office/components/modals/edit-lead/edit-lead.component';
import { HyperToastsService } from 'lib-services';
import swal from 'sweetalert2';
import { SharedService } from '@app-back-office/services/shared.service';

@Component({
  selector: 'app-back-office-manage-leads',
  templateUrl: './manage-leads.component.html',
  styleUrls: ['./manage-leads.component.less']
})
export class ManageLeadsContainerComponent implements OnInit {

  public companyUsername = '';
  public contacts = [];
  public deleting = false;

  constructor(
    private router: Router,
    private _sharedService: SharedService,
    private _hyperToastsService: HyperToastsService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {

    this.getMyLeads();
  }

  goToRoute(path) {
    this.router.navigate(['office' + path]);
  }

  getMyLeads() {
    this._sharedService.getLeads('').subscribe(
      response => {
        if (response.return) {
          this.contacts = response.data;
          // console.log(this.contacts);
        } else {
          this._hyperToastsService.addToast('warn', 'Atenção', response.msg);
        }
      },
      err => {
        this._hyperToastsService.addToast('error', 'Erro', 'Ocorreu um erro inesperado. Atualize a página e tente novamente');
      }
    );
  }

  removeLead(contact) {

    swal({
      title: 'Apagar Contato!',
      text: 'Você quer apagar esse contato?',
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
        this.deleting = true;
        this._sharedService.removeLead(contact.id).subscribe(
          response => {
            if (response.return) {
              this.deleting = false;
              const pos = this.contacts.findIndex(x => x.id === contact.id); // procura a posicao no array
              if (pos !== -1) {
                this.contacts.splice(pos, 1); // retira do array
              }
              this._hyperToastsService.addToast('success', 'Sucesso', response.msg);
            } else {
              this._hyperToastsService.addToast('warn', 'Atenção', response.msg);
              this.deleting = false;
            }
          },
          err => {
            this._hyperToastsService.addToast('error', 'Erro', 'Ocorreu um erro inesperado. Atualize a página e tente novamente');
            this.deleting = false;
          }
        );
      }
    });
  }

  editLead(contact) {
    const dialogRef = this.dialog.open(EditLeadDialogComponent, { data: contact });
    this.getMyLeads();
    dialogRef.afterClosed().subscribe(
      result => {
        this.getMyLeads();
      }
    );
  }

}
