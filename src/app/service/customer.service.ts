import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment'

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  constructor(private http: HttpClient,) { }
  headers = { "Authorization": "Basic " + btoa("Aexpress:e706dd91-faea-4ebb-b97a-060241085eef") };
  baseURL = environment.baseURL;
  getCount(filter) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.baseURL + '/customer/getCount', { filter: filter }, { headers: this.headers })
        .subscribe(
          json => {
            resolve(json);
          },
          error => {
            reject(error);
          }
        );
    });
  }
  getPsb() {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.baseURL + '/customer/getPsb', {}, { headers: this.headers })
        .subscribe(
          json => {
            resolve(json);
          },
          error => {
            reject(error);
          }
        );
    });
  }
  getEmailContent() {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.baseURL + '/customer/getEmailContent', {}, { headers: this.headers })
        .subscribe(
          json => {
            resolve(json);
          },
          error => {
            reject(error);
          }
        );
    });
  }
  saveEmailContent(customData) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.baseURL + '/customer/saveEmailContent', { customData: customData }, { headers: this.headers })
        .subscribe(
          json => {
            resolve(json);
          },
          error => {
            reject(error);
          }
        );
    });
  }
  getTableContent() {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.baseURL + '/customer/getTableContent', {}, { headers: this.headers })
        .subscribe(
          json => {
            resolve(json);
          },
          error => {
            reject(error);
          }
        );
    });
  }
  saveTableContent(customData) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.baseURL + '/customer/saveTableContent', { customData: customData }, { headers: this.headers })
        .subscribe(
          json => {
            resolve(json);
          },
          error => {
            reject(error);
          }
        );
    });
  }
  getCustomerByFilter(filter) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.baseURL + '/customer/getCustomerByFilter', { filter: filter }, { headers: this.headers })
        .subscribe(
          json => {
            resolve(json);
          },
          error => {
            reject(error);
          }
        );
    });
  }
  getAll(filter) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.baseURL + '/customer/getAllCustomers', { filter: filter }, { headers: this.headers })
        .subscribe(
          json => {
            resolve(json);
          },
          error => {
            reject(error);
          }
        );
    });
  }
  getAllCustomers() {
    return new Promise((resolve, reject) => {
      console.log(this.headers)
      this.http
        .post(this.baseURL + '/customer/getCustomers', {}, { headers: this.headers })
        .subscribe(
          json => {
            resolve(json);
          },
          error => {
            reject(error);
          }
        );
    });
  }
  createNew(newCustomer) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.baseURL + '/customer/createNew', newCustomer, { headers: this.headers })
        .subscribe(
          json => {
            resolve(json);
          },
          error => {
            reject(error);
          }
        );
    });
  }
  createCustomerByUser(newCustomer) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.baseURL + '/customer/createCustomerByUser', newCustomer, { headers: this.headers })
        .subscribe(
          json => {
            resolve(json);
          },
          error => {
            reject(error);
          }
        );
    });
  }
  deleteCustomerByID(idcustomers) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.baseURL + '/customer/deleteCustomerByID', { idcustomers: idcustomers }, { headers: this.headers })
        .subscribe(
          json => {
            resolve(json);
          },
          error => {
            reject(error);
          }
        );
    }); ``
  }
  savePsb(psbdata, title) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.baseURL + '/customer/savePsb', { data: psbdata, title: title }, { headers: this.headers })
        .subscribe(
          json => {
            resolve(json);
          },
          error => {
            reject(error);
          }
        );
    });
  }
  getCustomerByID(idcustomers) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.baseURL + '/customer/getCustomerByID', { idcustomers: idcustomers }, { headers: this.headers })
        .subscribe(
          json => {
            resolve(json);
          },
          error => {
            reject(error);
          }
        );
    });
  }

  updateStatus(idcustomers, status) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.baseURL + '/customer/updateStatus', { idcustomers: idcustomers, status: status }, { headers: this.headers })
        .subscribe(
          json => {
            resolve(json);
          },
          error => {
            reject(error);
          }
        );
    });
  }
  resetPwd(email, password) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.baseURL + '/customer/resetPwd', { email: email, password: password }, { headers: this.headers })
        .subscribe(
          json => {
            resolve(json);
          },
          error => {
            reject(error);
          }
        );
    });
  }
  updateProfile(idcustomers, customer) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.baseURL + '/customer/updateProfile', { idcustomers: idcustomers, customer: customer }, { headers: this.headers })
        .subscribe(
          json => {
            resolve(json);
          },
          error => {
            reject(error);
          }
        );
    });
  }
  getCustomerByEmail(authData) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.baseURL + '/customer/getCustomerByEmail', { email: authData.email, password: authData.password }, { headers: this.headers })
        .subscribe(
          json => {
            resolve(json);
          },
          error => {
            reject(error);
          }
        );
    });
  }
  getCustomerByTempToken(token) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.baseURL + '/customer/getCustomerByTempToken', { token: token }, { headers: this.headers })
        .subscribe(
          json => {
            resolve(json);
          },
          error => {
            reject(error);
          }
        );
    });
  }
  getCustomerByOnlyEmail(email) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.baseURL + '/customer/getCustomerByOnlyEmail', { email: email }, { headers: this.headers })
        .subscribe(
          json => {
            resolve(json);
          },
          error => {
            reject(error);
          }
        );
    });
  }
  getCommentsByCustomer(idcustomers) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.baseURL + '/customer/getCommentsByCustomer', { idcustomers: idcustomers }, { headers: this.headers })
        .subscribe(
          json => {
            resolve(json);
          },
          error => {
            reject(error);
          }
        );
    });
  }
  createCommentsByCustomerAndAdminID(idadmin, idcustomers, comments) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.baseURL + '/customer/createCommentsByCustomerAndAdminID', { idadmin: idadmin, idcustomers: idcustomers, comments: comments }, { headers: this.headers })
        .subscribe(
          json => {
            resolve(json);
          },
          error => {
            reject(error);
          }
        );
    });
  }
  createCustomerLog(idadmin, idcustomers, description) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.baseURL + '/customer/createCustomerLog', { idadmin: idadmin, idcustomers: idcustomers, description: description }, { headers: this.headers })
        .subscribe(
          json => {
            resolve(json);
          },
          error => {
            reject(error);
          }
        );
    });
  }

  getLogsByCustomer(idcustomers) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.baseURL + '/customer/getLogsByCustomer', { idcustomers: idcustomers }, { headers: this.headers })
        .subscribe(
          json => {
            resolve(json);
          },
          error => {
            reject(error);
          }
        );
    });
  }
  setResetPwdToken(email, token) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.baseURL + '/customer/setResetPwdToken', { email: email, token: token }, { headers: this.headers })
        .subscribe(
          json => {
            resolve(json);
          },
          error => {
            reject(error);
          }
        );
    });
  }

}
