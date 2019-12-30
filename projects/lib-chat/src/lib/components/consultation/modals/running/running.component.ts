// import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
// import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
// import { ToastrService } from 'ngx-toastr';
// import { Subscription } from 'rxjs/Rx';
// import { Observable } from 'rxjs/Rx';
// import { HjVideoCall } from './../../hjVideoCall';

// @Component({
//   selector: 'app-running',
//   templateUrl: './running.component.html',
//   styleUrls: ['./running.component.css']
// })
// export class RunningComponent implements OnInit, OnDestroy {

//   private refConfirmProgress = new Subscription;
//   private refFinishConsultation = new Subscription;
//   private refPersistChatAutomatic = new Subscription;
//   private refSituationTransaction = new Subscription;

//   private timerUpCount: any;
//   private subscriptionTimer = new Subscription;
//   public objParams: any;
//   private HJVideoCall: any;
//   private callEstablished = false;
//   private timeOutRemake: any = [];
//   private errorMedia = undefined;
//   private reconnection_call_attempts = 0;
//   private remake_call_attempts = 0;
//   private idTransaction;
//   private idCurrentUser;
//   private inCallHjChat = false;


//   public showActionButtons = false;
//   public audioActive = true;
//   public videoActive = false;
//   public messageInfo = '';
//   public remoteVideo = false;
//   public localeVideo = false;
//   public photoLocal = '';
//   public photoRemote = '';
//   public resumeTimer = '00:00:00';
//   public resumeValueConsumed = '0,00';
//   public resumeAmountDisponible = '0,00';
//   public textMoneyConsulte = 'Valor';

//   constructor(
//     @Inject(MAT_DIALOG_DATA) public data: any,
//     public dialogRef: MatDialogRef<RunningComponent>,
//     private _toastrService: ToastrService,
//   ) {
//     this.idTransaction = this.data.refObjConsulte.id_transaction;
//     this.idCurrentUser = this.data.refObjUser.id;
//     this.data.refObjConsulte.currentUser = this.idCurrentUser;
//     this.textMoneyConsulte = this.idCurrentUser == this.data.refObjConsulte.json.id_worker ? 'Valor ganho' : 'Valor gasto';

//     if (this.idCurrentUser == this.data.refObjConsulte.user_sender.id) {

//       this.photoLocal = this.data.refObjConsulte.user_sender.photoUrl;
//       this.photoRemote = this.data.refObjConsulte.user_receiver.photoUrl;
//     } else {
//       this.photoLocal = this.data.refObjConsulte.user_receiver.photoUrl;
//       this.photoRemote = this.data.refObjConsulte.user_sender.photoUrl;
//     }
//     this.photoLocal = 'https://files.dev.hyper.jobs/thumb?src=' + this.photoLocal + '&wmax=150&hmax=150&quality=90&bgcol=333333&crop=Y';
//     this.photoRemote = 'https://files.dev.hyper.jobs/thumb?src=' + this.photoRemote + '&wmax=500&hmax=500&quality=90&bgcol=333333&crop=Y';
//   }

//   ngOnInit() {
//     // data =  refObjUser | refObjConsulte | refSocket | refConsultationService | refIceServer

//     const _self = this;

//     ///////////////////////////////////////INICIO ISTENERS NODE//////////////////////////////////////////

//     _self.data.refSocket.off('confirmConsultationProgress').on('confirmConsultationProgress', function (data) {
//       _self.getSituationTransaction();
//       this.inCallHjChat = true;
//     });

//     _self.data.refSocket.off('disconnnect').on('disconnnect', function (data) {
//       if (data.id_transaction !== undefined) {
//         let amount = 0;

//         _self.finishConsultation(data.id_transaction, 'disconnnect', function (responseData) {
//           if (responseData.return === true) {
//             amount = responseData.data.amount;
//           }
//           _self.data.refObjConsulte.amount = amount;
//           _self.data.motiveClose = 'disconnect';

//           _self.dialogRef.close();

