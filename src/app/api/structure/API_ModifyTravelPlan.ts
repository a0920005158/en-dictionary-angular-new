import { ApiCallService } from '../../service/api-call.service';
import { API_Base } from "./API_Base";
export class API_ModifyTravelPlan extends API_Base {
  protected url: string = "modify-plan";

  response: API_ModifyTravelPlan_Response = {
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
  title: string;
  context: string;
}

export type API_ModifyTravelPlan_Response = {
  errorCode: number;
  errorMsg: string;
}