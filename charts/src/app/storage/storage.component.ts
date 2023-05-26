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
    const data1 = this.filterService.getNumbers(init, 'storage');;
    const data2 = this.filterService.getNumbers(tweetData, 'storage');
    const data3 = this.filterService.getNumbers(articleData, 'storage')
    const data4 = this.aggregateData (data1, data2, data3);
    const data = [{data: data1, label: 'Init'},{data: data2, label: 'Tweets'},{data: data3, label: 'Articles'},{data: data4, label: 'Total'}]

    const res: barChartInput = {
      title: 'Storage',
      labels: defaultLabels,
      datasets: data
    }
    return res;
  }

  private aggregateData(arr1: number[], arr2: number[], arr3: number[]): number[]{
    let res = []
    for (let i = 0; i < 3; i++){
      res[i]= arr1[i] + arr2[i] + arr3[i];
    }
    return res;
  }


}
