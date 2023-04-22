import { ApiCallService } from '../../service/api-call.service';
import { API_Base } from "./API_Base";
export class API_StoreTravelPlan extends API_Base {
  protected url: string = "store-plan";

  response: API_StoreTravelPlan_Response = {
    errorCode: 0,
    errorMsg: ""
  }

  constructor(ApiCallService: ApiCallService) {
    super(ApiCallService);
  }

  public call(data: RequestData) {
    this.data = data;
    return this.subscribe();
  }
}

type RequestData = {
  idToken: string;
  title: string;
  context: string;
}

export type API_StoreTravelPlan_Response = {
  errorCode: number;
  errorMsg: string;
}