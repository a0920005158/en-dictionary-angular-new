import { ApiCallService } from '../../service/api-call.service';
import { API_Base } from "./API_Base";
export class API_GetCommentTravelPlan extends API_Base {
  protected url: string = "get-comment-plan";

  response: API_GetCommentTravelPlan_Response = {
    errorCode: 0,
    errorMsg: "",
    result: {
      acc: "",
      comment: "",
      stars: 0
    }
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

export type API_GetCommentTravelPlan_Response = {
  errorCode: number;
  errorMsg: string;
  result: API_GetCommentPlan_Result;
}

export type API_GetCommentPlan_Result = {
  acc: string;
  comment: string;
  stars: number;
}