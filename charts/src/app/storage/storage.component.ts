import { Component, Input } from '@angular/core';
import { barChartInput, defaultBarChartInput, defaultLabels } from '../bar-chart/interfaces';

@Component({
  selector: 'app-storage',
  templateUrl: './storage.component.html',
  styleUrls: ['./storage.component.css']
})
export class StorageComponent {

  @Input() data: any[] = [];

  barData: barChartInput = defaultBarChartInput;


  ngOnChanges(){
    this.barData = this.parseData();
  }


  parseData(): barChartInput{
    const tweetData = this.getTweets(this.data);
    console.log("foo")
    console.log(tweetData);

    const articleData = this.getArticles(this.data);

    const init = this.data.filter((s)=> s.operation == 'init');

    const data = [{data: this.getStorageNumbers(init), label: 'Init'},{data: this.getStorageNumbers(articleData), label: 'Articles'},{data: this.getStorageNumbers(tweetData), label: 'Tweets'}]

    const res: barChartInput = {
      title: 'Storage',
      labels: defaultLabels,
      datasets: data
    }
    return res;
  }


  getMeili(data: any){
    return this.data.filter((s)=> s.engine=='meilisearch').pop();
  }

  getElastic(data: any){
    return this.data.filter((s)=> s.engine=='elasticsearch').pop();
  }

  getTypesense(data: any){
    return this.data.filter((s)=> s.engine=='typesense').pop();
  }

  getTweets(data: any): any[]{
    return this.data.filter((s)=>s.collection == 'tweets');
  }

  getArticles(data: any): any[]{
    return this.data.filter((s)=>s.collection == 'articles');
  }


  getStorageNumbers(data: any): number[]{
    const num1 = this.getElastic(data).storage;
    const num2 = this.getMeili(data).storage;
    const num3 = this.getTypesense(data).storage;
    return [num1, num2, num3];
  }


}
