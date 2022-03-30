import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpEventType, HttpRequest } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment'
import { map, reject } from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  baseURL = environment.baseURL;
  headers = { "Authorization": "Basic " + btoa("Aexpress:e706dd91-faea-4ebb-b97a-060241085eef") };
  public progressSource = new BehaviorSubject<number>(0);

  constructor(
    private http: HttpClient
  ) { }
  public uploadImage(image: File) {
    const formData = new FormData();

    formData.append('image', image);

    // return this.http.post('/api/v1/image-upload', formData);
    return new Promise((resolve, reject) => {
      this.http
        .post(this.baseURL + '/uploadImage', formData, { headers: this.headers })
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
  public processProgress(envelope: any): void {
    if (typeof envelope === "number") {
      this.progressSource.next(envelope);
    }
  }
  public upload(imageUrl) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.baseURL + '/uploadImageWithUrl', { imageURL: imageUrl }, { headers: this.headers })
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
  public getImageUrl() {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.baseURL + '/getImageUrl', {}, { headers: this.headers })
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


// export class ImageService {

//   constructor(private http: Http) {}


//   public uploadImage(image: File): Observable<Response> {
//     const formData = new FormData();

//     formData.append('image', image);

//     return this.http.post('/api/v1/image-upload', formData);
//   }
// }
