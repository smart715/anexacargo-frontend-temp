import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment'

@Injectable({
  providedIn: 'root'
})
export class StateAreaService {

  constructor(private http: HttpClient) { }
  baseURL = environment.baseURL;

  headers = { "Authorization": "Basic " + btoa("Aexpress:e706dd91-faea-4ebb-b97a-060241085eef") };
  getAllStates() {
    return new Promise((resolve, reject) => {
      this.http
        .get(this.baseURL + '/states/getAllStates', { headers: this.headers })
        .subscribe(
          async json => {
            resolve(json);
          },
          error => {
            reject(error);
          }
        );
    });
  }

  getStateByID(idstates) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.baseURL + '/states/getStateByID', { idstates: idstates }, { headers: this.headers })
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

  getAreaByID(idareas) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.baseURL + '/states/getAreaByID', { idareas: idareas }, { headers: this.headers })
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


  getAreasByStatesID(idstates) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.baseURL + '/states/getAreasByStatesID', { idstates: idstates }, { headers: this.headers })
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

  createState(state) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.baseURL + '/states/createState', { stateName: state.state, status: state.stateStatus }, { headers: this.headers })
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

  editState(idstates, name, status) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.baseURL + '/states/editState', { idstates: idstates, name: name, status: status }, { headers: this.headers })
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

  createArea(area) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.baseURL + '/states/createArea', { name: area.area, idstates: area.state, status: area.areaStatus }, { headers: this.headers })
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

  editArea(area) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.baseURL + '/states/editArea', { area: area }, { headers: this.headers })
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

  deleteState(state) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.baseURL + '/states/deleteState', { state: state }, { headers: this.headers })
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

  deleteArea(area) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.baseURL + '/states/deleteArea', { area: area }, { headers: this.headers })
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
