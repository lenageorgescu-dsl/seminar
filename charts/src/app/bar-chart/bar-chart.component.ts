import { Component } from '@angular/core';
import Chart from 'chart.js/auto';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.css']
})
export class BarChartComponent {

  constructor(private http: HttpClient){}

  ngOnInit(): void {
    this.createChart();
  }


  public indexSpeedTweets: any;
  public indexCpuTweets: any;
  public indexMemTweets: any;
  public data: any


  async createChart(){
    let bla;
  const elasticData = this.http.get<any[]>('assets/2-elastic-index-tweets-.json').subscribe(data => {
    bla = data;
})
console.log(bla)
const meiliData = this.http.get<any[]>('assets/2-meili-index-tweets-.json').subscribe(data => {
    console.log(data);
})
const typesenseData = this.http.get<any[]>('assets/2-typesense-index-tweets-.json').subscribe(data => {
    console.log(data);
})


  this.indexSpeedTweets = new Chart("indexSpeedTweets", {
    type: 'bar',
    data: {
      labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
      datasets: [{
        label: '# of Votes',
        data: [12, 19, 3, 5, 2, 3],
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });

   this.indexCpuTweets = new Chart("indexCpuTweets", {
    type: 'bar',
    data: {
      labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
      datasets: [{
        label: '# of Votes',
        data: [12, 19, 3, 5, 2, 3],
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });

   this.indexMemTweets = new Chart("indexMemTweets", {
    type: 'bar',
    data: {
      labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
      datasets: [{
        label: '# of Votes',
        data: [12, 19, 3, 5, 2, 3],
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });


}

}