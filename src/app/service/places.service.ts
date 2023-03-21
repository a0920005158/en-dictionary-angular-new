import { Injectable } from '@angular/core';
import { AjaxService } from './ajax.service';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class PlacesService {
    private API_KEY = 'AIzaSyDjD2_-EGRNJ7xsioVE60TaGjiYhL3Zx88'; // 將YOUR_API_KEY替換為您自己的API金鑰

    constructor(private ajax: AjaxService) { }

    searchKeywordPlaces(keyword: string, type: PlaceType) {
        // 將您想查詢的關鍵字和場所類型傳遞到Google Places API中的URL
        let url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${keyword}`;
        if (type !== PlaceType.全部) {
            url += `&type=${type}`;
        }

        url += `&key=${this.API_KEY}`
        return this.ajax.get(url);
    }

    searchLocalPlaces(location: string, type: PlaceType): Observable<any> {
        let url: string = `https://maps.googleapis.com/maps/api/place/textsearch/json?`;
        if (type !== PlaceType.全部) {
            url += `query=${location}`;
        } else {
            url += `query=${type}+in+${location}`;
        }

        url += `&key=${this.API_KEY}`
        return this.ajax.get(url);
    }
}