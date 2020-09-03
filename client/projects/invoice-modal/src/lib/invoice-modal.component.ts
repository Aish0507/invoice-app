import {
  Component,
  OnInit,
  EventEmitter,
  HostBinding,
  HostListener,
  ViewChild,
  ElementRef,
  Input,
  ComponentFactoryResolver,
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';

import { AdDirective } from './ad.directive';

export interface AdComponent {
  modalProperties: any;
  modalEvents: any;
  modalData?: any;
}

@Component({
  selector: 'lib-invoice-modal',
  templateUrl: './invoice-modal.component.html',
  styleUrls: ['./invoice-modal.component.scss']
})
export class InvoiceModalComponent implements OnInit, AfterViewInit {

  events = new EventEmitter();
  closeEvent = new EventEmitter();
  stateEvents = new EventEmitter();
  // tslint:disable-next-line:no-inferrable-types
  public overlayBackdrop: boolean = true;

  @ViewChild(AdDirective) adHost: AdDirective;

  @Input() properties: any;
  // tslint:disable-next-line:no-inferrable-types
  @HostBinding('class.modal-desktop') desktopMode: boolean = false;
  // tslint:disable-next-line:no-inferrable-types
  @HostBinding('class.modal-mobile') mobileMode: boolean = false;
  // tslint:disable-next-line:no-inferrable-types
  @HostBinding('class.modal-show') isShow: boolean = false;

  @HostListener('transitionend', ['$event'])
  transitionEnd(event) {
    if (this.isShow) {
      if (event.propertyName === 'transform') {
        this.stateEvents.emit('shown');
      }
    } else {
      this.closeEvent.emit(true);
      this.stateEvents.emit('hidden');
    }
  }

  get data() {
    return this.properties.data;
  }

  get containerStyles() {
    let styles = {};

    if (this.properties.width) {
      styles['width'] = this.properties.width;
    }
    if (this.properties.height) {
      styles['height'] = this.properties.height;
    }
    if (this.properties.maxWidth) {
      styles['max-width'] = this.properties.maxWidth;
    }
    if (this.properties.maxHeight) {
      styles['max-height'] = this.properties.maxHeight;
    }

    return styles;
  }

  get containerWrapperStyles() {
    let styles = {};

    if (this.properties.height) {
      // tslint:disable-next-line:no-string-literal
      styles['height'] = '100%';
    }
    return styles;
  }

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private cdr: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.cdr.detectChanges();
    this.loadComponent();
    this.stateEvents.emit('show');
  }
  ngAfterViewInit() {
  }

  closeModal() {
    this.isShow = false;
    this.stateEvents.emit('hide');
  }

  loadComponent() {
    const adItem = this.properties;
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(adItem.component);
    const viewContainerRef = this.adHost.viewContainerRef;

    viewContainerRef.clear();

    const componentRef = viewContainerRef.createComponent(componentFactory);
    (componentRef.instance as AdComponent).modalProperties = this.properties;
    (componentRef.instance as AdComponent).modalData = this.data;

    // Modal events
    if ((componentRef.instance as AdComponent).modalEvents) {
      (componentRef.instance as AdComponent).modalEvents.subscribe((event: any) => {
        this.events.emit(event);
        if (event.close) {
          this.closeModal();
        }
      });
    }
  }
}
