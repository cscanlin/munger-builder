export const log = (logMessage) => {
  if (window.location.hostname === '127.0.0.1') {
    console.log(logMessage)
  }
}
