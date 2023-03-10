import { HttpParams } from "@angular/common/http";

export abstract class API_Base {
  protected abstract url: string;
  protected data!: any;

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
}
