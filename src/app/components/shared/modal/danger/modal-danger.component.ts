import {Component, Injectable, Input, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {ModalConfig} from '../modal.config';

@Component({
  selector: 'app-modal-danger',
  templateUrl: './modal-danger.component.html',
  styleUrls: ['./modal-danger.component.css']
})

export class ModalDangerComponent implements OnInit {
  @Input() public modalConfig: ModalConfig;
  @ViewChild('dangerModal') private modalContent: TemplateRef<ModalDangerComponent>;
  private modalRef: NgbModalRef;

  constructor(private modalService: NgbModal) { }

  ngOnInit(): void {
  }

  open(): Promise<string> {
    return new Promise<string>(resolve => {
      this.modalRef = this.modalService.open(this.modalContent, {animation: true, backdrop: 'static', keyboard: false, size: this.modalConfig.size});
      this.modalRef.result.then(resolve, resolve);
    });
  }

  async dismiss(): Promise<void> {
    this.modalRef.close(this.modalConfig.dismissButtonLabel);
  }

  async action(): Promise<void> {
    this.modalRef.dismiss(this.modalConfig.actionButtonLabel);
  }

}
