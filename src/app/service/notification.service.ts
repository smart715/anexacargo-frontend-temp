import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment'

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private http: HttpClient) { }
  baseURL = environment.baseURL;
  headers = { "Authorization": "Basic " + btoa("Aexpress:e706dd91-faea-4ebb-b97a-060241085eef") };

  sendNotification(title, data) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.baseURL + '/notification/sendNotification', { title: title, data: data }, { headers: this.headers })
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

  sendNotificationToSpecificUser(idcustomers, title, data) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.baseURL + '/notification/sendNotificationToSpecificUser', {idcustomers: idcustomers, title: title, data: data }, { headers: this.headers })
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
