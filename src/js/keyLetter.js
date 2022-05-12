import {Key} from "./key";

export class KeyLetter extends Key {
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
    this.node.classList.toggle('shift');
  }

  caps() {
    this.node.classList.toggle('shift');
  }
}
