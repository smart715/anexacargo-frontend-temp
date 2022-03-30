

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment'

@Injectable({
  providedIn: 'root'
})
export class PriceService {

  constructor(private http: HttpClient) { }
  baseURL = environment.baseURL;
  headers = { "Authorization": "Basic " + btoa("Aexpress:e706dd91-faea-4ebb-b97a-060241085eef") };

  getPrice(idcustomerGroup, idareas, idpackageType){
    return new Promise((resolve, reject) => {
      this.http
        .post(this.baseURL + '/price/getPrice', { idcustomerGroup: idcustomerGroup, idareas: idareas , idpackageType:idpackageType}, { headers: this.headers })
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

  editPrice(idcustomerGroup,idpackageType, idareas, price) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.baseURL + '/price/editPrice', { idcustomerGroup: idcustomerGroup, idpackageType: idpackageType, idareas: idareas, price: price }, { headers: this.headers })
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

