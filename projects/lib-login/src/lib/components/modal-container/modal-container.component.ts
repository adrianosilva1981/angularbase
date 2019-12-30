import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import { BroadcastEventService } from 'lib-services';

@Component({
  selector: 'lib-login-modal-container',
  templateUrl: './modal-container.component.html',
  styleUrls: ['./modal-container.component.less']
})
export class ModalContainerComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public _dialogRef: MatDialogRef<ModalContainerComponent>
  ) {
    BroadcastEventService.event('onModalLoginActions').subscribe(
      result => {
        switch (result.action) {
          case 'login-success':
            this._dialogRef.close(result.action);
            break;
          case 'close':
            this._dialogRef.close();
            break;
        }
      }
    );
  }

  ngOnInit() { }

}
