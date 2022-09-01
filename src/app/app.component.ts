import { Component, VERSION } from '@angular/core';
import {
  AfterViewInit,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { IonDatetime } from '@ionic/angular';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  @ViewChild('wrapper') wrapper: ElementRef;
  @ViewChild('dt') dt: IonDatetime;
  readonly mouseDetectionPadding = 8;
  globalInstance: any;

  timeValue: string;

  constructor(private renderer: Renderer2) {}

  ngOnInit() {
    const defaultDate = new Date(2020, 6, 1, 0, 0, 0);
    console.log(defaultDate);
    this.setTimeValue(defaultDate);
  }

  ngAfterViewInit() {
    this.renderer.listen(this.wrapper.nativeElement, 'wheel', (event) => {
      if (event.deltaY < 25 && event.deltaY > -25) {
        return;
      }
      event.preventDefault();

      const dateTimeControlOffsetLeft = this.wrapper.nativeElement.offsetLeft;
      const timeScrollOffsetLeft = event.path[2].offsetLeft;
      console.log(event.x, dateTimeControlOffsetLeft, timeScrollOffsetLeft);

      const dateTimeXLocation = event.x - dateTimeControlOffsetLeft;

      if (this.isHour(dateTimeXLocation)) {
        console.log('ON HOUR DIAL');
        this.scrollHourDial(event.deltaY);
      } else if (this.isMinute(dateTimeXLocation)) {
        console.log('ON MINUTE DIAL');
        this.scrollMinuteDial(event.deltaY);
      } else if (this.isMeridiem(dateTimeXLocation)) {
        console.log('ON MERIDIEM DIAL');
        this.scrollMeridiemDial(event.deltaY);
        return true;
      }
    });
  }

  isHour(xAxis: number): boolean {
    return (
      xAxis >= 0 + this.mouseDetectionPadding &&
      xAxis <= 58 - this.mouseDetectionPadding
    );
  }

  isMinute(xAxis: number): boolean {
    return (
      xAxis >= 59 + this.mouseDetectionPadding &&
      xAxis <= 116 - this.mouseDetectionPadding
    );
  }

  isMeridiem(xAxis: number): boolean {
    return (
      xAxis >= 117 + this.mouseDetectionPadding &&
      xAxis <= 181 - this.mouseDetectionPadding
    );
  }

  canScrollHourUp(): boolean {
    const ndt = this.getTimeValue();
    return ndt.getHours() !== 0 && ndt.getHours() !== 12;
  }

  canScrollHourDown(): boolean {
    const ndt = this.getTimeValue();
    return ndt.getHours() !== 11 && ndt.getHours() !== 23;
  }

  canScrollMinuteUp(): boolean {
    const ndt = this.getTimeValue();
    return ndt.getMinutes() !== 0;
  }

  canScrollMinuteDown(): boolean {
    const ndt = this.getTimeValue();
    return ndt.getMinutes() !== 55;
  }

  canScrollMeridiemUp(): boolean {
    const ndt = this.getTimeValue();
    return ndt.getHours() >= 12;
  }

  canScrollMeridiemDown(): boolean {
    const ndt = this.getTimeValue();
    return ndt.getHours() < 12;
  }

  addHours(h: number) {
    const ndt = this.getTimeValue();
    console.log(ndt);
    ndt.setHours(ndt.getHours() + h);
    // console.log(ndt.toISOString());
    this.setTimeValue(ndt);
  }

  addMinutes(numOfMinutes) {
    const ndt = new Date(this.timeValue);
    ndt.setMinutes(ndt.getMinutes() + numOfMinutes);
    this.timeValue = ndt.toISOString();
  }

  scrollHourDial(deltaY) {
    if (deltaY < 0) {
      if (this.canScrollHourUp()) {
        this.addHours(-1);
      }
    } else if (deltaY > 0) {
      if (this.canScrollHourDown()) {
        this.addHours(1);
      }
    }
  }

  scrollMinuteDial(deltaY) {
    if (deltaY < 0) {
      if (this.canScrollMinuteUp()) {
        this.addMinutes(-5);
      }
    } else if (deltaY > 0) {
      if (this.canScrollMinuteDown()) {
        this.addMinutes(5);
      }
    }
  }

  scrollMeridiemDial(deltaY) {
    if (deltaY < 0) {
      if (this.canScrollMeridiemUp()) {
        this.addHours(-12);
      }
    } else if (deltaY > 0) {
      if (this.canScrollMeridiemDown()) {
        this.addHours(12);
      }
    }
  }

  private getTimeValue() {
    const tzOffset = new Date().getTimezoneOffset() * 60 * 1000;
    return new Date(new Date(this.timeValue).getTime() + tzOffset);
  }

  private setTimeValue(timeValue: Date) {
    const tzOffset = new Date().getTimezoneOffset() * 60 * 1000;
    this.timeValue = new Date(timeValue.getTime() - tzOffset).toISOString();
    this.canScrollHourUp();
  }
}
