import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class WarehouseOrderService {

  constructor(
    private http: HttpClient,
    ) { }
  baseURL = environment.baseURL;
  headers = { "Authorization": "Basic " + btoa("Aexpress:e706dd91-faea-4ebb-b97a-060241085eef") };

  getWarehouseOrderByWarehouseOrderID(idwarehouseOrder){
    return new Promise((resolve, reject) => {
      this.http
        .post(this.baseURL + '/warehouseOrder/getWarehouseOrderByWarehouseOrderID', { idwarehouseOrder: idwarehouseOrder }, { headers: this.headers })
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

  getAllWarehouseOrder(){
    return new Promise((resolve, reject) => {
      this.http
        .get(this.baseURL + '/warehouseOrder/getAllWarehouseOrder', { headers: this.headers })
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

  setWarehouseOrderStatus(idwarehouseOrder, status, idmessenger){
    return new Promise((resolve, reject) => {
      this.http
        .post(this.baseURL + '/warehouseOrder/setWarehouseOrderStatus', { idwarehouseOrder: idwarehouseOrder, status: status }, { headers: this.headers })
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
