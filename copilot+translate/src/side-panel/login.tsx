import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { useForm } from "react-hook-form";
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// 定義登入請求的資料格式
const loginRequestSchema = z.object({
    username: z.string().regex(new RegExp(/^(000\d{5}|[zZ]\d{4})$/), { message: chrome.i18n.getMessage("empidError") }),
    password: z.string(),
});

type LoginRequest = z.infer<typeof loginRequestSchema>;

const submit = (d: LoginRequest) => { console.log(d) };

export default function Login() {
  const isLight = true;

  const {
      register,
      handleSubmit,
      formState: { errors },
  } = useForm<LoginRequest>({
      resolver: zodResolver(loginRequestSchema),
  });

  return (
      <>
          <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
              <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                  <img
                      alt="UMC"
                      src={chrome.runtime.getURL('icon-128.png')}
                      style={{ height: '20vmin' }}
                      className=" mx-auto w-auto"
                  />
                  <h2 className={`text-center text-2xl font-bold leading-9 tracking-tight ${isLight ? 'text-gray-900' : 'text-gray-100'}`}>
                      {chrome.i18n.getMessage("signInTitle")}
                  </h2>
              </div>

              <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                  <form onSubmit={handleSubmit(submit)} className="space-y-6">
                      <div>
                          <div className="flex items-center justify-between">
                              <label htmlFor="empid" className={`block text-sm font-medium leading-6 ${isLight ? 'text-gray-900' : 'text-gray-100'}`}>
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
                              <label htmlFor="password" className={`block text-sm font-medium leading-6 ${isLight ? 'text-gray-900' : 'text-gray-100'}`}>
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

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Login />
  </StrictMode>,
);
