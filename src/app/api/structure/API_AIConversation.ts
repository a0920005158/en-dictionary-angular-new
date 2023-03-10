import { HttpParams } from "@angular/common/http";
import { API_Base } from "./API_Base";
export class API_AIConversation extends API_Base {
  protected url: string = "ai-conversation";

  response: API_Response = {
    choices: [],
    created: 0,
    id: "",
    model: "",
    object: "",
    usage: {
      completion_tokens: 9,
      prompt_tokens: 14,
      total_tokens: 23,
    }
  }

  constructor(data: AIConversationData) {
    super();
    this.data = data;
  }
}

type AIConversationData = {
  msg: string;
}

export type API_Response = {
  choices: choicesStruct[];
  created: number;
  id: string;
  model: string;
  object: string;
  usage: usageStruct;
}

type choicesStruct = {
  finish_reason: string;
  index: number;
  logprobs: null;
  text: string;
}
type usageStruct = {
  completion_tokens: number;
  prompt_tokens: number;
  total_tokens: number;
}
