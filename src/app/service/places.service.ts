import { CityState } from './../struct/CityState';
import { Injectable } from '@angular/core';
import { AjaxService } from './ajax.service';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class PlacesService {
    private API_KEY = 'AIzaSyDjD2_-EGRNJ7xsioVE60TaGjiYhL3Zx88'; // 將YOUR_API_KEY替換為您自己的API金鑰
    public cityState: CityState[] = [];

    constructor(private ajax: AjaxService) {
        this.ajax.get("assets/json/City.json").subscribe((res: { [key: string]: string }) => {
            Object.keys(res).forEach(el => {

                this.ajax.get("assets/json/" + el.replace(/\s+/g, "") + ".json").subscribe((res2: { [key: string]: string }) => {
                    console.log('yyy');
                    console.log(res2);
                    let state = [];
                    Object.keys(res2).forEach(el2 => {
                        
                    })
                    this.cityState.push({
                            enName: el,
                            cnName: res[el],
                            State: []
                    });

                })
            })
        })
    }

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