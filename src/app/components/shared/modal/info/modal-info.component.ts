import {Component, Injectable, Input, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ModalConfig} from '../modal.config';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-info',
  templateUrl: './modal-info.component.html',
  styleUrls: ['./modal-info.component.css']
})
@Injectable()
export class ModalInfoComponent implements OnInit {
  @Input() public modalConfig: ModalConfig;
  @ViewChild('infoModal') private modalContent: TemplateRef<ModalInfoComponent>;
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
