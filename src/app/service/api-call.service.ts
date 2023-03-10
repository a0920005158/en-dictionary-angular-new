import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_AIConversation, API_Response } from '../api/structure/API_AIConversation';
import { AjaxService } from './ajax.service';

@Injectable({
  providedIn: 'root'
})
export class ApiCallService {
  AIConversation: API_AIConversation = new API_AIConversation(this);

  constructor(public ajaxService: AjaxService) {

  }
}