import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent {

   constructor(
    //private breakpointObserver: BreakpointObserver,
    private http: HttpClient,
  ) {}

  hideMemory = true;
  hideCpu = true;
  hideSpeed = true;
  hideStorage = true;

  initData: any[] = [];
  storageData: any[]=[];
  indexData: any[]=[];
  placeholderSearchData: any[] = [];

  async ngOnInit(): Promise<void> {
    const repoInfo = 'assets/1_experiment.json';
     const data = this.http
      .get<any[]>(repoInfo) //GeneralData array
      .subscribe((data) =>{ console.log(data)
        this.initData = data.filter((s: any)=> s.operation == 'init');
        this.storageData = data.filter((s)=> (s.operation == 'init' || s.operation == 'index')).map((s)=>({name: 'Storage', operation: s.operation, engine: s.engine, collection: s.collection, storage: s.storageMega}));
        this.indexData = data.filter((s)=> s.operation == 'index');
        this.placeholderSearchData = data.filter((s)=> s.operation == ('placeholderSearch'));
      })
  }

  toggleStorage(){
    this.hideStorage = !this.hideStorage;
  }

  toggleSpeed(){
    this.hideSpeed = !this.hideSpeed;
  }

  toggleCpu(){
    this.hideCpu = !this.hideCpu;
  }

  toggleMemory(){
    this.hideMemory = ! this.hideMemory;
  }

}
