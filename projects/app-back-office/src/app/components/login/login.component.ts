import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';

import { HyperToastsService, HyperCookieService } from 'lib-services';
import { SharedService } from '@app-back-office/services/shared.service';
import { environment } from '@env/app-back-office';
import { MatDialog } from '@angular/material';
import { InfoRescueComponent } from '@app-back-office/components/modals/info-rescue/info-rescue.component';
import { QuizWellcomeComponent } from '../modals/quiz-wellcome/quiz-wellcome.component';
import { InfoDebitsComponent } from '../modals/info-debits/info-debits.component';

const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

@Component({
  selector: 'app-back-office-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']
})

export class LoginComponent implements OnInit {

  @Output() preRegister = new EventEmitter();
  @Output() forgotPassword = new EventEmitter();

  public loginFormControl: FormGroup;
  public email = '';
  public password = '';
  public logon = false;

  public enableSend = false;
  public siteKey = environment.captcha_site_key;
  public secretKey = environment.captcha_secret_key;

  constructor(
    private _fb: FormBuilder,
    private _sharedService: SharedService,
    private _hyperCookieService: HyperCookieService,
    private _hyperToastsService: HyperToastsService,
    private _router: Router,
    private _dialog: MatDialog
  ) {

    this.loginFormControl = this._fb.group({
      emailFormControl: new FormControl('',
        [
          Validators.required,
          Validators.pattern(EMAIL_REGEX)
        ]
      ),
      passwordFormControl: new FormControl('',
        [
          Validators.required,
          Validators.minLength(6)
        ]
      )
    });
  }

  ngOnInit() {
  }

  login() {
    this.logon = true;
    // console.log(this.logon);
    this._sharedService.login('office', this.email, this.password).subscribe(
      response => {
        if (response.return) {
          const loginData = response.data;
          loginData.JWT = response.JWT;

          this.logon = false;
          this._hyperCookieService.setCookie_GENERIC(loginData, environment.defaultCookieName);

          if (response.data_extra) {
            const loginDataExtra = response.data_extra;
            loginDataExtra.JWT = response.JWT;
            this._hyperCookieService.setCookie_GENERIC(loginDataExtra, environment.youhubCookieName);
          }
          this._router.navigate(['office/']);

          // mensagem ao logar
          const dialogRef = this._dialog.open(InfoRescueComponent, {
            panelClass: 'custom-dialog-container',
            data: {},
          });

          dialogRef.afterClosed().subscribe(
            result => {
              this.openQuiz(loginData);
            }
          );

          // this._sharedService.getNotificationsDebits().subscribe(
          //   resultD => {
          //     if (resultD.return) {

          //       for (let i = 0; i < resultD.data.length; i++) {
          //         resultD.data[i].realease_date = new Date(resultD.data[i].realease_date.replace(' ', 'T')).toLocaleDateString();
          //       }

          //       dialogRef.afterClosed().subscribe(
          //         result => {
          //           // Verifica se o usuario já respondeu o questionário
          //           const dialogRefs = this._dialog.open(InfoDebitsComponent, {
          //             panelClass: 'custom-dialog-container',
          //             data: { resultD },
          //           });
          //           dialogRefs.afterClosed().subscribe(
          //             result => {
          //               this.openQuiz(loginData);
          //             }
          //           );
          //         }
          //       );
          //     } else {
          //       dialogRef.afterClosed().subscribe(
          //         result => {
          //           this.openQuiz(loginData);
          //         }
          //       );
          //     }
          //   },
          //   err => {
          //     dialogRef.afterClosed().subscribe(
          //       result => {
          //         this.openQuiz(loginData);
          //       }
          //     );
          //   });

        } else {
          this.logon = false;
          this._hyperToastsService.addToast('warn', 'Atenção', response.msg);
        }
      },
      err => {
        this.logon = false;
        this._hyperToastsService.addToast('error', 'Erro', 'Ocorreu um erro inesperado. Atualize a página e tente novamente');
        this._router.navigate(['office/login']);
      }
    );
  }

  openQuiz(loginData) {
    // Verifica se o usuario já respondeu o questionário
    if (loginData.status === 'A') {
      this._sharedService.completedQuestionnaire(1, loginData.id).subscribe(
        result => {
          if (result.return) {
            this._dialog.open(QuizWellcomeComponent, {
              panelClass: 'custom-dialog-container',
              data: {},
            });
          } else {

          }
        },
        err => {

        }
      );
    }
  }

  register() {
    this.preRegister.emit(true);
  }

  forgot() {
    this.forgotPassword.emit(true);
  }

  showResponse(evt) {
    const obj = {
      secret: this.secretKey,
      response: evt.response
    };

    if (evt.response) {
      this._sharedService.reCaptcha(obj).subscribe(
        (response: any) => {
          if (response.return) {
            this.enableSend = response.data.success;
          } else {
            this.enableSend = false;
          }
        },
        err => {
          this.enableSend = false;
        }
      );
    }
  }

}
