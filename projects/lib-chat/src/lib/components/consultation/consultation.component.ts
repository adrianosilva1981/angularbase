import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Subscription } from 'rxjs/Rx';

import { NodeService } from './../node.service';
import { ToastrService } from 'ngx-toastr';
import { ConsultationService } from './consultation.service';
import { ChatboxConsultationService } from './../chatbox-consultation.service';

import { CallEvalueteComponent } from './modals/call-evaluete/call-evaluete.component';
import { CallDiscountComponent } from './modals/call-discount/call-discount.component';
import { SenderCallComponent } from './modals/sender-call/sender-call.component';
import { SenderDisconnectComponent } from './modals/sender-disconnect/sender-disconnect.component';
import { SenderIAmBusyComponent } from './modals/sender-i-am-busy/sender-i-am-busy.component';
import { SenderHeIsBusyComponent } from './modals/sender-he-is-busy/sender-he-is-busy.component';
import { SenderOfflineComponent } from './modals/sender-offline/sender-offline.component';
import { SenderMissedComponent } from './modals/sender-missed/sender-missed.component';
import { SenderRejectComponent } from './modals/sender-reject/sender-reject.component';
import { RunningComponent } from './modals/running/running.component';
import { ReceiverCallComponent } from './modals/receiver-call/receiver-call.component';
import { ReceiverCallAnotherSessionComponent } from './modals/receiver-call-another-session/receiver-call-another-session.component';
import { ReceiverCancelComponent } from './modals/receiver-cancel/receiver-cancel.component';
import { ReceiverDisconnectComponent } from './modals/receiver-disconnect/receiver-disconnect.component';
import { ReceiverMissedComponent } from './modals/receiver-missed/receiver-missed.component';
import { ReceiverOfflineComponent } from './modals/receiver-offline/receiver-offline.component';

@Component({
  selector: 'consultation',
  templateUrl: './consultation.component.html',
  styleUrls: ['./consultation.component.css']
})
export class ConsultationComponent implements OnInit, OnDestroy {

  private refMountJson = new Subscription;
  private refGetUsers = new Subscription;
  private refConfirmInitConsultation = new Subscription;
  private refServers = new Subscription;
  private refFinishConsultation = new Subscription;

  private myObjectUser: any;
  private objConsulteAux: any;
  private idTransaction: any;

  constructor(
    public _mdDialog: MatDialog,
    private _nodeService: NodeService,
    private _consultationService: ConsultationService,
    private _toastrService: ToastrService,
    private _chatboxConsultationService: ChatboxConsultationService,
  ) { }

