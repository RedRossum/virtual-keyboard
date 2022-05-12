import {KeyAlternative} from "./js/keyAlternative";
import {Key} from "./js/key";
import {KeyLetter} from "./js/keyLetter";
import {keys} from "./js/keys";
import * as typingTools from './js/typingTools.js';
import {objKeys} from './js/objKeys.js';
import './main.scss';

class Keyboard {
  constructor() {
    this.capsLock = false;
    this.shift = false;
    this.mouseShift = false;
    this.nodeShift = null;
    this.keys = [];
    this.lang = localStorage.getItem('lang') || 'en';
    this.textArea = document.createElement('textarea');
  }

  init() {
    const wrapper = document.createElement('div');
    wrapper.classList.add('wrapper');

    const keyboard = document.createElement('div');
    keyboard.classList.add('keyboard');

    const keyboardKeys = document.createElement('div');
    keyboardKeys.classList.add('keyboard__keys');
    keyboardKeys.addEventListener('click', this.clickKey.bind(this));

    const layout = document.createElement('p');
    layout.textContent = `Смена раскладки ${objKeys.ctrlKey} + ${objKeys.shiftKey}`;

    const os = document.createElement('p');
    os.textContent = 'Сделано в Windows';

    this.textArea.classList.add('text');
    keyboardKeys.append(this.createKeys());
    keyboard.append(keyboardKeys);
    wrapper.append(this.textArea, keyboard, layout, os);
    document.body.append(wrapper);

    typingTools.isLayoutKeys(
      this.switchLanguage.bind(this),
      [objKeys.shiftLeftKey, objKeys.controlLeftKey],
      [objKeys.shiftRightKey, objKeys.controlRightKey],
    );

    document.addEventListener('keydown', this.pressKey.bind(this));
    document.addEventListener('keyup', this.removePressKey.bind(this));
  }

  createKeys() {
    const fragment = document.createDocumentFragment();
    let row = document.createElement('div');
    row.classList.add('row');
    for (const key of keys) {
      const {text, width, altText, end, type, code} = key;
      const newKey = createKey(text, width, this.lang, altText, type, code);
      newKey.init();
      if (text.en === objKeys.shiftKey) {
        newKey.node.addEventListener('mousedown', this.shiftMouseDownHandler.bind(this));
        newKey.node.addEventListener('mouseup', this.shiftMouseUpHandler.bind(this));
      }
      this.keys.push(newKey);
      row.append(newKey.node);
      if (end) {
        fragment.append(row);
        row = document.createElement('div');
        row.classList.add('row');
      }
    }
    return fragment;
  }

  clickKey(event) {
    if (event.target.dataset.button) {
      switch (event.target.dataset.button) {
        case objKeys.backspaceKey:
          this.backspaceHandler();
          break;
        case objKeys.tabKey:
          this.tabHandler();
          break;
        case objKeys.delKey:
          this.delHandler();
          break;
        case objKeys.capsKey:
          this.capsHandler(event);
          break;
        case objKeys.enterKey:
          this.enterHandler();
          break;
        case objKeys.shiftKey:
          this.shiftHandler(event);
          break;
        case objKeys.arrowUpKey:
          this.arrowUpHandler();
          break;
        case objKeys.ctrlKey:
          this.ctrlHandler();
          break;
        case objKeys.winKey:
          this.winHandler();
          break;
        case objKeys.altKey:
          this.altHandler();
          break;
        case objKeys.arrowLeftKey:
          this.arrowLeftHandler();
          break;
        case objKeys.arrowDownKey:
          this.arrowDownHandler();
          break;
        case objKeys.arrowRightKey:
          this.arrowRightHandler();
          break;
        default:
          this.typingText(event);
      }
    }
  }

  backspaceHandler() {
    const {value: value, selectionStart: start, selectionEnd: end} = this.textArea;
    if (start !== end) {
      this.textArea.value = `${value.slice(0, start)}${value.slice(end)}`;
      this.setCursorLocation(start);
    } else if (start !== 0) {
      this.textArea.value = `${value.slice(0, start - 1)}${value.slice(start)}`;
      this.setCursorLocation(start - 1);
    } else {
      this.setCursorLocation(start);
    }
  }

  tabHandler() {
    const {value: value, selectionStart: start, selectionEnd: end} = this.textArea;
    this.textArea.value = `${value.substring(0, start)}\t${value.substring(end)}`;
    this.setCursorLocation(start + 1);
  }

  delHandler() {
    const {value: value, selectionStart: start, selectionEnd: end} = this.textArea;
    if (start !== end) {
      this.textArea.value = `${value.slice(0, start)}${value.slice(end)}`;
    } else if (end !== value.length) {
      this.textArea.value = `${value.slice(0, start)}${value.slice(start + 1)}`;
    }
    this.setCursorLocation(start);
  }

