import { ApiCallService } from './../../service/api-call.service';
import { API_Base } from "./API_Base";
export class API_AIConversation extends API_Base {
  protected url: string = "ai-conversation";

  response: API_Response = {
    error: undefined,
    choices: [],
    created: 0,
    id: "",
    model: "",
    object: "",
    usage: {
      completion_tokens: 0,
      prompt_tokens: 0,
      total_tokens: 0,
    }
  }

  constructor(ApiCallService: ApiCallService) {
    super(ApiCallService);
  }

  public call(data: AIConversationData) {
    this.data = data;
    return this.subscribe();
  }
}

type AIConversationData = {
  msg: string;
  userId: string;
}

type msgStruct = {
  role: string;
  content: string;
}

export type API_Response = {
  error: errorStruct;
  choices: choicesStruct[];
  created: number;
  id: string;
  model: string;
  object: string;
  usage: usageStruct;
}
type errorStruct = {
  code: string;
  message: string;
  type: string;
}

type choicesStruct = {
  finish_reason: string;
  index: number;
  message: messageStruct;
}
type messageStruct = {
  content: string;
  role: string;
}
type usageStruct = {
  completion_tokens: number;
  prompt_tokens: number;
  total_tokens: number;
}