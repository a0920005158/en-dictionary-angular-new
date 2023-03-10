import { ApiCallService } from './api-call.service';
import { Injectable } from '@angular/core';
import { API_AIConversation, API_Response } from '../api/structure/API_AIConversation';
import { AIConversation } from '../struct/AIConversation';
import { AjaxService } from './ajax.service';
import { LoginService } from './login.service';
import { LibToken } from '../lib/lib-token';

@Injectable({
  providedIn: 'root'
})
export class AIConversationService {
  visitorTk: string;
  chatGPTRecord: AIConversation[] = [];
  constructor(
    private ajaxCall: AjaxService,
    private loginService: LoginService,
    private apiCallService: ApiCallService
  ) {
    this.visitorTk = LibToken.generateToken(12);
  }

  sentMsg(msg: string): void {
    if(msg == '')
      return;
    //AI 對話結構
    let msgObject = new AIConversation();
    msgObject.fromRole = ChatRole.自己;
    msgObject.content = msg;
    // let recordLg = this.chatGPTRecord.length;
    // let msgArr = [];
    // if (recordLg > 0) {
    //   for (let i = 4; i > 0; i--) {
    //     if (recordLg - i >= 0) {
    //       msgArr.push(
    //         {
    //           role: ChatRole.自己 ? "user" : "assistant",
    //           content: this.chatGPTRecord[recordLg - i].content
    //         }
    //       );
    //     }
    //   }
    // }

    // msgArr.push({ role: "user", content: msg });

    this.chatGPTRecord.push(msgObject);

    this.apiCallService.AIConversation.call(
      {
        msg: msg,
        userId: this.visitorTk
      }
    ).subscribe(
      (res: API_Response) => {
        if (res.error != undefined) {
          // msgObject.isSendSuccess = false;
          this.chatGPTRecord[this.chatGPTRecord.length - 1].isSendSuccess = false;
        } else {
          let aiMsgObject = new AIConversation();
          aiMsgObject.fromRole = ChatRole.機器人;
          if (res.choices.length > 0)
            aiMsgObject.content = res.choices[0].message.content;
          this.chatGPTRecord.push(aiMsgObject);
        }

      },
      (err) => {
        // msgObject.isSendSuccess = false;
        this.chatGPTRecord[this.chatGPTRecord.length - 1].isSendSuccess = false;
      }
    );
  }
}
