import { Component, OnInit, OnDestroy, ElementRef, ViewChild, Inject, Input } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import { Subscription } from 'rxjs/Rx';
import { MatDialog } from '@angular/material';

import { ChatBoxService } from './chat-box.service';
import { NodeService } from './../node.service';
import { ChatboxConsultationService } from './../chatbox-consultation.service';
import { ToastrService } from 'ngx-toastr';
import { AddNewContactComponent } from './add-new-contact/add-new-contact.component';
import { HyperCookieService, HyperPushNotificationService } from 'hyper-jobs-services';

@Component({
  selector: 'chat-box',
  templateUrl: './chat-box.component.html',
  styleUrls: ['./chat-box.component.css']
})
export class ChatBoxComponent implements OnInit, OnDestroy {

  @ViewChild('scrollMe') private myScrollContainer: ElementRef;
  @Input() userSelected = 0;
  private localUserSelected = -1;

  public chatWindowMinimized = true;
  public firstLoad = true;
  public showChatContacts = false;
  public message = '';
  public showSearch = false;
  public nameSelectedContact = 'Contatos';
  public subtitleHeader = '';
  public idSelectedContact = 0;
  public objRecentChat: any = [];
  public objConversations: any = [];
  public objResume: any = [];
  public filterContact = '';
  public sizeConversation = 20;
  public pageConversation = 1;
  public endFileConversation = false;
  public notification = false;
  public myObjectUser: any;
  public showTyping = false;
  public nameTyping: string;
  public noContacts = false;

  private currentScrollHeight: Number;

  private refRecentChat = new Subscription;
  private refConversation = new Subscription;
  private refSendMessage = new Subscription;
  private refResume = new Subscription;
  private refGetStatusUsers = new Subscription;
  private timeoutTyping: any;

  constructor(
    @Inject(DOCUMENT) private document,
    public _mdDialog: MatDialog,
    private _chatBoxService: ChatBoxService,
    private _nodeService: NodeService,
    private _toastrService: ToastrService,
    private _chatboxConsultationService: ChatboxConsultationService,
    private _hyperCookieService: HyperCookieService,
    private _hyperPushNotificationService: HyperPushNotificationService
  ) { }