//           _self.inCallHjChat = false;
//           _self.clearTimeoutRemake();
//           _self.subscriptionTimer.unsubscribe();
//           _self.HJVideoCall.stopCall();
//           _self.HJVideoCall.callOff();
//         });
//       }
//     });

//     _self.data.refSocket.off('requestEndConsultation').on('requestEndConsultation', function (data) {
//       console.log('requestEndConsultation');

//       _self.inCallHjChat = false;
//       _self.clearTimeoutRemake();
//       _self.subscriptionTimer.unsubscribe();
//       _self.HJVideoCall.stopCall();
//       _self.HJVideoCall.callOff();

//       _self.data.refObjConsulte = data;
//       _self.data.errorMedia = _self.errorMedia;
//       _self.data.motiveClose = 'finish';

//       _self.dialogRef.close();
//     });

//     ///////////////////////////////////////FIM ISTENERS NODE/////////////////////////////////////////////

//     _self.data.errorMedia = '';
//     _self.data.motiveClose = '';
//     _self.messageInfo = 'Tentando conexão';
//     _self.toogleVideoChangeView('AUDIO_CALL');

//     _self.HJVideoCall = new HjVideoCall(
//       _self.data.refObjUser,        // user
//       _self.data.refObjConsulte,    // data
//       _self.data.refSocket,         // socket
//       _self.data.refIceServers      // stun turn
//     );

//     _self.HJVideoCall.setLocalVideo(document.getElementById('localVideo'));
//     _self.HJVideoCall.setRemoteVideo(document.getElementById('remoteVideo'));
//     _self.HJVideoCall.oniIceGatheringStateChange(function (iceGatheringState) { _self.FCOniIceGatStateChange(iceGatheringState); });
//     _self.HJVideoCall.oniIceconnectionStateChange(function (iceConnectionState) { _self.FCOniIceConStateChange(iceConnectionState); });
//     _self.HJVideoCall.onCalling(function (retorno) { _self.FCOnCalling(retorno); });
//     _self.HJVideoCall.oniMessage(function (retorno) { _self.FCOniMessage(retorno); });
//     _self.HJVideoCall.OnRequestCalling(function (dataTemp) { _self.FCOnRequestCalling(dataTemp); });

//     if (_self.data.refObjConsulte.user_receiver.id == _self.idCurrentUser) {
//       _self.HJVideoCall.call(false, true);
//     }
//   }

//   //////////////////////INICIO FUNÇOES HJVIDEOCALL/////////////////
//   FCOniIceConStateChange(iceConnectionState) {
//     const _self = this;
//     if (iceConnectionState === 'disconnected' || iceConnectionState === 'failed') {
//       _self.clearTimeoutRemake();
//       _self.callEstablished = false;

//       _self.HJVideoCall.reconnectingCall();
//     } else if (iceConnectionState === 'connected') {
//       _self.clearTimeoutRemake();
//       _self.callEstablished = true;
//       _self.messageInfo = '';
//       _self.reconnection_call_attempts = 0;
//       _self.remake_call_attempts = 0;
//       _self.showActionButtons = true;

