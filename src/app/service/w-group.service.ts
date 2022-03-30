import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment'
@Injectable({
  providedIn: 'root'
})
export class WGroupService {
  headers = { "Authorization": "Basic " + btoa("Aexpress:e706dd91-faea-4ebb-b97a-060241085eef") };

  constructor(private http: HttpClient) { }
  baseURL = environment.baseURL;
  getAllWGroup() {
    return new Promise((resolve, reject) => {
      this.http
        .get(this.baseURL + '/wGroup/getAllWGroup', { headers: this.headers })
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

  createWGroup(wGroup) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.baseURL + '/wGroup/createWGroup', { wGroup }, { headers: this.headers })
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

  editWGroup(wGroup) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.baseURL + '/wGroup/editWGroup', { wGroup }, { headers: this.headers })
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

  deleteWGroup(idwGroup) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.baseURL + '/wGroup/deleteWGroup', { idwGroup: idwGroup }, { headers: this.headers })
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

  getWGroupByID(idwGroup) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.baseURL + '/wGroup/getWGroupByID', { idwGroup: idwGroup }, { headers: this.headers })
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
