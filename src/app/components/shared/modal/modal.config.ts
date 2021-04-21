export interface ModalConfig {
  modalTitle: string;
  modalText: string;
  dismissButtonLabel: string;
  actionButtonLabel: string;
  hideDismissButton?: boolean;
  hideActionButton?: boolean;
  closeAfterXSeconds?: number;
  bootstrapIcon?: string;
  size?: string;
}
