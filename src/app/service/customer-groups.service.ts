import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment'
@Injectable({
  providedIn: 'root'
})
export class CustomerGroupsService {

  constructor(private http: HttpClient) { }
  headers = { "Authorization": "Basic " + btoa("Aexpress:e706dd91-faea-4ebb-b97a-060241085eef") };
  baseURL = environment.baseURL;
  getAllCustomerGroups() {
    return new Promise((resolve, reject) => {
      this.http
        .get(this.baseURL + '/customerGroup/getAllCustomerGroups', { headers: this.headers })
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
  getCustomerGroupByID(idcustomerGroup){
    return new Promise((resolve, reject) => {
      this.http
        .post(this.baseURL + '/customerGroup/getCustomerGroupByID', { idcustomerGroup: idcustomerGroup }, { headers: this.headers })
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

  createCustomerGroup(customerGroup) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.baseURL + '/customerGroup/createCustomerGroup', { customerGroup }, { headers: this.headers })
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

  editCustomerGroup(idcustomerGroup, name) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.baseURL + '/customerGroup/editCustomerGroup', { idcustomerGroup: idcustomerGroup, name: name }, { headers: this.headers })
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

  deleteCustomerGroup(idcustomerGroup) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.baseURL + '/customerGroup/deleteCustomerGroup', { idcustomerGroup: idcustomerGroup }, { headers: this.headers })
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
