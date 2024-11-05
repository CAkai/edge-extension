import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import userStore, { UserState, loadFromStorage } from "../store/user.store";

export default function Popup() {
  // useSelector 會自動訂閱 Redux store 的變化，當 store 變化時，會重新渲染元件
    const user = useSelector((state: UserState) => state.user);
    useEffect(() => {
        userStore.dispatch(loadFromStorage());
    }, []);
  const [count, setCount] = useState(0);

  return (
    <>
      <h1>{chrome.i18n.getMessage("welcomeToICloudExtension")}</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          token is {user.access_token}
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}
