import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  private _config: any;

  apiPrefix = "api/"
  get apiPath() {
    if (!this._config) {
      throw Error('Config file not loaded!');
    }
    return this._config.hostUrl + this.apiPrefix;
  }

  get placesUrl() {
    if (!this._config) {
      throw Error('Config file not loaded!');
    }
    return this._config.placesUrl;
  }

  constructor(private http: HttpClient) { }

  loadAppConfig() {
    return this.http.get('/assets/config.json')
      .toPromise()
      .then(data => {
        this._config = data;
      });
  }
}
