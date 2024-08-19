import { Component, OnInit, OnDestroy, ViewChild, ElementRef} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { PrimeNGConfig } from 'primeng/api';
import { MultiSelectModule } from 'primeng/multiselect';
import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { DomSanitizer } from '@angular/platform-browser';
import moment from 'moment';
import XDMWorker, {packageDaterangeMessage, packageNormalMessage} from '../common/send.xdm';
import { reportAddress, reportParams, defaults as init, allFamiliesAvaiable, PARAMETERNAME, type PanelSelectedProps, type SelectedType} from '../common/demo.define';

let initRef = {...init};

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ButtonModule, MultiSelectModule, FormsModule, CalendarModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.less'
})

export class AppComponent implements OnInit, OnDestroy{
  reportAddr: string = '';
  title = 'visualizer-xdm-demo-angular';
  families!: Array<{name:string, code:string}>;
  xdm: XDMWorker | null = null;
  enablueApply: boolean = true; 
  @ViewChild('reportFrame') iframeRef: ElementRef<HTMLIFrameElement> | undefined; 

  /**
   * Calculate whether the apply button is enabled
   */
  #calculateApply(){
    const {family, date} = this;
    if(
      family.sort((a,b)=>a.name.localeCompare(b.name)).join('') === initRef.family.sort((a,b)=>a.name.localeCompare(b.name)).join('') && 
      moment(date?.[0]).valueOf() === initRef.date.start && moment(date?.[1]).valueOf() === initRef.date.end
    ){
      this.enablueApply = false;
    }else{
      this.enablueApply = true;
    }
  }

  /**
   * The selected product family
   */
  #family: Array<SelectedType> = [];
  get family(): Array<SelectedType>{
    return this.#family;
  }
  set family(value: Array<SelectedType>){
    this.#family = value;
    this.#calculateApply();
  }

  /**
   * The selected date range
   */
  #date: Date[] | undefined;
  get date(): Date[] | undefined{
    return this.#date;
  }
  set date(value: Date[] | undefined){
    this.#date = value ? [...value] : undefined;
    this.#calculateApply();
  }

  /**
   * Apply the selected filter criteria
   */
  onCommitEvent(){
    const msg = {family: this.family, date: {start: moment(this.date?.[0]).valueOf(), end: moment(this.date?.[1]).valueOf()}};
    this.xdm?.send(
      this.encodeQueryString(msg), 
      this.iframeRef?.nativeElement?.contentWindow as Window
    );
    initRef = {...msg};
    this.#calculateApply();
  }

  /**
   * Encode the selected filter criteria into the query string
   */
  encodeQueryString(data:PanelSelectedProps){
    const { family: p, date: d } = data;
    const sender = [
      ...packageDaterangeMessage(PARAMETERNAME.date, [[{ i: 1, v: d.start.valueOf() }, { i: 1, v: d.end.valueOf() }]]), 
    ];
    p.length && sender.push(...packageNormalMessage(PARAMETERNAME.productFamily, [...p.map(o=>o.code)]));
    return sender; 
  }

  constructor(private primengConfig: PrimeNGConfig, private sanitizer: DomSanitizer) {
    this.xdm = new XDMWorker({
      onPageInitEvent: () => this.xdm?.send(
        this.encodeQueryString(initRef), 
        this.iframeRef?.nativeElement?.contentWindow as Window, 
        true
      )
    });
  }

  ngOnDestroy(){
    this.xdm?.destroy();
  }

  ngOnInit() {
    this.primengConfig.ripple = true;
    this.families = [...allFamiliesAvaiable];
    this.family = initRef.family?.map((o:SelectedType)=>({...o}))||[];
    this.date = [moment(initRef.date.start).toDate(), moment(initRef.date.end).toDate()];
    this.reportAddr = this.sanitizer.bypassSecurityTrustResourceUrl(`${reportAddress}&${reportParams.join('&')}`) as string;
  }
}


