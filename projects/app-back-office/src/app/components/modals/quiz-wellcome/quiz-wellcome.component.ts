import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { SharedService } from '@app-back-office/services/shared.service';
import { HyperToastsService } from 'lib-services';

@Component({
  selector: 'app-back-office-quiz-wellcome',
  templateUrl: './quiz-wellcome.component.html',
  styleUrls: ['./quiz-wellcome.component.less']
})
export class QuizWellcomeComponent implements OnInit {

  public userObj: any;
  public youhubControl = 1;
  public questionnaireId = 1;
  public questionnaireType = 'youhub';

  public start = false;

  constructor(
    private _sharedService: SharedService,
    private _hyperToastsService: HyperToastsService,
    public dialogRef: MatDialogRef<QuizWellcomeComponent>
  ) {
    this._sharedService.getinfoResseler().subscribe(response1 => {
      if (response1.return) {
        this.userObj = response1.data;
      } else {
        this._hyperToastsService.addToast('warn', 'Atenção', response1.msg);
      }
    },
      err => {
        this._hyperToastsService.addToast('error', 'Erro', 'Ocorreu um erro inesperado. Atualize a página e tente novamente');
      });
  }

  ngOnInit() {
  }

  onClose() {
    this.dialogRef.close();
  }

  showMessage(event) {
    this._hyperToastsService.addToast(event.type, event.title, event.message);
  }
}
