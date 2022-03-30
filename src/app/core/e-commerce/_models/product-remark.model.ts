import { BaseModel } from '../../_base/crud';

export class ProductRemarkModel extends BaseModel {
  id: number;
  carId: number;
  text: string;
  type: number; // Info, Note, Reminder
  dueDate: string;
  // tslint:disable-next-line
  _isEditMode: boolean;

  // Refs
  // tslint:disable-next-line
  _carName: string;

  clear(carId: number) {
    this.id = undefined;
    this.carId = carId;
    this.text = '';
    this.type = 0;
    this.dueDate = '';
    this._isEditMode = false;
  }
}
