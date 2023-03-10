import { HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { ApiCallService } from "src/app/service/api-call.service";

export abstract class API_Base {
  abstract call(data: unknown);
  protected abstract url: string;
  protected data!: any;
  ApiCallService: ApiCallService

  constructor(ApiCallService: ApiCallService) {
    this.ApiCallService = ApiCallService;
  }

  public getApiPath() {
    return this.url;
  }

  public getParameter(): HttpParams {
    let body = new HttpParams();
    Object.keys(this.data).forEach(el => {
      body = body.append(el, this.data[el]);
    })

    return body;
  }

  public subscribe<T>(): Observable<T> {
    return this.ApiCallService.ajaxService.apiCall(this);
  };
}