  ngOnInit() {
    const _self = this;

    _self.refGetUsers = _self._nodeService.getUserChat().subscribe(
      response => {
        if (response.return) {
          this.myObjectUser = response.data;
        } else {
          _self._toastrService.warning(response.msg, 'Atenção');
        }
      },
      err => { _self._toastrService.error('Ocorreu um erro. Atualize a página e tente novamente', 'Erro'); }
    );
    this.startEventListenerConsultation();


    // *****************************************LISTENERS NODE SERVICE*****************************************

    this._nodeService.socketNode.on('initConsultation', function (data) {
      console.log('initConsultation');

      if (_self.myObjectUser.id !== data.user_sender.id) {
        _self.openModal(ReceiverCallComponent, data, 'ReceiverCallComponent');
      }
    });
    this._nodeService.socketNode.on('cancelInitConsultation', function (data) {
      console.log('cancelInitConsultation');

      if (_self.myObjectUser.id !== data.user_sender.id) {
        _self.openModal(ReceiverCancelComponent, data, 'ReceiverCancelComponent');
      }
    });
    this._nodeService.socketNode.on('timeOutConsultation', function (data) {
      console.log('timeOutConsultation');
      if (_self.myObjectUser.id === data.user_sender.id) {
        _self.openModal(SenderMissedComponent, data, 'SenderMissedComponent');
      } else {
        _self.openModal(ReceiverMissedComponent, data, 'ReceiverMissedComponent');
      }
    });
    this._nodeService.socketNode.on('refuseInitConsultation', function (data) {
      console.log('refuseInitConsultation', data);
      if (_self.myObjectUser.id === data.user_sender.id) {
        _self.openModal(SenderRejectComponent, data, 'SenderRejectComponent');
      } else {
        _self._mdDialog.closeAll();
      }
    });
    this._nodeService.socketNode.on('receiverBusy', function (data) {
      console.log('receiverBusy');
      _self.openModal(SenderHeIsBusyComponent, _self.objConsulteAux, 'SenderHeIsBusyComponent');
    });
    this._nodeService.socketNode.on('senderBusy', function (data) {
      console.log('senderBusy');
      _self.openModal(SenderIAmBusyComponent, _self.objConsulteAux, 'SenderIAmBusyComponent');
    });
    this._nodeService.socketNode.on('disconnnect', function (data) {
      console.log('disconnnect');

      if (data.id_transaction === undefined) {
        if (_self.myObjectUser.id === data.user_sender.id) {
          _self.openModal(SenderDisconnectComponent, data, 'SenderDisconnectComponent');
        } else {
          _self.openModal(ReceiverDisconnectComponent, data, 'ReceiverDisconnectComponent');
        }
      }
    });
    this._nodeService.socketNode.on('receiverDisconnected', function (data) {
      console.log('receiverDisconnected');
      _self.openModal(SenderOfflineComponent, _self.objConsulteAux, 'SenderOfflineComponent');
    });
    this._nodeService.socketNode.on('senderDisconnected', function (data) {
      console.log('senderDisconnected');
      _self.openModal(ReceiverOfflineComponent, _self.objConsulteAux, 'ReceiverOfflineComponent');
    });
    this._nodeService.socketNode.on('confirmInitConsultation', function (data) {
      console.log('confirmInitConsultation');

      const objParam = {
        refObjUser: _self.myObjectUser,
        refObjConsulte: data,
        refSocket: _self._nodeService.socketNode,
        refConsultationService: _self._consultationService,
        refIceServers: null
      };

      _self.refServers = _self._consultationService.getIceServer().subscribe(
        response => {
          if (response.return) {
            objParam.refIceServers = response.message;
            _self.openModal(RunningComponent, objParam, 'RunningComponent');
          } else {
            _self._toastrService.warning(response.msg, 'Atenção');
          }
        },
        err => { _self._toastrService.error('Ocorreu um erro. Atualize a página e tente novamente', 'Erro'); }
      );
    });
    this._nodeService.socketNode.on('confirmInitConsultationAnotherSession', function (data) {
      console.log('confirmInitConsultationAnotherSession');
      console.log(data);
      _self.openModal(ReceiverCallAnotherSessionComponent, data, 'ReceiverCallAnotherSessionComponent');
    });
    this._nodeService.socketNode.on('job_discount', function (data) {
      console.log('job_discount');
      if (_self.myObjectUser.id == data.id_sponsor) {
        const arrayCoins = {
          BRL: 'R$',
          USD: '$',
          HCS: 'H$',
        };
        _self._toastrService.success(
          data.name_worker +
          ' deu um desconto de ' +
          arrayCoins[data.coin] + ' ' +
          data.discount +
          ' na consulta do JOB ' +
          data.job_name,
          'Atenção'
        );
      }

    });
  }

