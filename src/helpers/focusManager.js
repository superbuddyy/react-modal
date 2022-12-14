import findTabbable from "../helpers/tabbable";

let focusLaterElements = [];
let modalElement = null;
let needToFocus = false;

/* eslint-disable no-console */
/* istanbul ignore next */
export function resetState() {
  focusLaterElements = [];
}

/* istanbul ignore next */
export function log() {
  if (process.env.NODE_ENV !== "production") {
    console.log("focusManager ----------");
    focusLaterElements.forEach(f => {
      const check = f || {};
      console.log(check.nodeName, check.className, check.id);
    });
    console.log("end focusManager ----------");
  }
}
/* eslint-enable no-console */

export function handleBlur() {
  needToFocus = true;
}

export function handleFocus() {
  if (needToFocus) {
    needToFocus = false;
    if (!modalElement) {
      return;
    }
    // need to see how jQuery shims document.on('focusin') so we don't need the
    // setTimeout, firefox doesn't support focusin, if it did, we could focus
    // the element outside of a setTimeout. Side-effect of this implementation
    // is that the document.body gets focus, and then we focus our element right
    // after, seems fine.
    setTimeout(() => {
      if (modalElement.contains(document.activeElement)) {
        return;
      }
      const el = findTabbable(modalElement)[0] || modalElement;
      el.focus();
    }, 0);
  }
}

export function markForFocusLater() {
  focusLaterElements.push(document.activeElement);
}

/* eslint-disable no-console */
export function returnFocus(preventScroll = false) {
  let toFocus = null;
  try {
    if (focusLaterElements.length !== 0) {
      toFocus = focusLaterElements.pop();
      toFocus.focus({ preventScroll });
    }
    return;
  } catch (e) {
    console.warn(
      [
        "You tried to return focus to",
        toFocus,
        "but it is not in the DOM anymore"
      ].join(" ")
    );
  }
}
/* eslint-enable no-console */

export function popWithoutFocus() {
  focusLaterElements.length > 0 && focusLaterElements.pop();
}

export function setupScopedFocus(element) {
  modalElement = element;

  if (window.addEventListener) {
    window.addEventListener("blur", handleBlur, false);
    document.addEventListener("focus", handleFocus, true);
  } else {
    window.attachEvent("onBlur", handleBlur);
    document.attachEvent("onFocus", handleFocus);
  }
}

export function teardownScopedFocus() {
  modalElement = null;

  if (window.addEventListener) {
    window.removeEventListener("blur", handleBlur);
    document.removeEventListener("focus", handleFocus);
  } else {
    window.detachEvent("onBlur", handleBlur);
    document.detachEvent("onFocus", handleFocus);
  }
}
