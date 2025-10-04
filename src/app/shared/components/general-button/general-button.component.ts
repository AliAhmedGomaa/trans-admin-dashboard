import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-general-button',
  standalone: true,
  templateUrl: './general-button.component.html',
  styleUrls: ['./general-button.component.scss'],
  imports: [RouterLink, CommonModule, MatIconModule],
})
export class GeneralButtonComponent implements OnInit {
  @Input() route!: string;
  @Input() title!: string;
  @Input() icon!: string;
  @Input() size!: string;
  @Input() disabled: boolean = false;
  @Output() btnClicked = new EventEmitter<boolean>();

  activePath: string = '';

  ngOnInit() { }

  buttonClicked() {
    if (!this.disabled) {
      this.btnClicked.emit(true);
    }
  }
}
