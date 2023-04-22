import { ApiCallService } from '../../service/api-call.service';
import { API_Base } from "./API_Base";
export class API_DeleteTravelPlan extends API_Base {
  protected url: string = "delete-mem-plan";

  response: API_DeleteTravelPlan_Response = {
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

export type API_DeleteTravelPlan_Response = {
  errorCode: number;
  errorMsg: string;
}