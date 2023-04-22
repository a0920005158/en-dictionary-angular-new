import { ApiCallService } from '../../service/api-call.service';
import { API_Base } from "./API_Base";
export class API_ReleaseTravelPlan extends API_Base {
  protected url: string = "release-mem-plan";

  response: API_ReleaseTravelPlan_Response = {
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
  pid: number;
}

export type API_ReleaseTravelPlan_Response = {
  errorCode: number;
  errorMsg: string;
}