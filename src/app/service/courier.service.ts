import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment'
@Injectable({
  providedIn: 'root'
})
export class CourierService {

  constructor(private http: HttpClient) { }
  baseURL = environment.baseURL;
  headers = { "Authorization": "Basic " + btoa("Aexpress:e706dd91-faea-4ebb-b97a-060241085eef") };


  createCourier(courier) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.baseURL + '/courier/createCourier', { courier }, { headers: this.headers })
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

  getCourierByID(idcourier){
    return new Promise((resolve, reject) => {
      this.http
        .post(this.baseURL + '/courier/getCourierByID', { idcourier: idcourier }, { headers: this.headers })
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

  getAllCouriers() {
    return new Promise((resolve, reject) => {
      this.http
        .get(this.baseURL + '/courier/getAllCouriers', { headers: this.headers })
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



  // editCourier(courier) {
  //   return new Promise((resolve, reject) => {
  //     this.http
  //       .post(this.baseURL + '/courier/editCourier', { courier: courier })
  //       .subscribe(
  //         json => {
  //           resolve(json);
  //         },
  //         error => {
  //           reject(error);
  //         }
  //       );
  //   });
  // }

  // deleteCourier(idcourier) {
  //   return new Promise((resolve, reject) => {
  //     this.http
  //       .post(this.baseURL + '/courier/deleteCourier', { idcourier: idcourier })
  //       .subscribe(
  //         json => {
  //           resolve(json);
  //         },
  //         error => {
  //           reject(error);
  //         }
  //       );
  //   });
  // }

}
