import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { EmailService } from 'src/app/service/email.service';
import { first } from 'lodash';
@Injectable({
  providedIn: 'root'
})
export class WarehouseService {
  headers = { "Authorization": "Basic " + btoa("Aexpress:e706dd91-faea-4ebb-b97a-060241085eef") };
  constructor(
    private http: HttpClient,
    private emailService: EmailService,
  ) { }
  baseURL = environment.baseURL;

  createWarehouse(warehouse) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.baseURL + '/warehouse/createWarehouse', { warehouse: warehouse }, { headers: this.headers })
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
  getWarehouseModal(idwarehouse) {
    console.log(idwarehouse, '123123123')
    return new Promise((resolve, reject) => {
      this.http
        .post(this.baseURL + '/warehouse/getModalData', { idwarehouse: idwarehouse }, { headers: this.headers })
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
  getWarehousePdf(idcustomers) {
    console.log(idcustomers, '123123123')
    return new Promise((resolve, reject) => {
      this.http
        .post(this.baseURL + '/warehouse/getPdfData', { idcustomers: idcustomers }, { headers: this.headers })
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
  insertWarehouseModal(firstValue, secondValue, price, idwarehouse) {
    console.log(firstValue, secondValue, price, idwarehouse)
    return new Promise((resolve, reject) => {
      this.http
        .post(this.baseURL + '/warehouse/insertModalData', { firstValue: firstValue, secondValue: secondValue, price: price, idwarehouse: idwarehouse }, { headers: this.headers })
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
  getWarehouseCount(filter) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.baseURL + '/warehouse/getWarehouseCount', { filter: filter }, { headers: this.headers })
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
  getWarehouseByFilter(filter) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.baseURL + '/warehouse/getWarehouseByFilter', { filter: filter }, { headers: this.headers })
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
  getAllWarehouse(filter) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.baseURL + '/warehouse/getAllWarehouse', { filter: filter }, { headers: this.headers })
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
  getAllWarehouseWithCustomerID(filter, customerID) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.baseURL + '/warehouse/getAllWarehouseWithCustomerID', { filter: filter, customerID: customerID }, { headers: this.headers })
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

  getWarehouseWithCustomerID(filter, customerID) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.baseURL + '/warehouse/getWarehouseWithCustomerID', { filter: filter, customerID: customerID }, { headers: this.headers })
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
  setWarehouseStatus(idwarehouse, status) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.baseURL + '/warehouse/setWarehouseStatus', { idwarehouse: idwarehouse, status: status }, { headers: this.headers })
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

  assigneWarehouse(idwarehouse, idmessengers) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.baseURL + '/warehouse/assigneWarehouse', { idwarehouse: idwarehouse, idmessengers: idmessengers }, { headers: this.headers })
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

  getWarehousebyCourierID(idcourier) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.baseURL + '/warehouse/getWarehousebyCourierID', { idcourier: idcourier }, { headers: this.headers })
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

  getWarehouseByID(idwarehouse) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.baseURL + '/warehouse/getWarehouseByID', { idwarehouse: idwarehouse }, { headers: this.headers })
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

  getDeliveryWarehousesByCustomer(idcustomers) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.baseURL + '/warehouse/getDeliveryWarehousesByCustomer', { idcustomers: idcustomers }, { headers: this.headers })
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

  getReadyWarehousesByCustomer(idcustomers) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.baseURL + '/warehouse/getReadyWarehousesByCustomer', { idcustomers: idcustomers }, { headers: this.headers })
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

  getWarehousesByOrderID(idwarehouseOrder) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.baseURL + '/warehouse/getWarehousesByOrderID', { idwarehouseOrder: idwarehouseOrder }, { headers: this.headers })
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

  getWarehouseByOrderID(idwarehouseOrder) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.baseURL + '/warehouse/getWarehouseByOrderID', { idwarehouseOrder: idwarehouseOrder }, { headers: this.headers })
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

  getWarehouseByTracking(tracking) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.baseURL + '/warehouse/getWarehouseByTracking', { tracking: tracking }, { headers: this.headers })
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


  editWarehouse(warehouse, idwarehouse) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.baseURL + '/warehouse/editWarehouse', { warehouse: warehouse, idwarehouse: idwarehouse }, { headers: this.headers })
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

  createWarehouseLog(description, idwarehouse, user) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.baseURL + '/warehouse/createWarehouseLog', { description: description, idwarehouse: idwarehouse, user: user }, { headers: this.headers })
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

  getWarehouseLog(idwarehouse) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.baseURL + '/warehouse/getWarehouseLog', { idwarehouse: idwarehouse }, { headers: this.headers })
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

  getWarehousesByMessengerId(idmessengers) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.baseURL + '/warehouse/getWarehousesByMessengerId', { idmessengers: idmessengers }, { headers: this.headers })
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
  // getWarehousebyID(idwarehouse){
  //   return new Promise((resolve, reject) => {
  //     this.http
  //       .post(this.baseURL + '/warehouse/getWarehousebyID', { idwarehouse: idwarehouse })
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




  // deleteWarehouse(idwarehouse) {
  //   return new Promise((resolve, reject) => {
  //     this.http
  //       .post(this.baseURL + '/warehouse/deleteWarehouse', { idwarehouse: idwarehouse })
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
