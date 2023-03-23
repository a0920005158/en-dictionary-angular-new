export interface CityState {
  enName: string;
  cnName: string;
  State: State[];
}

export interface State {
  enName: string;
  cnName: string;
}

export class SearchCityState {
  selectCity: number = -1;
  selectSate: number = -1;
}

export interface Place {
  name: string;
  rating: number;
  formatted_address: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  photos: {
    photo_reference: string;
    height: number;
    width: number;
  }[];
  types: string[];
  opening_hours?: {
    open_now: boolean;
    weekday_text: string[];
  };
}