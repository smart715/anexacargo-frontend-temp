import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment'
@Injectable({
  providedIn: 'root'
})
export class SettingService {

  constructor(private http: HttpClient) { }
  baseURL = environment.baseURL;
  headers = { "Authorization": "Basic " + btoa("Aexpress:e706dd91-faea-4ebb-b97a-060241085eef") };
  getSettings() {
    return new Promise((resolve, reject) => {
      this.http
        .get(this.baseURL + '/setting/getSettings', { headers: this.headers })
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

  saveSettings(settings) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.baseURL + '/setting/saveSettings', { settings: settings }, { headers: this.headers })
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

  addnews(news) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.baseURL + '/setting/addnews', { news: news }, { headers: this.headers })
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

  getAllNews() {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.baseURL + '/setting/getAllNews', {}, { headers: this.headers })
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
  saveLocation(locationObject) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.baseURL + '/setting/saveLocation', { locationObject: locationObject }, { headers: this.headers })
        .subscribe(
          json => {
            resolve(json);
          },
          error => {
            reject(error);
          }
        )
    })
  }
  getLocation() {
    console.log(123123)
    return new Promise((resolve, reject) => {
      this.http
        .post(this.baseURL + '/setting/getLocation', {}, { headers: this.headers })
        .subscribe(
          json => {
            resolve(json);
          },
          error => {
            reject(error);
          }
        )
    })
  }

}
