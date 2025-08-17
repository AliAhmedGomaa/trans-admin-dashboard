import {
  AfterViewInit,
  Directive,
  ElementRef,
  Host,
  Input,
  OnChanges,
  Optional,
  Renderer2,
  Self,
  SimpleChanges,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';

@Directive({
  selector: '[appCustomTablePagination]',
  standalone: true,
})
export class CustomTablePagination implements AfterViewInit, OnChanges {
  @Input() paginationData!: any;
  @Input() maxSize!: any;
  paginationNumbersContainerRef!: HTMLElement;
  buttonsRef: any[] = [];
  neededButtons = 0;
  buttonsBuilt = false;

  mid = 0;
  selected = 1;
  currentActiveRef!: any;

  firstButton: any;
  lastButton: any;

  constructor(
    @Host() @Self() @Optional() private readonly matPag: MatPaginator,
    private elRef: ElementRef,
    private ren: Renderer2
  ) {}

  ngAfterViewInit(): void {
    this.styleDefaultPagination();
    this.createPaginationContainer();
    this.nextClickListener();
    this.previousClickListener();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // this.paginationData.total = 200

    this.paginationData = changes['paginationData']?.currentValue;
    this.matPag.length = this.paginationData.total;
    if (this.paginationData.total && !this.buttonsBuilt) {
      this.buildButtons();
      this.buttonsBuilt = true;
    }
  }

  styleDefaultPagination() {
    const nativeElement = this.elRef.nativeElement;
    const itemsPerPage = nativeElement.querySelector(
      '.mat-mdc-paginator-page-size'
    );

    const howManyDisplayedEl = nativeElement.querySelector(
      '.mat-mdc-paginator-range-label'
    );

    // remove 'items per page and count'
    this.ren.setStyle(itemsPerPage, 'display', 'none');
    this.ren.setStyle(howManyDisplayedEl, 'display', 'none');
  }

  createPaginationContainer() {
    const nextPrevContainer = this.elRef.nativeElement.querySelector(
      '.mat-mdc-paginator-range-actions'
    );

    const nextBtn = nextPrevContainer.querySelector(
      'button.mat-mdc-paginator-navigation-next'
    );

    this.paginationNumbersContainerRef = this.ren.createElement(
      'div'
    ) as HTMLElement;
    this.ren.addClass(
      this.paginationNumbersContainerRef,
      'pagination-container'
    );

    this.ren.insertBefore(
      nextPrevContainer,
      this.paginationNumbersContainerRef,
      nextBtn
    );
  }

  private buildButtons(): void {
    this.neededButtons = Math.ceil(
      this.paginationData?.total / this.matPag.pageSize
    );

    // if there is only one page, do not render buttons
    if (this.neededButtons === 1) {
      this.ren.setStyle(this.elRef.nativeElement, 'display', 'none');
      return;
    }

    // create all buttons needed for navigation (except the first & last one)
    this.mid = this.maxSize / 2;
    let roundNumber = 0;
    let loopBegin = 0;
    let loopEnd = 0;

    // for (let index = 1; index < this.maxSize - 2; index++) {
    for (let index = 0; index < this.maxSize - 2; index++) {
      const createdButtonRef = this.createButton(index);

      if (index === 0) {
        this.firstButton = this.currentActiveRef = createdButtonRef;
        this.ren.addClass(this.firstButton, 'active');
        this.buttonsRef = [this.firstButton];
      }

      if (index >= this.mid) {
        this.ren.listen(createdButtonRef, 'click', () => {
          roundNumber = (this.maxSize - 5) / 2;
          this.selected = index + 1;
          if (roundNumber % 2 == 0) {
            loopBegin = this.selected - Math.floor(roundNumber);
            loopEnd = this.selected + Math.ceil(roundNumber);
          } else {
            loopBegin = Math.ceil(this.selected - roundNumber);
            loopEnd = Math.ceil(this.selected + roundNumber);
          }
          this.renderBeginEndDots(loopBegin, loopEnd);
        });
      }

      if (index > this.maxSize - 3 && this.maxSize >= 3) {
        this.ren.setStyle(createdButtonRef, 'display', 'none');
      }
      this.buttonsRef = [...this.buttonsRef, createdButtonRef];
    }

    if (this.neededButtons >= this.maxSize && this.maxSize >= 3) {
      this.lastButton = this.createButton(this.neededButtons - 1);
      this.buttonsRef = [
        this.firstButton,
        ...this.buttonsRef,
        this.createDots(),
        this.lastButton,
      ];
    } else {
      this.lastButton = this.buttonsRef[this.buttonsRef.length - 1];
    }

    this.renderAllButtons();
  }

  private createButton(i: number): any {
    const button = this.ren.createElement('div');
    const text = this.ren.createText(String(i + 1));

    this.ren.addClass(button, 'pagination-number');
    this.ren.appendChild(button, text);

    this.ren.listen(button, 'click', () => {
      this.switchPage(i + 1);
    });

    return button;
  }

  private switchPage(i: number): void {
    this.ren.removeClass(this.currentActiveRef, 'active');

    const clickedButton =
      i == this.neededButtons - 1 ? this.lastButton : this.buttonsRef[i + 1];

    this.ren.addClass(clickedButton, 'active');
    this.currentActiveRef = clickedButton;

    const previousPageIndex = this.matPag.pageIndex;
    this.matPag.pageIndex = i;
    this.matPag['_emitPageEvent'](previousPageIndex);
  }

  createDots() {
    const button = this.ren.createElement('div');
    const text = this.ren.createText('...');

    this.ren.addClass(button, 'pagination-dots');
    this.ren.appendChild(button, text);

    return button;
  }

  nextClickListener() {
    const nextButton = this.elRef.nativeElement.querySelector(
      '.mat-mdc-paginator-navigation-next'
    );

    this.ren.listen(nextButton, 'click', () => {
      this.switchPage(this.matPag.pageIndex);
    });
  }

  previousClickListener() {
    const nextButton = this.elRef.nativeElement.querySelector(
      '.mat-mdc-paginator-navigation-previous'
    );

    this.ren.listen(nextButton, 'click', () => {
      this.switchPage(this.matPag.pageIndex);
    });
  }

  renderBeginEndDots(begin: number, end: number) {
    const currentButtons: any[] = [];

    for (let index = begin; index < end; index++) {
      currentButtons.push(this.createButton(index));
    }
  }

  renderAllButtons() {
    for (let button of this.buttonsRef) {
      if (this.paginationNumbersContainerRef)
        this.ren.appendChild(this.paginationNumbersContainerRef, button);
    }
  }
}
