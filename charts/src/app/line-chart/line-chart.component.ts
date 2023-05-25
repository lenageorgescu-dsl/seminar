import { Component, Input, ViewChild } from '@angular/core';
import { Chart, ChartConfiguration, ChartEvent, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

import { default as Annotation } from 'chartjs-plugin-annotation';
import { defaultLineChartInput, lineChartInput } from '../bar-chart/interfaces';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css']
})
export class LineChartComponent {

  constructor() {
    Chart.register(Annotation)
  }


  @Input() inputData: lineChartInput = defaultLineChartInput;
  ngOnChanges(){
    this.lineChartOptions!.plugins!.title!.text= this.inputData.title;
    this.lineChartData.datasets[0].data = this.inputData.data[0];
    this.lineChartData.datasets[1].data = this.inputData.data[1];
    this.lineChartData.datasets[2].data = this.inputData.data[2];
    this.lineChartData.labels = this.inputData.xLabels;
    this.chart?.update();
   }





  public lineChartData: ChartConfiguration['data'] = {
    datasets: [
      {
        data: [ 65, 59, 80, 81, 56, 55, 40 ],
        label: 'ElasticSearch',
        backgroundColor: 'rgba(15, 10, 222,0.2)',
        borderColor: 'rgba(15, 10, 222,1)',
        pointBackgroundColor: 'rgba(15, 10, 222,1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(15, 10, 222,0.8)',
        fill: 'origin',
      },
      {
        data: [ 28, 48, 40, 19, 86, 27, 90 ],
        label: 'MeiliSearch',
        backgroundColor: 'rgba(46,204,113,0.2)',
        borderColor: 'rgba(46,204,113,1)',
        pointBackgroundColor: 'rgba(46,204,113,1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(46,204,113,1)',
        fill: 'origin',
      },
      {
        data: [ 180, 480, 770, 90, 1000, 270, 400 ],
        label: 'Typesense',
        backgroundColor: 'rgba(255,0,0,0.3)',
        borderColor: 'red',
        pointBackgroundColor: 'rgba(148,159,177,1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(148,159,177,0.8)',
        fill: 'origin',
      }
    ],
    labels: [ '']
  };

  public lineChartOptions: ChartConfiguration['options'] = {
    elements: {
      line: {
        tension: 0.5
      }
    },
    scales: {
      // We use this empty structure as a placeholder for dynamic theming.
      y:
        {
          position: 'left',
        },
    },

    plugins: {
      legend: { display: true }, title: {display: true, text: 'foo'},
    }
  };

  public lineChartType: ChartType = 'line';

  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  // events
  public chartClicked({ event, active }: { event?: ChartEvent, active?: {}[] }): void {
    console.log(event, active);
  }

  public chartHovered({ event, active }: { event?: ChartEvent, active?: {}[] }): void {
    //console.log(event, active);
  }
}
