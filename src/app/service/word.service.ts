import { Injectable } from '@angular/core';
import { AjaxServiceService } from './ajax-service.service';
import { WordSearch, WordDefinition, WordExamples } from '../struct/WordSearch';
import { Observable, forkJoin, interval, throwError, Subject } from 'rxjs';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class WordService {
  private url: string = "https://api.wordnik.com/v4/word.json/";
  private Wordnik_API_Key: string = "nxf8br2c6444ehxws2yz63o7tv2l6hiptwa1rjs6wonhizkqg";

  constructor(private ajax: AjaxServiceService) { }

  searchWord(word: string) {
    return forkJoin([this.searchDefinitions(word), this.searchExample(word)]).pipe(
      map(
        ([definition, examples]: [WordDefinition[], WordExamples]): WordSearch =>
        (
          {
            //解釋
            text: definition.filter((i, k) => i.text != undefined).map(x => x.text),
            //查詢單字
            word: definition[0].word,
            examples: examples.examples.filter((i, k) => i.text != undefined).map(x => x.text)
          }
        )
      )
    )
  }

  searchDefinitions(word: string) {
    let url = this.url + word + "/definitions";
    let useCanonical = "?useCanonical=false";
    let limitCount = "&limit=5";
    let apiKey = "&api_key=" + this.Wordnik_API_Key;
    return this.ajax.get(url + useCanonical + limitCount + apiKey);
  }

  searchExample(word: string) {
    let url = this.url + word + "/examples";
    let useCanonical = "?useCanonical=false";
    let includeDuplicates = "&includeDuplicates=false";
    let apiKey = "&api_key=" + this.Wordnik_API_Key;
    return this.ajax.get(url + useCanonical + includeDuplicates + apiKey);
  }
}
