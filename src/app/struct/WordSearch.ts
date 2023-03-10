export type WordSearch = {
  //解釋
  text: string[];
  //查詢單字
  word: string;
  examples: string[];
}

export type citations = {
  //引用
  cite: string;
  //來源
  source: string;
}


export interface WordDefinition {
  //搜尋來源
  attributionText: string;
  //來源網址
  attributionUrl: string;
  //引用
  citations: citations[];
  //型態
  partOfSpeech: string;
  //順序
  sequence: string;
  //來源字典
  sourceDictionary: string;
  //解釋
  text: string;
  //查詢單字
  word: string;
}

export interface WordExamples {
  examples: WordExamples_Lv2[];
}

export interface WordExamples_Lv2 {
  author: string;
  documentId: number;
  exampleId: number;
  provider: { id: string }
  rating: number;
  text: string;
  title: string;
  url: string;
  word: string;
  year: number;
}
