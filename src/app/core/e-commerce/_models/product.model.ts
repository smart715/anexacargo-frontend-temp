import { BaseModel } from '../../_base/crud';
import { ProductSpecificationModel } from './product-specification.model';
import { ProductRemarkModel } from './product-remark.model';

export class ProductModel extends BaseModel {
  id: number;
  tracking: string;
  createdDate: string;
  weight: number;
  volWeight: number;
  assignedTo: string;
  model: string;
  manufacture: string;
  modelYear: number;
  mileage: number;
  description: string;
  color: string;
  price: number;
  condition: number;
  status: number;
  VINCode: string;

  // tslint:disable-next-line
  _specs: ProductSpecificationModel[];
  // tslint:disable-next-line
  _remarks: ProductRemarkModel[];

  clear() {
    this.tracking = '';
    this.createdDate = '';
    this.weight = 0;
    this.volWeight = 0;
    this.assignedTo = '';
    this.model = '';
    this.manufacture = '';
    this.modelYear = 2000;
    this.mileage = 0;
    this.description = '';
    this.color = 'Black';
    this.price = 1000;
    this.condition = 0;
    this.status = 0;
    this.VINCode = '';
  }
}
