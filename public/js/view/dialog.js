/**
 * Dialog overlay.
 */

const defaults = {
  header: '', 
  body: '',
  resolve: '',
  reject: '',
  resolveCb: null,
  rejectCb: null,
};

let dialogEl,
  headerEl,
  bodyEl,
  resolveBtnEl,
  rejectBtnEl,
  resolveBtnCallback,
  rejectBtnCallback;

function setup() {
  dialogEl = document.querySelector('.dialog');
  headerEl = dialogEl.querySelector('.dialog__header .header__label');
  bodyEl = dialogEl.querySelector('.dialog__body');
  resolveBtnEl = dialogEl.querySelector('.dialog__resolve');
  rejectBtnEl = dialogEl.querySelector('.dialog__reject');
  resolveBtnEl.addEventListener('click', e => {
    dialogEl.dataset.show = false;
    resolveBtnCallback && resolveBtnCallback();
  });
  rejectBtnEl.addEventListener('click', e => {
    dialogEl.dataset.show = false;
    rejectBtnCallback && rejectBtnCallback();
  });
}

export function showDialog(options) {
  const settings = { ...defaults, ...options };

  if (!dialogEl) {
    setup();
  }

  dialogEl.dataset.show = true;
  headerEl.innerHTML = settings.header;
  bodyEl.innerHTML = settings.body;
  resolveBtnEl.innerHTML = settings.resolve;
  rejectBtnEl.innerHTML = settings.reject;
  resolveBtnCallback = settings.resolveCb;
  rejectBtnCallback = settings.rejectCb;
  resolveBtnEl.style.display = settings.resolve != '' ? 'block' : 'none';
  rejectBtnEl.style.display = settings.reject != '' ? 'block' : 'none';
}
