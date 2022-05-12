export class Key {
  constructor(
    text = {en: 'a', ru: 'а'},
    width = 'base-width',
    lang = 'en',
    altText = {en: 'A', ru: 'А'},
    code = 'KeyA',
  ) {
    this.node = null;
    this.text = text;
    this.width = width;
    this.lang = lang;
    this.altText = altText;
    this.code = code;
  }

  init() {
    this.node = document.createElement('button');
    this.node.classList.add('keyboard__key');
    this.node.dataset.button = this.text.en;
    switch (this.width) {
      case 'base-width':
        this.node.classList.add('keyboard__key_base-width');
        break;
      case 'mid-width':
        this.node.classList.add('keyboard__key_mid-width');
        break;
      case 'large-width':
        this.node.classList.add('keyboard__key_large-width');
        break;
      case 'space-width':
        this.node.classList.add('keyboard__key_space-width');
        break;
      default:
        break;
    }

    this.changeText();
  }

  changeText() {
    this.node.innerHTML = this.text[this.lang];
  }

  changeLanguage(lang) {
    this.lang = lang;
    this.changeText();
  }

  shift() {
    this.node.classList.remove('shift');
  }

  caps() {
    this.node.classList.remove('shift');
  }
}