  ngOnInit() {
    const _self = this;

    this.myObjectUser = this._chatboxConsultationService.getUserObject();

    this.refResume = this._chatBoxService.getResume().subscribe(
      response => {
        if (response.return) {
          this.objResume = response.data;
          this.subtitleHeader = this.objResume.contacts + ' Contatos';
          this.notification = Boolean(Number(this.objResume.notifications));
        } else {
          this._toastrService.warning(response.msg, 'Atenção');
        }
      },
      err => { this._toastrService.error('Ocorreu um erro. Atualize a página e tente novamente', 'Erro'); }
    );

    this._nodeService.socketNode.on('chat:' + _self.myObjectUser.id, function (data) {
      // console.log(data);

      if (_self.chatWindowMinimized) {
        _self._hyperPushNotificationService.showNotification({
          sender_name: data.user_sender_name,
          message: data.text,
          photoUrl: 'http:////' + data.photo
        })
      }

      const userSender = data.user_sender;
      data['url_photo'] = '//' + data.photo;

      if (_self.idSelectedContact === userSender && _self.showChatContacts === false) {
        _self.setChatMessageRead(data.id);
        _self.objConversations = _self.objConversations.concat(data);
        _self.moveScrollConversation('bottom');
        _self.showTyping = false;

        if (_self.objRecentChat !== undefined) {
          if (_self.objRecentChat.length > 0) {
            _self.objRecentChat.find(aux => aux.chatWith === _self.idSelectedContact).notRead = 0;
          }
        }
      } else {
        _self.notification = true;

        if (_self.objRecentChat !== undefined) {
          if (_self.objRecentChat.length > 0) {

            if (_self.objRecentChat.find(aux => aux.chatWith === userSender) === undefined) {
              _self.requestShowContacts();
            } else {
              let notRead;
              _self.objRecentChat.find(aux => aux.chatWith === userSender).text = data.text;
              notRead = Number(_self.objRecentChat.find(aux => aux.chatWith === userSender).notRead) + 1;
              _self.objRecentChat.find(aux => aux.chatWith === userSender).notRead = notRead;
            }
          }
        }
      }
    });

    this._nodeService.socketNode.on('login_user', function (data) {
      // console.log('login_user', data);

      if (_self._nodeService.checkUserStatusInView(data.id)) {
        const arrayUsers: any = [];
        arrayUsers.push(data.id);

        _self.refGetStatusUsers = _self._chatBoxService.getStatusUsers(arrayUsers).subscribe(
          response => {
            if (response.return) {
              const status = response.data.find(aux => Number(aux.id) === Number(data.id)).status;
              _self._nodeService.setStatusUser(data.id, status);
              _self.changeStatusObjRecentChat(data.id, status);
            }
          },
          err => {
            _self._toastrService.error('Ocorreu um erro. Atualize a página e tente novamente', 'Erro');
          }
        );
      }
    });

    this._nodeService.socketNode.on('disconnect_user', function (data) {
      // console.log('disconnect_user', data);
      _self._nodeService.setStatusUser(data.id, 'offline');
      _self.changeStatusObjRecentChat(data.id, 'offline');
    });

    this._nodeService.socketNode.on('change_status_user', function (data) {
      // console.log('change_status_user', data);
      _self._nodeService.setStatusUser(data.id, data.status);
      _self.changeStatusObjRecentChat(data.id, data.status);
    });

    this._nodeService.socketNode.on('confirm_chat_read:' + _self.myObjectUser.id, function (data) {
      if (data.user_receiver == _self.idSelectedContact && _self.objConversations !== undefined) {
        if (_self.objConversations.length > 0) {
          _self.objConversations.forEach(element => {
            if (element.id === undefined || element.read_at === null) {
              element.read_at = data.read_at;
            }
          });
        }
      }
    });

    this._nodeService.socketNode.on('typing:' + _self.myObjectUser.id, function (data) {
      const userSender = data.user_sender;
      const textTyping = 'digitando...';

      if (_self.objRecentChat !== undefined) {
        if (_self.objRecentChat.length > 0) {
          _self.nameTyping = _self.objRecentChat.find(aux => aux.chatWith === userSender).name;
          if (_self.idSelectedContact === userSender) {
            _self.showTyping = true;

            clearTimeout(_self.timeoutTyping);

            _self.timeoutTyping = setTimeout(() => {
              _self.showTyping = false;
            }, 5000);
          } else {
            const temp = _self.objRecentChat.find(aux => aux.chatWith === userSender).text;
            _self.objRecentChat.find(aux => aux.chatWith === userSender).text = textTyping;

            clearTimeout(_self.timeoutTyping);

            _self.timeoutTyping = setTimeout(() => {
              if (_self.objRecentChat.find(aux => aux.chatWith === userSender).text === textTyping) {
                _self.objRecentChat.find(aux => aux.chatWith === userSender).text = temp;
              }
            }, 5000);
          }
        }
      }
    });

    this._nodeService.socketNode.on('logoff', function (data) {
      // console.log('Listener: logoff', data);

      if (data.id == _self.myObjectUser.id) {
        _self._hyperCookieService.deleteCookie();
        window.location.reload(true);

        // window.location.href = 'login';
      }
    });
  }

  addNewContact() {
    const _self = this;
    const dialogRef = this._mdDialog.open(AddNewContactComponent, {
      data: { nome: 'Fabio' },
      disableClose: false
    });

    this.document.getElementById('chatBoxHyperJobs').style['z-index'] = '10';

    dialogRef.afterClosed().subscribe(result => {
      this.document.getElementById('chatBoxHyperJobs').style['z-index'] = '999999';
      if (result === 'success') {
        _self.showContacts();
      }
    });
  }

  changeStatusObjRecentChat(user, status) {
    const _self = this;
    if (_self.objRecentChat !== undefined && _self.objRecentChat.length > 0) {
      const elem = _self.objRecentChat.find(aux => Number(aux.chatWith) === Number(user));
      if (elem !== undefined && elem !== null && elem !== '') {
        elem.status = status;
      }
    }
    if (user == _self.idSelectedContact) {
      _self.subtitleHeader = _self.getStatusText(status);
    }
  }

