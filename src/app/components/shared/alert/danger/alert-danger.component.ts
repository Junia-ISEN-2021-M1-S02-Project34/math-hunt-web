import {Component, Input, OnInit} from '@angular/core';
import {AlertConfig} from '../alert.config';

@Component({
  selector: 'app-alert-danger',
  templateUrl: './alert-danger.component.html',
  styleUrls: ['./alert-danger.component.css']
})

export class AlertDangerComponent implements OnInit {
  @Input() public alertConfig: AlertConfig | undefined;

  constructor() { }

  ngOnInit(): void {
  }

}
