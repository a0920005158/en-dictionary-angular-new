import { Injectable } from '@angular/core';
import { API_AIConversation, API_Response } from '../api/structure/API_AIConversation';
import { AIConversation } from '../struct/AIConversation';
import { AjaxServiceService } from './ajax-service.service';

@Injectable({
  providedIn: 'root'
})
export class AIConversationService {
  chatGPTRecord: AIConversation[] = [];
  constructor(private ajaxCall: AjaxServiceService) {

  }

  sentMsg(msg: string): void {
    //AI 對話結構
    let msgObject = new AIConversation();
    msgObject.fromRole = ChatRole.自己;
    msgObject.content = msg;
    this.chatGPTRecord.push(msgObject);

    if (this.chatGPTRecord.length > 0) {
      let msgT = "";
      // this.chatGPTRecord.forEach(el => {
      //   if (el.fromRole == ChatRole.自己) {
      //     msgT += ("\nHuman: " + el.content);
      //   } else {
      //     msgT += ("\nAI: " + el.content);
      //   }
      // })

      // if (this.chatGPTRecord[this.chatGPTRecord.length-1].fromRole == ChatRole.自己) {
      //   msgT += ("\nHuman: " + this.chatGPTRecord[this.chatGPTRecord.length-1].content);
      // } else {
      //   msgT += ("\nAI: " + this.chatGPTRecord[this.chatGPTRecord.length-1].content);
      // }

      msg = msgT + "\nHuman: " + msg;
    }


    //API Call
    let ai = new API_AIConversation({
      msg: msg
    });

    this.ajaxCall.apiCall(ai).subscribe(
      (res: API_Response) => {
        let aiMsgObject = new AIConversation();
        aiMsgObject.fromRole = ChatRole.機器人;
        if (res.choices.length > 0)
          aiMsgObject.content = res.choices[0].text;
        this.chatGPTRecord.push(aiMsgObject);
      },
      (err) => {
        msgObject.isSendSuccess = false;
        this.chatGPTRecord[this.chatGPTRecord.length - 1].isSendSuccess = false;
      }
    );
  }
}
