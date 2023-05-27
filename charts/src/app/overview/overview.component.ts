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

  cpuKey = 'cpu';
  cpuName = 'CPU';

  memKey = 'mem';
  memName = 'Memory'

  speedKey= 'running';
  speedName= '-Speed in Milliseconds'
  speedTitle = 'Speed'

  hitKey='hits'
  hitName='-Hits'
  hitTitle = 'Hits'

  hideMemory = true;
  hideCpu = true;
  hideSpeed = true;
  hideStorage = true;
  hideHits = true;

  initData: any[] = [];
  storageData: any[]=[];
  indexData: any[]=[];
  placeholderSearchData: any[] = [];
  keyWordSearchData: any[]=[];

  async ngOnInit(): Promise<void> {
    const repoInfo = 'assets/22_experiment.json';
     const data = this.http
      .get<any[]>(repoInfo) //GeneralData array
      .subscribe((data) =>{
        console.log(data)
        this.initData = data.filter((s: any)=> s.operation == 'init');
        this.storageData = data.filter((s)=> (s.operation == 'init' || s.operation == 'index')).map((s)=>({name: 'Storage', operation: s.operation, engine: s.engine, collection: s.collection, storage: s.storageMega}));
        this.indexData = data.filter((s)=> s.operation == 'index');
        this.placeholderSearchData = data.filter((s)=> s.operation == ('placeholderSearch'));
        this.keyWordSearchData = data.filter((s)=> s.operation == ('keywordSearch'));
      })
  }

  openStorage(){
    this.closeAll();
    this.hideStorage = false;
  }

  openSpeed(){
    this.closeAll();
    this.hideSpeed = false
  }

  openCpu(){
    this.closeAll();
    this.hideCpu = false;
  }

  openMemory(){
    this.closeAll();
    this.hideMemory = false;
  }

  openHits(){
    this.closeAll();
    this.hideHits = false;
  }

  private closeAll(){
    this.hideCpu = true;
    this.hideMemory = true;
    this.hideSpeed = true;
    this.hideStorage = true;
    this.hideHits = true;
  }

}
