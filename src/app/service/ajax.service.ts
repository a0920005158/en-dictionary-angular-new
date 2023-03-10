import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError, Subject } from 'rxjs';
import { ConfigService } from './config.service';
import { API_Base } from '../api/structure/API_Base';
@Injectable({
  providedIn: 'root'
})
export class AjaxService {
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    })
  };

  constructor(private httpClient: HttpClient, private config: ConfigService) {

  }

  get(url: string, hearder: HttpHeaders = new HttpHeaders) {
    return this.httpClient.get(url, { headers: hearder });
    // return new Observable(observer => {
    //   this.httpClient.get(url, { headers: hearder }).subscribe(res => {
    //     observer.next(res);
    //   });
    // });
  }

  post<T>(url: string, data: T) {
    let body = new HttpParams();

    Object.keys(data).forEach(el => {
      body = body.append(el, data[el]);
    })

    return new Observable(observer => {
      this.httpClient.post<any>(url, body, this.httpOptions).subscribe(res => {
        observer.next(res);
      });
    });
  }

  apiCall<T>(api: API_Base): Observable<T> {
    let apiPath = this.config.apiPath
    return new Observable(observer => {
      this.httpClient.post<any>(apiPath + api.getApiPath(), api.getParameter(), this.httpOptions).subscribe(res => {
        observer.next(res);
      },
      error=>{
        observer.error(error);
      });
    });
  }
}

export interface Config {
  heroesUrl: string;
  textfile: string;
  date: any;
}
