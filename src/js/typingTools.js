import { objKeys } from './objKeys.js';

function isCaps(code) {
  return [objKeys.capsKey, objKeys.capsKeyCode].includes(code);
}

function isShift(code) {
  return [objKeys.shiftKey, objKeys.shiftLeftKey, objKeys.shiftRightKey].includes(code);
}

function isCtrl(code) {
  return [objKeys.controlLeftKey, objKeys.controlRightKey].includes(code);
}

function isArrow(code) {
  return [objKeys.arrowUp, objKeys.arrowLeft, objKeys.arrowDown, objKeys.arrowRight].includes(code);
}

function isRepeat(code, e) {
  return (isShift(code) || isCaps(code) || isCtrl(code)) && e.repeat;
}

function isLayoutKeys(func, ...combinations) {
  const pressed = new Set();

  document.addEventListener('keydown', (event) => {
    pressed.add(event.code);
    combinations.forEach((combination) => {
      if (pressed.has(combination[0]) && pressed.has(combination[1])) {
        pressed.clear();
        func(event);
      }
    });
  });

  document.addEventListener('keyup', (event) => {
    pressed.delete(event.code);
  });
}

export {
  isCaps, isShift, isLayoutKeys, isArrow, isCtrl, isRepeat,
};
