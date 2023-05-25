import { Component, Input } from '@angular/core';
import { barChartInput, defaultBarChartInput, defaultLabels } from '../bar-chart/interfaces';
import { FilterService } from '../filter.service';

@Component({
  selector: 'app-storage',
  templateUrl: './storage.component.html',
  styleUrls: ['./storage.component.css']
})
export class StorageComponent {

  @Input() data: any[] = [];

  barData: barChartInput = defaultBarChartInput;

  constructor(private filterService: FilterService){}


  ngOnChanges(){
    this.barData = this.parseData();
  }


  parseData(): barChartInput{
    const tweetData = this.filterService.getTweets(this.data);
    const articleData = this.filterService.getArticles(this.data);
    const init = this.data.filter((s)=> s.operation == 'init');
    const data = [{data: this.getStorageNumbers(init), label: 'Init'},{data: this.getStorageNumbers(tweetData), label: 'Tweets'},{data: this.getStorageNumbers(articleData), label: 'Articles'},]


    const res: barChartInput = {
      title: 'Storage',
      labels: defaultLabels,
      datasets: data
    }
    return res;
  }


  getStorageNumbers(data: any): number[]{
    if (data.length != 3)throw new Error("invalid input")
    const num1 = this.filterService.getElastic(data).storage;
    const num2 = this.filterService.getMeili(data).storage;
    const num3 = this.filterService.getTypesense(data).storage;
    return [num1, num2, num3];
  }


}
