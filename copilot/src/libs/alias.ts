/**
 * alias.ts 是一個簡單的別名檔案，用來簡化 import 的路徑、引入的模組或者函數。
 */
export const i18n = chrome.i18n.getMessage;
export const notify = chrome.runtime.sendMessage;
export const observe = chrome.runtime.onMessage.addListener;