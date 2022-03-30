// Angular
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
// Partials for CRUD
import {
  ActionNotificationComponent,
  DeleteEntityDialogComponent,
  FetchEntityDialogComponent,
  UpdateStatusDialogComponent
} from '../../../../views/partials/content/crud';

export enum MessageType {
  Create,
  Read,
  Update,
  Delete
}

@Injectable()
export class LayoutUtilsService {
  /**
   * Service constructor
   *
   * @param snackBar: MatSnackBar
   * @param dialog: MatDialog
   */
  constructor(private snackBar: MatSnackBar,
              private dialog: MatDialog) {
  }

  /**
   * Showing (Mat-Snackbar) Notification
   *
   * @param message: string
   * @param type: MessageType
   * @param duration: number
   * @param showCloseButton: boolean
   * @param showUndoButton: boolean
   * @param undoButtonDuration: number
   * @param verticalPosition: 'top' | 'bottom' = 'top'
   */
  showActionNotification(
    message: string,
    type: MessageType = MessageType.Create,
    duration: number = 10000,
    showCloseButton: boolean = true,
    showUndoButton: boolean = true,
    undoButtonDuration: number = 3000,
    verticalPosition: 'top' | 'bottom' = 'bottom'
  ) {
    const data = {
      message,
      snackBar: this.snackBar,
      showCloseButton,
      showUndoButton,
      undoButtonDuration,
      verticalPosition,
      type,
      action: 'Undo'
    };
    return this.snackBar.openFromComponent(ActionNotificationComponent, {
      duration,
      data,
      verticalPosition
    });
  }

  /**
   * Showing Confirmation (Mat-Dialog) before Entity Removing
   *
   * @param title: string
   * @param description: string
   * @param waitDescription: string
   */
  deleteElement(title: string = '', description: string = '', waitDescription: string = '') {
    return this.dialog.open(DeleteEntityDialogComponent, {
      data: {title, description, waitDescription},
      width: '440px'
    });
  }

  /**
   * Showing Fetching Window(Mat-Dialog)
   *
   * @param data: any
   */
  fetchElements(data) {
    return this.dialog.open(FetchEntityDialogComponent, {
      data,
      width: '600px'
    });
  }

  /**
   * Showing Update Status for Entities Window
   *
   * @param title: string
   * @param statuses: string[]
   * @param messages: string[]
   */
  updateStatusForEntities(title, statuses, messages) {
    return this.dialog.open(UpdateStatusDialogComponent, {
      data: {title, statuses, messages},
      width: '600px'
    });
  }
}
