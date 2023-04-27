
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_AIConversation, API_Response } from '../api/structure/API_AIConversation';
import { API_AITravelPlan } from '../api/structure/API_AITravelPlan';
import { API_StoreTravelPlan } from '../api/structure/API_StoreTravelPlan';
import { API_GetTravelPlan } from './../api/structure/API_GetTravelPlan';
import { API_ReleaseTravelPlan } from './../api/structure/API_ReleaseTravelPlan';
import { API_DeleteTravelPlan } from './../api/structure/API_DeleteTravelPlan';
import { API_ModifyTravelPlan } from './../api/structure/API_ModifyTravelPlan';
import { API_CommentTravelPlan } from './../api/structure/API_CommentTravelPlan';
import { API_GetCommentTravelPlan } from './../api/structure/API_GetCommentTravelPlan';
import { API_GetAllCommentTravelPlan } from './../api/structure/API_GetAllCommentTravelPlan';
import { API_GetAllTravelPlan } from './../api/structure/API_GetAllTravelPlan';

import { AjaxService } from './ajax.service';

@Injectable({
  providedIn: 'root'
})
export class ApiCallService {
  AIConversation: API_AIConversation = new API_AIConversation(this);
  AITravelPlan: API_AITravelPlan = new API_AITravelPlan(this);
  StoreTravelPlan: API_StoreTravelPlan = new API_StoreTravelPlan(this);
  GetTravelPlan: API_GetTravelPlan = new API_GetTravelPlan(this);
  ReleaseTravelPlan: API_ReleaseTravelPlan = new API_ReleaseTravelPlan(this);
  DeleteTravelPlan: API_DeleteTravelPlan = new API_DeleteTravelPlan(this);
  ModifyTravelPlan: API_ModifyTravelPlan = new API_ModifyTravelPlan(this);
  GetAllTravelPlan: API_GetAllTravelPlan = new API_GetAllTravelPlan(this);
  CommentTravelPlan: API_CommentTravelPlan = new API_CommentTravelPlan(this);
  GetCommentTravelPlan: API_GetCommentTravelPlan = new API_GetCommentTravelPlan(this);
  GetAllCommentTravelPlan: API_GetAllCommentTravelPlan = new API_GetAllCommentTravelPlan(this);

  constructor(public ajaxService: AjaxService) {

  }
}