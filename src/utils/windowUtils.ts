export function safelyInteractWithWindow(windowRef: Window | null) {
  if (windowRef && !windowRef.closed) {
    // Perform your interaction here
    windowRef.focus();
  } else {
    console.warn('Attempted to interact with a closed window');
  }
}