//       if (_self.idCurrentUser == _self.data.refObjConsulte.user_sender.id && _self.inCallHjChat === false) {
//         _self.refConfirmProgress = _self.data.refConsultationService.confirmInitConsultationProgress(_self.idTransaction).subscribe(
//           response => {
//             if (response.return) {
//               _self.data.refSocket.emit('confirmConsultationProgress', _self.data.refObjConsulte);
//               _self.sendAutomaticMessage(_self.data.refObjConsulte.user_receiver.id, 'begin_videocall');
//             } else {
//               _self.finishConsultation(_self.idTransaction, 'confirm_transaction_failure', function (responseData) {
//                 if (responseData.return === true) {
//                   _self.data.refObjConsulte.event = 'requestEndConsultation';
//                   _self.data.refObjConsulte.finishBy = _self.data.refObjConsulte.user_receiver.id;
//                   _self.data.refObjConsulte.amount = responseData.data.amount;
//                   _self.data.refObjConsulte.reason_end = 'confirm_transaction_failure';
//                   _self.data.refSocket.emit('requestEndConsultation', _self.data.refObjConsulte);
//                   _self.sendAutomaticMessage(_self.data.refObjConsulte.user_receiver.id, 'end_videocall');
//                 }
//               });
//             }
//           },
//           err => { _self._toastrService.error('Ocorreu um erro. Atualize a página e tente novamente', 'Erro'); }
//         );
//       }
//     } else {
//       // console.log('tap4VideoCall.oniIceconnectionStateChange');
//       // console.log(iceConnectionState);
//     }
//   }
//   FCOniMessage(retorno) {
//     const _self = this;
//     switch (true) {
//       case retorno.message === _self.HJVideoCall.getMessageEvents().CALL_OFF:
//         // console.log('CALL_OFF');
//         _self.clearTimeoutRemake();
//         _self.HJVideoCall.stopCall();
//         break;
//       case retorno.message === _self.HJVideoCall.getMessageEvents().OFFER:
//         // console.log('OFFER');
//         break;
//       case retorno.message === _self.HJVideoCall.getMessageEvents().ANSWER:
//         // console.log('ANSWER');
//         break;
//       case retorno.message === _self.HJVideoCall.getMessageEvents().CANDIDATE:
//         // console.log('CANDIDATE');
//         break;
//       case retorno.message === _self.HJVideoCall.getMessageEvents().REFUSE_CALL:
//         // console.log('REFUSE_CALL');
//         break;
//       case retorno.message === _self.HJVideoCall.getMessageEvents().REMAKE_CALL:
//         // console.log('REMAKE_CALL');
//         if (_self.remake_call_attempts < 2) {
//           _self.messageInfo = 'Tentando conexão';
//           _self.HJVideoCall.stopCall();
//           if (_self.data.refObjConsulte.user_receiver.id == _self.idCurrentUser) {
//             _self.remake_call_attempts++;
//             _self.HJVideoCall.call(false, true);
//           }
//         } else {
//           // console.log('Finalizar consulta apos 3 tentativas');

//           _self.finishConsultation(_self.idTransaction, 'remake_failure', function (responseData) {
//             if (responseData.return === true) {
//               _self.data.refObjConsulte.event = 'requestEndConsultation';
//               _self.data.refObjConsulte.finishBy = _self.data.refObjConsulte.user_receiver.id;
//               _self.data.refObjConsulte.amount = responseData.data.amount;
//               _self.data.refObjConsulte.reason_end = 'remake_failure';
//               _self.data.refSocket.emit('requestEndConsultation', _self.data.refObjConsulte);
//             }
//             _self.sendAutomaticMessage(_self.data.refObjConsulte.user_receiver.id, 'end_videocall');
//           });
//         }
//         break;
//       case retorno.message === _self.HJVideoCall.getMessageEvents().RECONNECTION_CALL:
//         // console.log('RECONNECTION_CALL');
//         if (_self.reconnection_call_attempts < 2) {
//           _self.messageInfo = 'Reconectando chamada';
//           _self.HJVideoCall.stopCall();
//           if (_self.data.refObjConsulte.user_receiver.id == _self.idCurrentUser) {
//             _self.reconnection_call_attempts++;
//             _self.HJVideoCall.call(_self.HJVideoCall.getData().audioVideo.localVideo, true);
//           }
//         } else {
//           // console.log('Finalizar consulta apos 3 tentativas');
//           _self.finishConsultation(_self.idTransaction, 'reconnnect_failure', function (responseData) {
//             if (responseData.return === true) {
//               _self.data.refObjConsulte.event = 'requestEndConsultation';
//               _self.data.refObjConsulte.finishBy = _self.data.refObjConsulte.user_receiver.id;
//               _self.data.refObjConsulte.amount = responseData.data.amount;
//               _self.data.refObjConsulte.reason_end = 'reconnnect_failure';
//               _self.data.refSocket.emit('requestEndConsultation', _self.data.refObjConsulte);
//             }
//             _self.sendAutomaticMessage(_self.data.refObjConsulte.user_receiver.id, 'end_videocall');
//           });
//         }
//         break;
//       case retorno.message === _self.HJVideoCall.getMessageEvents().ERROR_RECEIVE_CALL || retorno.message === _self.HJVideoCall.getMessageEvents().ERROR_SENDER_CALL:
//         _self.HJVideoCall.stopCall();
//         // TODO: Acho que pode remover este stopCall pq chama o botao de finalizar e nele ja chama o stopcall