  capsHandler(event) {
    const {selectionStart: start} = this.textArea;
    this.capsLock = !this.capsLock;
    event.target.classList.toggle('active');
    for (const key of this.keys) {
      key.caps();
    }
    this.setCursorLocation(start);
  }

  enterHandler() {
    const {value: value, selectionStart: start, selectionEnd: end} = this.textArea;
    this.textArea.value = `${value.substring(0, start)}\n${value.substring(end)}`;
    this.setCursorLocation(start + 1);
  }

  shiftHandler(event) {
    const {selectionStart: start} = this.textArea;
    if (!this.shift || true) {
      this.setShiftedKeys();
      event.target.classList.toggle('active');
    } else if (!event.isTrusted) {
      event.target.classList.toggle('active');
      this.setShiftedKeys();
    }

    this.setCursorLocation(start);
  }

  ctrlHandler() {
    const {selectionStart: start} = this.textArea;
    if (this.shift) {
      this.switchLanguage();
    }
    this.setCursorLocation(start);
  }

  shiftMouseDownHandler(event) {
    if (!this.mouseShift && typingTools.isShift(event.target.textContent)) {
      this.mouseShift = true;
      this.nodeShift = event.target;
      this.shiftMouseHandler();
    }
  }

  shiftMouseUpHandler(event) {
    if (this.mouseShift && typingTools.isShift(event.target.textContent)) {
      this.mouseShift = false;
      this.shiftMouseHandler();
    }
  }

  shiftMouseHandler() {
    const {selectionStart: start} = this.textArea;
    this.nodeShift.classList.toggle('active');
    this.setShiftedKeys();
    this.setCursorLocation(start);
  }

  setShiftedKeys() {
    this.shift = !this.shift;
    for (const key of this.keys) {
      key.shift();
    }
  }

  winHandler() {
    const {selectionStart: start} = this.textArea;
    this.setCursorLocation(start);
  }

  altHandler() {
    const {selectionStart: start} = this.textArea;
    this.setCursorLocation(start);
  }

  arrowUpHandler() {
    this.setCursorLocation(0);
  }

  arrowDownHandler() {
    const {value: value} = this.textArea;
    this.setCursorLocation(value.length);
  }

  arrowLeftHandler() {
    const {selectionStart: start} = this.textArea;
    this.setCursorLocation(start - 1);
  }

  arrowRightHandler() {
    const {selectionStart: start} = this.textArea;
    this.setCursorLocation(start + 1);
  }

  typingText(event) {
    const word = event.target.textContent;
    const {value: value, selectionStart: start, selectionEnd: end} = this.textArea;
    if (this.capsLock && this.shift) {
      this.textArea.value = `${value.substring(0, start)}${word.toLowerCase()}${value.substring(end)}`;
    } else if (this.capsLock || this.shift) {
      this.textArea.value = `${value.substring(0, start)}${word.toUpperCase()}${value.substring(end)}`;
    } else {
      this.textArea.value = `${value.substring(0, start)}${word.toLowerCase()}${value.substring(end)}`;
    }
    this.setCursorLocation(start + 1);
  }

  switchLanguage() {
    this.lang = this.lang === 'en' ? 'ru' : 'en';
    localStorage.setItem('lang', this.lang);
    for (const key of this.keys) {
      key.changeLanguage(this.lang);
    }
  }

  setCursorLocation(location) {
    this.textArea.focus();
    this.textArea.selectionStart = location;
    this.textArea.selectionEnd = location;
  }

  pressKey(event) {
    const key = this.keys.find((i) => i.code === event.code);
    if (key) {
      if (typingTools.isArrow(key.code)) {
        key.node.classList.add('active');
      } else {
        event.preventDefault();

        if (typingTools.isRepeat(key.code, event)) {
          return null;
        }
        if (!typingTools.isCaps(key.code) && !typingTools.isShift(key.code)) {
          key.node.classList.add('active');
        }

        key.node.click();
      }
    }
    return null;
  }

  removePressKey(event) {
    const key = this.keys.find((i) => i.code === event.code);
    if (key) {
      if (typingTools.isArrow(key.code)) {
        key.node.classList.remove('active');
      } else {
        event.preventDefault();

        if (!typingTools.isCaps(key.code) && !typingTools.isShift(key.code)) {
          key.node.classList.remove('active');
        }

        if (typingTools.isShift(key.code)) {
          key.node.click();
        }
      }
    }
    return null;
  }
}

function createKey(text, width, lang, altText, type, code) {
  let key;
  switch (type) {
    case objKeys.alternative:
      key = new KeyAlternative(text, width, lang, altText, code);
      break;
    case objKeys.functional:
      key = new Key(text, width, lang, altText, code);
      break;
    default:
      key = new KeyLetter(text, width, lang, altText, code);
      break;
  }
  return key;
}

window.onload = () => {
  const keyboard = new Keyboard();
  keyboard.init();
};
