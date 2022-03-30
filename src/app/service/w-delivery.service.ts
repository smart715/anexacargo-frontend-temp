import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment'
@Injectable({
  providedIn: 'root'
})
export class WDeliveryService {

  headers = { "Authorization": "Basic " + btoa("Aexpress:e706dd91-faea-4ebb-b97a-060241085eef") };
  constructor(private http: HttpClient) { }
  baseURL = environment.baseURL;
  getAllWDelivery() {
    return new Promise((resolve, reject) => {
      this.http
        .get(this.baseURL + '/wDelivery/getAllWDelivery', { headers: this.headers })
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

  createWDelivery(wDelivery) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.baseURL + '/wDelivery/createWDelivery', { wDelivery }, { headers: this.headers })
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

  editWDelivery(wDelivery) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.baseURL + '/wDelivery/editWDelivery', { wDelivery }, { headers: this.headers })
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

  deleteWDelivery(idwDelivery) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.baseURL + '/wDelivery/deleteWDelivery', { idwDelivery: idwDelivery }, { headers: this.headers })
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

  getWDeliveryByID(idwDelivery) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.baseURL + '/wDelivery/getWDeliveryByID', { idwDelivery: idwDelivery }, { headers: this.headers })
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
