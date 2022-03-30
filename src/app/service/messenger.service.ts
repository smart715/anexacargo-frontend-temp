import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment'

@Injectable({
  providedIn: 'root'
})
export class MessengerService {

  constructor(private http: HttpClient) { }
  baseURL = environment.baseURL;
  headers = { "Authorization": "Basic " + btoa("Aexpress:e706dd91-faea-4ebb-b97a-060241085eef") };

  getMessengerByID(idmessengers) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.baseURL + '/messengers/getMessengerByID', { idmessengers: idmessengers }, { headers: this.headers })
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

  getMessengerByEmail(authData) {
    console.log(authData)
    return new Promise((resolve, reject) => {
      this.http
        .post(this.baseURL + '/messengers/getMessengerByEmail', { email: authData.email, password: authData.password }, { headers: this.headers })
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

  getAllMembers() {
    return new Promise((resolve, reject) => {
      this.http
        .get(this.baseURL + '/messengers/getAllMembers', { headers: this.headers })
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

  getAllMessengers() {
    return new Promise((resolve, reject) => {
      this.http
        .get(this.baseURL + '/messengers/getAllMessengers', { headers: this.headers })
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

  createNewMember(user) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.baseURL + '/messengers/createNewMember', user, { headers: this.headers })
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

  editMember(user) {

    return new Promise((resolve, reject) => {
      this.http
        .post(this.baseURL + '/messengers/editMember', user, { headers: this.headers })
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

  deleteMember(idmessengers) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.baseURL + '/messengers/deleteMember', { idmessengers: idmessengers }, { headers: this.headers })
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