  setChatMessageRead(idMessage) {
    if (Number(idMessage) > 0) {
      this.refSendMessage = this._chatBoxService.setChatMessageRead(idMessage).subscribe(
        response => {
          if (response.return) {
            // TODO: Verificar se precisa implementar algo no sucesso
          } else {
            this._toastrService.warning(response.msg, 'Atenção');
          }
        },
        err => {
          this._toastrService.error('Ocorreu um erro. Atualize a página e tente novamente', 'Erro');
        }
      );
    }
  }

  applyFilter() {
    const _self = this;
    if (_self.objRecentChat.length === 0 || _self.filterContact === undefined || _self.filterContact.trim() === '') {
      return _self.objRecentChat;
    }

    return _self.objRecentChat.filter(
      (v) => {
        if (v.name.toLowerCase().indexOf(_self.filterContact.toLowerCase()) >= 0) {
          return true;
        }
        return false;
      }
    );
  }

  verifyNotification(item: any) {
    this.notification = false;
    item.forEach(element => {
      if (element.notRead > 0) {
        this.notification = true;
        return;
      }
    });
  }

  getStatusText(sts: string) {
    let statusText = '';
    switch (sts) {
      case 'online': statusText = 'Online'; break;
      case 'offline': statusText = 'Offline'; break;
      case 'busy': statusText = 'Ocupado'; break;
      default: statusText = 'Offline'; break;
    }

    return statusText;
  }

  toogleMaximize() {
    this.chatWindowMinimized = !this.chatWindowMinimized;
    this.firstLoad = false;
    if (this.idSelectedContact === 0 && this.chatWindowMinimized === false) {
      this.showContacts();
    }
  }

  selectContact(item, idx) {
    // this.refRecentChat.unsubscribe();
    this.idSelectedContact = item.chatWith;
    this.nameSelectedContact = item.name;
    this.subtitleHeader = this.getStatusText(item.status);
    this.pageConversation = 1;
    this.endFileConversation = false;
    this.backToChat();
    this.objConversations = [];

    // Coloca como mensagem visualizada e automaricamente verifica se ainda existe notificaçõe
    this.objRecentChat[idx].notRead = 0;
    this.verifyNotification(this.objRecentChat);

    this.refConversation = this._chatBoxService.getConversation(this.idSelectedContact, this.sizeConversation, this.pageConversation)
      .subscribe(response => {
        if (response.return) {
          this.endFileConversation = response.endFile;
          this.objConversations = response.data;
          this.setChatMessageRead(response.lastMsgReceiver);
          this.moveScrollConversation('bottom');
        } else {
          this._toastrService.warning(response.msg, 'Atenção');
          this.objConversations = [];
        }
      },
      err => {
        this._toastrService.error('Ocorreu um erro. Atualize a página e tente novamente', 'Erro');
        this.objConversations = [];
      });
  }

  listenScroll(evt) {
    // evt.target.scrollTop | evt.target.scrollHeight | evt.target.clientHeight;

    this.currentScrollHeight = Number(evt.target.scrollHeight);

    if (evt.target.scrollTop <= 0) {
      if (!this.endFileConversation) {
        this.pageConversation++;

        this.refConversation = this._chatBoxService.getConversation(this.idSelectedContact, this.sizeConversation, this.pageConversation)
          .subscribe(response => {
            if (response.return) {
              this.endFileConversation = response.endFile;
              const vetAux = response.data;
              this.objConversations = vetAux.concat(this.objConversations);
              this.moveScrollConversation('infinite');
            } else {
              this._toastrService.warning(response.msg, 'Atenção');
            }
          },
          err => {
            this._toastrService.error('Ocorreu um erro. Atualize a página e tente novamente', 'Erro');
          });
      }
    }
  }

