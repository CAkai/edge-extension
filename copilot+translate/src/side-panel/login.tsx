import { useForm } from "react-hook-form";
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import themeStore from "../store/theme.store";
import userStore, { saveToStorage } from "../store/user.store";


// 定義登入請求的資料格式
const LoginRequestSchema = z.object({
    username: z.string().regex(new RegExp(/^(000\d{5}|[zZ]\d{4})$/), { message: chrome.i18n.getMessage("empidError") }),
    password: z.string(),
});

type LoginRequest = z.infer<typeof LoginRequestSchema>;

const submit = (data: LoginRequest) => {
    fetch(`${import.meta.env.VITE_ICLOUD_URL}api/v1/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        userStore.dispatch(saveToStorage(data));
        console.log("登入成功");
    })
    .catch(console.error);
};

export default function Login() {
  const isLight = (themeStore.getState().theme as string) === "light";  // 如果直接寫 store.getState().theme 會報錯，因為 TypeScript 不知道 store.getState().theme 是什麼型別
  const textColor = isLight ? 'text-gray-900' : 'text-gray-100';
  const bgColor = isLight ? 'bg-slate-50': 'bg-gray-800';

  const {
      register,
      handleSubmit,
      formState: { errors },
  } = useForm<LoginRequest>({
      resolver: zodResolver(LoginRequestSchema),
  });
  return (
      <>
          <div className={`flex min-h-full flex-1 flex-col items-center justify-center px-6 py-12 lg:px-8 ${bgColor}`}>
              <div className="w-full">
                  <img
                      alt="UMC"
                      src={chrome.runtime.getURL('icon-128.png')}
                      style={{ height: '20vmin' }}
                      className=" mx-auto w-auto"
                  />
                  <h2 className={`text-center text-2xl font-bold leading-9 tracking-tight ${textColor}`}>
                      {chrome.i18n.getMessage("signInTitle")}
                  </h2>
              </div>

              <div className="mt-10 w-full">
                  <form onSubmit={handleSubmit(submit)} className="space-y-6">
                      <div>
                          <div className="flex items-center justify-between">
                              <label htmlFor="empid" className={`block text-sm font-medium leading-6 ${textColor}`}>
                                  {chrome.i18n.getMessage("empid")}
                              </label>
                          </div>
                          <div className="mt-2">
                              <input
                                  {...register('username')}
                                  className="block w-full rounded-md border-0 py-1.5 px-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                              />
                          </div>
                          {errors.username && <p className="text-red-500 text-xs text-left mt-1">{errors.username.message}</p>}
                      </div>
                      <div>
                          <div className="flex items-center justify-between">
                              <label htmlFor="password" className={`block text-sm font-medium leading-6 ${textColor}`}>
                                  {chrome.i18n.getMessage("password")}
                              </label>
                          </div>
                          <div className="mt-2">
                              <input
                                  {...register('password')}
                                  type="password"
                                  className="block w-full rounded-md border-0 py-1.5 px-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                              />
                          </div>
                      </div>

                      <div>
                          <button
                              type="submit"
                              style={{ color: '#fff' }}
                              className="flex w-full justify-center rounded-md bg-green-600 px-3 py-1.5 text-sm font-semibold leading-6 shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
                          >
                              {chrome.i18n.getMessage("signIn")}
                          </button>
                      </div>
                  </form>
              </div>
          </div>
      </>
  )
}
