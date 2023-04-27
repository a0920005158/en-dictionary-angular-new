import { ApiCallService } from '../../service/api-call.service';
import { API_Base } from "./API_Base";
export class API_GetAllCommentTravelPlan extends API_Base {
  protected url: string = "get-all-comment-plan";

  response: API_GetAllCommentTravelPlan_Response = {
    errorCode: 0,
    errorMsg: "",
    result: {
      List: [],
      pg: {
        current: 0,
        amount: 0,
        pagesize: 0
      }
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
  pid: number;
  pg: number;
}

export type API_GetAllCommentTravelPlan_Response = {
  errorCode: number;
  errorMsg: string;
  result: API_GetAllComment_Result;
}

export type API_GetAllComment_Result = {
  List: API_GetAllComment_List[];
  pg: Pg;
}

export type API_GetAllComment_List = {
  id: number;
  pid: string;
  comment: string;
  stars: string;
  comment_acc: string;
  comment_email: string;
  created_at: string;
  updated_at: string;
}

export type Pg = {
  current: number;
  amount: number;
  pagesize: number;
}