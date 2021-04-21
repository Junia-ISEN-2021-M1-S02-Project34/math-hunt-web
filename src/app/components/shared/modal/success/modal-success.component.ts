import {Component, Input, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ModalConfig} from '../modal.config';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {ModalDangerComponent} from '../danger/modal-danger.component';

@Component({
  selector: 'app-modal-success',
  templateUrl: './modal-success.component.html',
  styleUrls: ['./modal-success.component.scss']
})

export class ModalSuccessComponent implements OnInit {
  @Input() public modalConfig: ModalConfig;
  @ViewChild('successModal') private modalContent: TemplateRef<ModalDangerComponent>;
  private modalRef: NgbModalRef;

  constructor(private modalService: NgbModal) { }

  ngOnInit(): void {
  }

  open(): Promise<string> {
    return new Promise<string>(resolve => {
      this.modalRef = this.modalService.open(this.modalContent, {animation: true, centered: true, size: this.modalConfig.size});
      setTimeout( () => {
        this.close();
      }, this.modalConfig.closeAfterXSeconds * 1000);
      this.modalRef.result.then(resolve, resolve);
    });
  }

  close(): void {
    this.modalRef.close();
  }

}
