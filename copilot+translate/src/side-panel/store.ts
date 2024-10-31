import { configureStore } from "@reduxjs/toolkit";
import { Message } from "./message";

const initialState: {messages: Message[]} = {
  messages: []
};

// 由 reducer 回傳 state
function reducer(state = initialState, action) {
  switch (action.type) {
    // return 新的 state 並取代原本的
    case 'push': {
      return {messages: state.messages.concat(action.message)};
    }
    // 非預期指令時則丟出 Error
    default:
      throw new Error();
  }
}

export const store = configureStore(reducer);
