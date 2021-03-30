import {Component, Input, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ModalConfig} from '../modal.config';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-warning',
  templateUrl: './modal-warning.component.html',
  styleUrls: ['./modal-warning.component.css']
})
export class ModalWarningComponent implements OnInit {
  @Input() public modalConfig: ModalConfig;
  @ViewChild('warningModal') private modalContent: TemplateRef<ModalWarningComponent>;
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
