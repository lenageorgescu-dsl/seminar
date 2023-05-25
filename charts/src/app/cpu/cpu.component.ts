import { Component, Input } from '@angular/core';
import { defaultLineChartInput, lineChartInput } from '../bar-chart/interfaces';
import { FilterService } from '../filter.service';

@Component({
  selector: 'app-cpu',
  templateUrl: './cpu.component.html',
  styleUrls: ['./cpu.component.css']
})
export class CpuComponent {



  @Input() indexData: any[]=[]
  @Input() placeholderData: any[]=[]

    indexLineDataTweets: lineChartInput = defaultLineChartInput;
    indexLineDataArticles: lineChartInput = defaultLineChartInput;
    placeholderLineDataTweets: lineChartInput = defaultLineChartInput;
    placeholderLineDataArticles: lineChartInput = defaultLineChartInput;

  constructor(private filterService: FilterService){
    
  }

   ngOnChanges(){
    this.indexLineDataTweets = this.parseIndexDataTweets();
    //this.indexLineDataArticles = this.parseIndexDataArticles();
    //this.placeholderLineData= this.parsePlaceholderData();
  }

  parseIndexDataTweets(): lineChartInput{
    const tweetData = this.filterService.getTweets(this.indexData);
    const data = this.filterService.getArrNumber(tweetData, 'cpuPercent');
    const res: lineChartInput = {
      title: 'CPU Percentage while indexing the Tweets-Collection',
      data: data,
      xLabels: this.filterService.getxLabels(data)
    }
    return res;
  }

}
