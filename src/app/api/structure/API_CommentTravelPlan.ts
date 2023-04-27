import { ApiCallService } from '../../service/api-call.service';
import { API_Base } from "./API_Base";
export class API_CommentTravelPlan extends API_Base {
  protected url: string = "comment-plan";

  response: API_CommentTravelPlan_Response = {
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
  comment: string;
  stars: number;
}

export type API_CommentTravelPlan_Response = {
  errorCode: number;
  errorMsg: string;
}