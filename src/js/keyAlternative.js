import { Key } from './key';

// eslint-disable-next-line import/prefer-default-export
export class KeyAlternative extends Key {
  constructor(
    text = { en: 'a', ru: 'а' },
    width = 'base-width',
    lang = 'en',
    altText = { en: 'A', ru: 'А' },
    code = 'KeyA',
  ) {
    super(text, width, lang, altText, code);
  }

  shift() {
    [this.text, this.altText] = [this.altText, this.text];
    this.changeText();
    this.node.classList.toggle('shift');
  }

  caps() {
    this.node.classList.toggle('shift');
  }
}
