import { ApiCallService } from '../../service/api-call.service';
import { API_Base } from "./API_Base";
export class API_GetAllTravelPlan extends API_Base {
  protected url: string = "get-all-plan";

  response: API_GetAllTravelPlan_Response = {
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
  pg: number;
}

export type API_GetAllTravelPlan_Response = {
  errorCode: number;
  errorMsg: string;
  result: API_GetTravelPlan_Result;
}

export type API_GetTravelPlan_Result = {
  List: API_GetTravelPlan_List[];
  pg: Pg;
}

export type API_GetTravelPlan_List = {
  id: number;
  acc: string;
  context: string;
  created_at: string;
  email: string;
  isOp: number;
  title: string;
  updated_at: string;
}

export type Pg = {
  current: number;
  amount: number;
  pagesize: number;
}