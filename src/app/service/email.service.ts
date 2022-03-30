import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment'

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  constructor(private http: HttpClient,) { }
  headers = { "Authorization": "Basic " + btoa("Aexpress:e706dd91-faea-4ebb-b97a-060241085eef") };
  baseURL = environment.baseURL;
  sendmail(email) {
    console.log(email)
    return new Promise((resolve, reject) => {
      this.http
        .post(this.baseURL + '/sendmail', email, { headers: this.headers })
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
  sendmail_change(email) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.baseURL + '/sendmail_change', email, { headers: this.headers })
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

