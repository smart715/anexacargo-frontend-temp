import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment'

@Injectable({
  providedIn: 'root'
})
export class PackageTypeService {

  constructor(private http: HttpClient) { }
  baseURL = environment.baseURL;
  headers = { "Authorization": "Basic " + btoa("Aexpress:e706dd91-faea-4ebb-b97a-060241085eef") };

  getAllPackageTypes() {
    return new Promise((resolve, reject) => {
      this.http
        .get(this.baseURL + '/packageType/getAllPackageTypes', { headers: this.headers })
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
  getPackageTypeByID(idpackageType){
    return new Promise((resolve, reject) => {
      this.http
        .post(this.baseURL + '/packageType/getPackageTypeByID', { idpackageType: idpackageType }, { headers: this.headers })
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

  createPackageType(packageType) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.baseURL + '/packageType/createPackageType', { packageType }, { headers: this.headers })
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

  editPackageType(idpackageType, name) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.baseURL + '/packageType/editPackageType', { idpackageType: idpackageType, name: name }, { headers: this.headers })
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

  deletePackageType(idpackageType) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.baseURL + '/packageType/deletePackageType', { idpackageType: idpackageType }, { headers: this.headers })
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
