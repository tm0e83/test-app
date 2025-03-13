import Component from './component.js';

export default class ModalConfirm {
  static show(title, message, onConfirm, onCancel) {
    this.title = title ?? 'Löschen?';
    this.message = message ?? 'Soll die Rechnung wirklich gelöscht werden?';
    this.onConfirm = onConfirm ?? function() {};
    this.onCancel = onCancel ?? function() {};

    this.element = document.createElement('div');
    this.element.classList.add('modal', 'fade');
    this.element.innerHTML = this.template;

    this.element.querySelector('.btn-danger').addEventListener('click', this.onConfirm.bind(this));
    this.element.querySelector('.btn-secondary').addEventListener('click', this.onCancel.bind(this));
  }

  get template() {
    return /*html*/`
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
              <h5 class="modal-title">Löschen?</h5>
          </div>
          <div class="modal-body">
            <p>Soll die Rechnung wirklich gelöscht werden?</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Abbrechen</button>
            <button type="button" class="btn btn-danger">Löschen</button>
          </div>
        </div>
      </div>
    `;
  }
}