  listenerAfterClose(dialogRef) {
    const _self = this;
    const paramData = dialogRef.componentInstance.data;

    dialogRef.afterClosed().subscribe(result => {
      switch (paramData.executeAfterClose) {
        case 'CallEvalueteComponent':
          console.log('CLOSE: CallEvalueteComponent');

          if (result !== undefined) {
            if (result.rating > 0 && result.comment !== '') {
              const objEvaluate = {
                note: result.rating,
                comment: result.comment,
                transaction: paramData.transaction
              };

              _self.refServers = _self._consultationService.setEvaluate(objEvaluate).subscribe(
                response => {
                  if (response.return) {
                    _self._toastrService.success(response.msg, 'Sucesso');
                  } else {
                    _self._toastrService.warning(response.msg, 'Atenção');
                  }
                },
                err => { _self._toastrService.error('Ocorreu um erro. Atualize a página e tente novamente', 'Erro'); }
              );
            }
          }

          break;
        case 'CallDiscountComponent':
          console.log('CLOSE: CallDiscountComponent');
          if (result !== undefined) {
            let discountValue = Number(result.discount);
            console.log(discountValue);

            if (result.type === 'percent') {
              discountValue = discountValue / 100;
              discountValue = Number(paramData.amount) - (Number(paramData.amount) * discountValue);
            }

            if (discountValue > 0) {
              const objDiscount = {
                discount: Number(discountValue).toFixed(2),
                transaction: paramData.transaction
              };
              console.log(objDiscount);

              _self.refServers = _self._consultationService.setDiscount(objDiscount).subscribe(
                response => {
                  if (response.return) {
                    _self._toastrService.success(response.msg, 'Sucesso');
                  } else {
                    _self._toastrService.warning(response.msg, 'Atenção');
                  }
                },
                err => { _self._toastrService.error('Ocorreu um erro. Atualize a página e tente novamente', 'Erro'); }
              );
            }
          }
          break;
        case 'SenderCallComponent':
          console.log('CLOSE: SenderCallComponent');

          paramData.event = 'cancelInitConsultation';

          _self._nodeService.socketNode.emit('cancelInitConsultation', paramData);
          break;
        case 'SenderDisconnectComponent':
          console.log('CLOSE: SenderDisconnectComponent');
          break;
        case 'SenderIAmBusyComponent':
          console.log('CLOSE: SenderIAmBusyComponent');
          break;
        case 'SenderHeIsBusyComponent':
          console.log('CLOSE: SenderHeIsBusyComponent');
          break;
        case 'SenderOfflineComponent':
          console.log('CLOSE: SenderOfflineComponent');
          break;
        case 'SenderMissedComponent':
          console.log('CLOSE: SenderMissedComponent');
          break;
        case 'SenderRejectComponent':
          console.log('CLOSE: SenderRejectComponent');
          break;
        case 'RunningComponent':
          console.log('CLOSE: RunningComponent');

          if (paramData.motiveClose !== undefined && paramData.motiveClose !== '') {
            let contactName = 'Indefinido';
            if (_self.myObjectUser.id == paramData.refObjConsulte.user_receiver.id) {
              contactName = paramData.refObjConsulte.user_sender.name;
            } else {
              contactName = paramData.refObjConsulte.user_receiver.name;
            }

            const obj = {
              name: _self.myObjectUser.name,
              contactName: contactName,
              photoUrl: _self.myObjectUser.photoUrl,
              amount: paramData.refObjConsulte.amount,
              transaction: paramData.refObjConsulte.id_transaction,
              errorMedia: undefined
            }

            if (paramData.errorMedia !== undefined && paramData.errorMedia !== '') {
              obj.errorMedia = paramData.errorMedia;
            }

            if (_self.myObjectUser.id == paramData.refObjConsulte.json.id_worker) {
              _self.openModal(CallDiscountComponent, obj, 'CallDiscountComponent');
            } else {
              _self.openModal(CallEvalueteComponent, obj, 'CallEvalueteComponent');
            }
          }
          break;
        case 'ReceiverCallComponent':
          if (result !== undefined) {
            if (result === 'accept') {
              const auxObjInit = paramData;

              const bodyPost = {
                'id_job': auxObjInit.job.id,
                'id_worker': auxObjInit.service_type === 'buy' ? auxObjInit.user_receiver.id : auxObjInit.user_sender.id,
                'id_sponsor': auxObjInit.service_type === 'buy' ? auxObjInit.user_sender.id : auxObjInit.user_receiver.id,
                'job_owner': auxObjInit.job.jobOwner
              };

              _self.refConfirmInitConsultation = _self._consultationService.confirmInitConsultation(bodyPost).subscribe(
                response => {
                  if (response.return) {
                    auxObjInit.event = 'confirmInitConsultation';
                    auxObjInit.id_transaction = response.data.transaction;
                    auxObjInit.json = response.data.json;
                    auxObjInit.amount = '';
                    auxObjInit.finishBy = '';
                    auxObjInit.reason_end = '';
                    auxObjInit.reason_end_text = '';

                    _self._nodeService.socketNode.emit('confirmInitConsultation', auxObjInit);
                  } else {
                    _self._toastrService.warning(response.msg, 'Atenção');
                  }
                },
                err => { _self._toastrService.error('Ocorreu um erro. Atualize a página e tente novamente', 'Erro'); }
              );
            } else if (result === 'refused') {
              const auxObj = paramData;
              auxObj.event = 'refuseInitConsultation';
              _self._nodeService.socketNode.emit('refuseInitConsultation', auxObj);
            }
          }
          break;
        case 'ReceiverCallAnotherSessionComponent':
          console.log('CLOSE: ReceiverCallAnotherSessionComponent');
          break;
        case 'ReceiverCancelComponent':
          console.log('CLOSE: ReceiverCancelComponent');
          break;
        case 'ReceiverDisconnectComponent':
          console.log('CLOSE: ReceiverDisconnectComponent');
          break;
        case 'ReceiverMissedComponent':
          console.log('CLOSE: ReceiverMissedComponent');
          break;
        case 'ReceiverOfflineComponent':
          console.log('CLOSE: ReceiverOfflineComponent');
          break;
      }
    });
  }

