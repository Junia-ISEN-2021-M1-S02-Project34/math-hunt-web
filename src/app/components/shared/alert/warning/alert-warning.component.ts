import {Component, Input, OnInit} from '@angular/core';
import {AlertConfig} from '../alert.config';

@Component({
  selector: 'app-alert-warning',
  templateUrl: './alert-warning.component.html',
  styleUrls: ['./alert-warning.component.css']
})

export class AlertWarningComponent implements OnInit {
  @Input() public alertConfig: AlertConfig | undefined;

  constructor() { }

  ngOnInit(): void {
  }

}
