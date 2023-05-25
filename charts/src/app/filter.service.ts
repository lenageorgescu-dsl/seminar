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
}
