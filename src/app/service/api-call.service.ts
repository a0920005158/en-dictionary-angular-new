import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_AIConversation, API_Response } from '../api/structure/API_AIConversation';
import { API_AITravelPlan } from '../api/structure/API_AITravelPlan';
import { AjaxService } from './ajax.service';

@Injectable({
  providedIn: 'root'
})
export class ApiCallService {
  AIConversation: API_AIConversation = new API_AIConversation(this);
  AITravelPlan: API_AITravelPlan = new API_AITravelPlan(this);

  constructor(public ajaxService: AjaxService) {

  }
}