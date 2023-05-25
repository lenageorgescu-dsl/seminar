import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FilterService {

  constructor() { }


  getMeili(data: any[]){
    return data.filter((s)=> s.engine=='meilisearch').pop();
  }

  getElastic(data: any[]){
    return data.filter((s)=> s.engine=='elasticsearch').pop();
  }

  getTypesense(data: any[]){
    return data.filter((s)=> s.engine=='typesense').pop();
  }

  getTweets(data: any[]): any[]{
    return data.filter((s)=> s.collection == 'tweets');
  }

  getArticles(data: any[]): any[]{
    return data.filter((s)=> s.collection == 'articles');
  }

   getNumbers(data: any, key: string): number[]{
    if (data.length != 3)throw new Error("invalid input")
    const num1 = this.getElastic(data)[key];
    const num2 = this.getMeili(data)[key];
    const num3 = this.getTypesense(data)[key];
    return [num1, num2, num3];
  }
}
