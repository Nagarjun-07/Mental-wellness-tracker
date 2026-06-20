/* eslint-disable @typescript-eslint/no-explicit-any, no-var */
interface Window {
  SpeechRecognition: any;
  webkitSpeechRecognition: any;
}

declare var window: Window;
