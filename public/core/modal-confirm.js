export default class ModalConfirm {
  static defaults = {
    title: '',
    message: '',
    buttonConfirmLabel: i18next.t('OK'),
    buttonCancelLabel: i18next.t('Abbrechen'),
    buttonConfirmClass: 'btn-danger',
    buttonCancelClass: 'btn-secondary',
    onConfirm: function() {},
    onCancel: function() {},
  }

  static show(args) {
    ModalConfirm.settings = Object.assign(ModalConfirm.defaults, args);

    ModalConfirm.element = document.createElement('div');
    ModalConfirm.element.classList.add('modal', 'fade');
    ModalConfirm.element.innerHTML = ModalConfirm.template;

    document.body.appendChild(ModalConfirm.element);

    ModalConfirm.element.querySelector('.button-confirm').addEventListener('click', ModalConfirm.settings.onConfirm);
    ModalConfirm.element.querySelector('.button-cancel').addEventListener('click', ModalConfirm.settings.onCancel);

    ModalConfirm.modal = new bootstrap.Modal(ModalConfirm.element);
    ModalConfirm.modal.show();
  }

  static hide() {
    ModalConfirm.modal.hide();
  }

  static get template() {
    return /*html*/`
      <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content">
          <div class="modal-header">
              <h5 class="modal-title">${ModalConfirm.settings.title}</h5>
          </div>
          <div class="modal-body">
            <p>${ModalConfirm.settings.message}</p>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn button-cancel ${ModalConfirm.settings.buttonCancelClass}"
              data-bs-dismiss="modal"
            >${ModalConfirm.settings.buttonCancelLabel}</button>
            <button
              type="button"
              class="btn button-confirm ${ModalConfirm.settings.buttonConfirmClass}"
            >${ModalConfirm.settings.buttonConfirmLabel}</button>
          </div>
        </div>
      </div>
    `;
  }
}