import {Component, Input, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ModalConfig} from '../modal.config';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {ModalInfoComponent} from '../info/modal-info.component';

@Component({
  selector: 'app-modal-primary',
  templateUrl: './modal-primary.component.html',
  styleUrls: ['./modal-primary.component.css']
})
export class ModalPrimaryComponent implements OnInit {
  @Input() public modalConfig: ModalConfig;
  @ViewChild('primaryModal') private modalContent: TemplateRef<ModalInfoComponent>;
  private modalRef: NgbModalRef;

  constructor(private modalService: NgbModal) { }

  ngOnInit(): void {
  }

  open(): Promise<string> {
    return new Promise<string>(resolve => {
      this.modalRef = this.modalService.open(this.modalContent, {animation: true, backdrop: true, size: this.modalConfig.size});
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