  blurBody(blur: boolean) {
    const aux: any = document.body.children;
    for (let i = 0; i < aux.length; i++) {
      const element = aux[i];
      if (element.className !== 'cdk-overlay-container') {
        element.style.filter = 'blur(' + (blur ? '5' : '0') + 'px)';
      }
    }
  }

  openModal(component: any, data: any, executeAfterClose = 'default') {
    const _self = this;

    data.executeAfterClose = executeAfterClose;

    const options = {
      data: data,
      disableClose: true
    };

    _self._mdDialog.closeAll();

    const dialogRef = _self._mdDialog.open(component, options);
    _self.listenerAfterClose(dialogRef);
  }

  mountJsontoConsult(params: any) {
    const _self = this;
    this.refMountJson = this._consultationService.mountJsontoConsult(params).subscribe(
      response => {
        if (response.return) {
          _self._nodeService.socketNode.emit('createRoom', response.data);
          _self.openModal(SenderCallComponent, response.data, 'SenderCallComponent');
          _self.objConsulteAux = response.data;
        } else {
          this._toastrService.warning(response.msg, 'Atenção');
        }
      },
      err => {
        this._toastrService.error('Ocorreu um erro. Atualize a página e tente novamente', 'Erro');
      }
    );
  }

  startEventListenerConsultation() {
    const _self = this;
    setTimeout(function () {
      initListeners();
    }, 1000);

    document.onclick = function () {
      initListeners();
    };

    function initListeners() {
      const atributeConsultation = document.querySelectorAll('[atributeConsultation]');
      function getAtribs() {
        const contact = this.getAttribute('contact');
        const job = this.getAttribute('job');
        const type = this.getAttribute('type');

        const objConsultation = {
          contact: contact,
          job: job,
          type: type
        };
        _self.mountJsontoConsult(objConsultation);
      }
      for (let i = 0; i < atributeConsultation.length; i++) {
        const new_element = atributeConsultation[i].cloneNode(true);
        new_element.addEventListener('click', getAtribs, false);
        atributeConsultation[i].parentNode.replaceChild(new_element, atributeConsultation[i]);
      }
    }
  }

  ngOnDestroy() {
    this.refMountJson.unsubscribe();
    this.refGetUsers.unsubscribe();
    this.refConfirmInitConsultation.unsubscribe();
    this.refServers.unsubscribe();
    this.refFinishConsultation.unsubscribe();
  }
}