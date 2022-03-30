import { BaseModel } from '../../_base/crud';

export class CustomerModel  extends BaseModel {
  id: number;
  firstName: string;
  lastName: string;
  company:string;
  orders: number;
  registered: string;
  email: string;
  phone: string;
  mobile: string;
  ruc: string;
  address: string;
  
  userName: string;
  gender: string;
  status: number; // 0 = Active | 1 = Suspended | Pending = 2
  dateOfBbirth: string;
  dob: Date;
  ipAddress: string;
  type: number; // 0 = Business | 1 = Individual

  clear() {
    this.dob = new Date();
    this.firstName = '';
    this.lastName = '';
    this.company = '';
    this.orders = 0;
    this.registered = '';
    this.email = '';
    this.phone = '';
    this.mobile = '';
    this.userName = '';
    this.gender = 'Female';
    this.ipAddress = '';
    this.type = 1;
    this.status = 1;
  }
}
