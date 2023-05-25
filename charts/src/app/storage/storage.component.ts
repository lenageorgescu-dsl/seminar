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
    const data = [{data: this.filterService.getNumbers(init, 'storage'), label: 'Init'},{data: this.filterService.getNumbers(tweetData, 'storage'), label: 'Tweets'},{data: this.filterService.getNumbers(articleData, 'storage'), label: 'Articles'},]

    const res: barChartInput = {
      title: 'Storage',
      labels: defaultLabels,
      datasets: data
    }
    return res;
  }


}