//         if (typeof _self.errorMedia === 'undefined') {
//           _self.errorMedia = retorno;
//           if (retorno.myError && _self.data.refObjConsulte.user_receiver.id == _self.idCurrentUser) {
//             _self.clickFinish();
//           }
//         }
//         break;
//       case retorno.message === _self.HJVideoCall.getMessageEvents().TOOGLE_VIDEO:
//         // console.log('TOOGLE_VIDEO');
//         _self.toogleVideoChangeView(retorno.enumConsultationViewState);
//         break;

//     }
//   }
//   FCOniIceGatStateChange(iceGatheringState) {
//     const _self = this;
//     if (iceGatheringState === 'complete' && _self.callEstablished === false) {
//       // console.log('Adiciona no array timeOutRemake');
//       _self.timeOutRemake.push(
//         setTimeout(function () {
//           // console.log('executa timeOutRemake');
//           if (_self.data.refObjConsulte.user_receiver.id === _self.idCurrentUser) {
//             _self.HJVideoCall.remakeCall();
//           }
//         }, 10000) //10 segundos
//       );
//     }
//   }
//   FCOnCalling(retorno) {
//     const _self = this;
//     _self.HJVideoCall.incomingCall();
//   }
//   FCOnRequestCalling(dataTemp) {
//     const _self = this;
//     // do nothing
//     // console.log("OnRequestCalling");
//     // console.log(dataTemp);
//   }
//   //////////////////////FIM FUNÇOES HJVIDEOCALL///////////////////

//   toogleVideoChangeView = function (view) {
//     switch (view) {
//       case 'LOCAL_AND_REMOTE_VIDEO_CALL':
//         this.remoteVideo = true;
//         this.localeVideo = true;
//         break;
//       case 'LOCAL_VIDEO_CALL':
//         this.remoteVideo = false;
//         this.localeVideo = true;
//         break;
//       case 'REMOTE_VIDEO_CALL':
//         this.remoteVideo = true;
//         this.localeVideo = false;
//         break;
//       case 'AUDIO_CALL':
//         this.remoteVideo = false;
//         this.localeVideo = false;
//         break;
//     }
//   };

//   clearTimeoutRemake() {
//     const _self = this;
//     for (let index = 0; index < _self.timeOutRemake.length; index++) {
//       clearTimeout(_self.timeOutRemake[index]);
//     }
//   }

//   finishConsultation(transaction, reasonEnd, callback) {
//     const _self = this;
//     _self.refFinishConsultation = _self.data.refConsultationService.finishConsultation(transaction, reasonEnd).subscribe(
//       response => {
//         callback(response);
//       },
//       err => { _self._toastrService.error('Ocorreu um erro. Atualize a página e tente novamente', 'Erro'); }
//     );
//   }

//   toogleAudio() {
//     this.audioActive = !this.audioActive;
//     this.HJVideoCall.toggleAudio(this.audioActive);
//   }

//   toogleVideo() {
//     this.videoActive = !this.videoActive;
//     this.HJVideoCall.toggleVideo(this.videoActive, this.idCurrentUser);
//   }

//   sendAutomaticMessage(receiver, type) {
//     const _self = this;
//     _self.refPersistChatAutomatic = _self.data.refConsultationService.persistChatAutomatic(receiver, type).subscribe(
//       response => {
//         if (!response.return) {
//           _self._toastrService.warning(response.msg, 'Atenção');
//         }
//       },
//       err => { _self._toastrService.error('Ocorreu um erro. Atualize a página e tente novamente', 'Erro'); }
//     );
//   }

