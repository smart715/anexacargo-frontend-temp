import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment'
@Injectable({
  providedIn: 'root'
})
export class FaqService {

  constructor(private http: HttpClient) { }
  headers = { "Authorization": "Basic " + btoa("Aexpress:e706dd91-faea-4ebb-b97a-060241085eef") };
  baseURL = environment.baseURL;
  getAllFAQCategory() {
    return new Promise((resolve, reject) => {
      this.http
        .get(this.baseURL + '/faq/getAllFAQCategory', { headers: this.headers })
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

  createFAQCatetory(faq) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.baseURL + '/faq/createFAQCatetory', { faq }, { headers: this.headers })
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

  editFAQCategory(idfaq, name) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.baseURL + '/faq/editFAQCategory', { idfaq: idfaq, name: name }, { headers: this.headers })
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

  deleteFAQCategory(idfaqCategory) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.baseURL + '/faq/deleteFAQCategory', { idfaqCategory: idfaqCategory }, { headers: this.headers })
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

  getAllFAQ() {
    return new Promise((resolve, reject) => {
      this.http
        .get(this.baseURL + '/faq/getAllFAQ', { headers: this.headers })
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

  deleteFAQ(idfaq) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.baseURL + '/faq/deleteFAQ', { idfaq: idfaq }, { headers: this.headers })
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

  getFAQbyID(idfaq) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.baseURL + '/faq/getFAQbyID', { idfaq: idfaq }, { headers: this.headers })
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

  createFAQ(faq) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.baseURL + '/faq/createFAQ', { faq }, { headers: this.headers })
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

  updateFAQ(faq){
    return new Promise((resolve, reject) => {
      this.http
        .post(this.baseURL + '/faq/updateFAQ', { faq }, { headers: this.headers })
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