  moveScrollConversation(value) {
    const _self = this;
    const auxValue = (isNaN(value) ? value.toLowerCase() : Number(value));
    setTimeout(() => {
      if (auxValue === 'top') {
        _self.myScrollContainer.nativeElement.scrollTop = 0;
      } else if (auxValue === 'bottom') {
        _self.myScrollContainer.nativeElement.scrollTop = _self.myScrollContainer.nativeElement.scrollHeight;
      } else if (auxValue === 'infinite') {
        const newScrollHeight = Number(_self.myScrollContainer.nativeElement.scrollHeight);
        const oldScrollHeight = Number(_self.currentScrollHeight);
        _self.myScrollContainer.nativeElement.scrollTop = (newScrollHeight - oldScrollHeight);
      } else if (!isNaN(auxValue)) {
        _self.myScrollContainer.nativeElement.scrollTop = auxValue;
      }
    }, 50);
  }

  showContacts() {
    this.chatWindowMinimized = false;
    this.firstLoad = false;
    this.showChatContacts = true;
    this.noContacts = false;

    if (this.userSelected !== this.localUserSelected) {
      this.localUserSelected = this.userSelected;
      this.objRecentChat = [];
      this.requestShowContacts(this.userSelected);
    } else {
      this.requestShowContacts();
    }
  }

  requestShowContacts(user?) {
    this.refRecentChat = this._chatBoxService.getRecentChat(user).subscribe(
      response => {
        if (response.return) {
          this.objRecentChat = response.data;
          this.subtitleHeader = this.objRecentChat.length + ' Contatos';
          this.verifyNotification(this.objRecentChat);
          this.noContacts = false;
          if (response.position_select_user !== undefined) {
            this.selectContact(this.objRecentChat[response.position_select_user], response.position_select_user);
          }
        } else {
          this.objRecentChat = [];
          this.noContacts = true;
        }
      },
      err => {
        this._toastrService.error('Ocorreu um erro. Atualize a página e tente novamente', 'Erro');
        this.objRecentChat = [];
        this.noContacts = true;
      }
    );
  }

  toogleSearch() {
    this.showSearch = !this.showSearch;
    if (!this.showSearch) {
      this.filterContact = '';
    }
    if (this.chatWindowMinimized) {
      this.chatWindowMinimized = false;
    }
  }

  triggerSearch() {
    this.toogleSearch();
    this.showContacts();
  }

  backToChat() {
    this.chatWindowMinimized = false;
    this.firstLoad = false;
    this.showChatContacts = false;
    this.showSearch = false;
    this.filterContact = '';
  }

  getDateNow() {
    const date = new Date();
    const str = date.getFullYear() +
      '-' + (date.getMonth() + 1) +
      '-' + date.getDate() +
      ' ' + date.getHours() +
      ':' + date.getMinutes() +
      ':' + date.getSeconds();

    return str;
  }

  sendMessage() {
    if (this.message) {
      let objAux = {
        'user_receiver': this.idSelectedContact,
        'text': this.message,
        'type': 'text'
      };


      this.refSendMessage = this._chatBoxService.SendMessage(objAux).subscribe(
        response => {
          if (response.return) {
            objAux['read_at'] = null;
          } else {
            this._toastrService.warning(response.msg, 'Atenção');
            objAux['read_at'] = 'fail';
          }
        },
        err => {
          this._toastrService.error('Ocorreu um erro. Atualize a página e tente novamente', 'Erro');
          objAux['read_at'] = 'fail';
        }
      );

      this.objRecentChat.find(aux => aux.chatWith == this.idSelectedContact).text = this.message;

      objAux['user_sender'] = this.myObjectUser.id;
      objAux['created_at'] = this.getDateNow();
      objAux['read_at'] = 'sending';

      this.objConversations = this.objConversations.concat(objAux);
      this.message = '';

      this.moveScrollConversation('bottom');
    }
  }

  typingMessage(event) {
    const _self = this;

    if (event.keyCode === 13) {
      this.sendMessage();
    }
    this._nodeService.socketNode.emit('typing',
      {
        'user_sender': _self.myObjectUser.id,
        'user_receiver': _self.idSelectedContact
      }
    );
  }

  ngOnDestroy() {
    this.refRecentChat.unsubscribe();
    this.refConversation.unsubscribe();
    this.refSendMessage.unsubscribe();
    this.refGetStatusUsers.unsubscribe();
  }
}