//   getSituationTransaction() {
//     const _self = this;
//     _self.refSituationTransaction = _self.data.refConsultationService.getSituationTransaction(_self.idTransaction).subscribe(
//       response => {
//         if (response.return) {
//           if (typeof response.data.balanceAvailableJOB !== 'undefined') {
//             _self.upCount(response.data.time);
//             _self.resumeValueConsumed = (response.data.amount).toString().replace('.', ',');
//             _self.resumeAmountDisponible = (response.data.balanceAvailableJOB).toString().replace('.', ',');
//           }
//           if (response.data.balance_out == true) {
//             _self.finishConsultation(_self.idTransaction, 'balance_out', function (responseData) {
//               if (responseData.return === true) {
//                 _self.data.refObjConsulte.event = 'requestEndConsultation';
//                 _self.data.refObjConsulte.finishBy = _self.data.refObjConsulte.user_receiver.id;
//                 _self.data.refObjConsulte.amount = responseData.data.amount;
//                 _self.data.refObjConsulte.reason_end = 'balance_out';
//                 _self.data.refSocket.emit('requestEndConsultation', _self.data.refObjConsulte);
//               }
//               _self.sendAutomaticMessage(_self.data.refObjConsulte.user_receiver.id, 'end_videocall');
//             });
//           }

//         } else {
//           _self._toastrService.warning(response.msg, 'Atenção');
//         }
//       },
//       err => { _self._toastrService.error('Ocorreu um erro. Atualize a página e tente novamente', 'Erro'); }
//     );
//   }

//   clickFinish() {
//     const _self = this;

//     _self.finishConsultation(_self.idTransaction, 'end_job', function (responseData) {
//       let idToSend = 0;

//       _self.data.refObjConsulte.event = 'requestEndConsultation';
//       _self.data.refObjConsulte.finishBy = _self.idCurrentUser;
//       _self.data.refObjConsulte.amount = (responseData.return === true ? responseData.data.amount : 0.00);
//       _self.data.refObjConsulte.reason_end = 'end_job';
//       _self.data.refSocket.emit('requestEndConsultation', _self.data.refObjConsulte);

//       if (_self.idCurrentUser == _self.data.refObjConsulte.user_receiver.id) {
//         idToSend = _self.data.refObjConsulte.user_sender.id;
//       } else {
//         idToSend = _self.data.refObjConsulte.user_receiver.id;
//       }

//       _self.sendAutomaticMessage(idToSend, 'end_videocall');
//     });
//   }

//   upCount(dbDate) {
//     const _self = this;
//     const arrayTimer = dbDate.split(':');

//     let hours = arrayTimer[0];
//     let minutes = arrayTimer[1];
//     let seconds = arrayTimer[2];

//     _self.subscriptionTimer.unsubscribe();
//     _self.timerUpCount = Observable.timer(0, 1000); // (esperar,segundo)
//     _self.subscriptionTimer = _self.timerUpCount.subscribe(tick => {
//       seconds++;
//       if (seconds >= 60) {
//         seconds = 0;
//         minutes++;
//       }
//       if (minutes >= 60) {
//         minutes = 0;
//         hours++;
//       }
//       if (hours >= 60) {
//         hours = 0;
//       }

//       _self.resumeTimer = (Number(hours) <= 9 ? '0' + Number(hours) : Number(hours)) + ':' +
//         (Number(minutes) <= 9 ? '0' + Number(minutes) : Number(minutes)) + ':' +
//         (Number(seconds) <= 9 ? '0' + Number(seconds) : Number(seconds));
//     });
//   };

//   ngOnDestroy() {
//     this.refConfirmProgress.unsubscribe();
//     this.refFinishConsultation.unsubscribe();
//     this.subscriptionTimer.unsubscribe();
//     this.refPersistChatAutomatic.unsubscribe();
//     this.refSituationTransaction.unsubscribe();
//     this.clearTimeoutRemake();
//   }
// }
