import { useState } from "react";
import FormInput from "../../../components/form-input.widget";
import Form from "../../../components/form.component";
import Logo from "../../../components/logo.widget";
import { i18n } from "../../../libs/alias";
import { navStorage } from "../../../libs/navigation";
import { getThemeProps, themeStorage } from "../../../libs/theme";
import { userStorage } from "../../../libs/user";
import { iCloudLoginForm, iCloudLoginFormSchema } from "../../../libs/user/user.api";
import { useStorage } from "../../../packages/storage";
import LoadingIcon from "../../../components/loading.widget";

export default function Auth() {
    const theme = useStorage(themeStorage);
    const { textColor, bgColor } = getThemeProps(theme);
    const [loginError, setLoginError] = useState<string>("");
    const [isLogining, setIsLogining] = useState<boolean>(false);
    navStorage.set("side-panel/auth");

    const handleSubmit = async (data: { [key: string]: string }) => {
        setIsLogining(true);
        const user = await userStorage.logInCloud(data as iCloudLoginForm);
        setIsLogining(false);
        if (!user.icloud.access_token || !user.webui.token) {
            setLoginError(i18n("loginError"));
        } else {
            setLoginError("");
        }
    }

    return (
        <div
            className={`flex min-h-full flex-1 flex-col items-center justify-center px-6 py-12 lg:px-8 ${bgColor}`}>
            <div className="w-full">
                <Logo />
                <h2 className={`text-center text-2xl font-bold leading-9 tracking-tight ${textColor}`}>
                    {i18n('loginTitle')}
                </h2>
            </div>
            <div className="mt-10 w-full">
                <Form schema={iCloudLoginFormSchema} submit={handleSubmit}>
                    <FormInput formFor="username" label={i18n("empid")} textColor={textColor} error={loginError} disabled={isLogining} />
                    <FormInput className="mt-2" formFor="password" label={i18n("password")} type="password" textColor={textColor} error={loginError} disabled={isLogining} />
                    {isLogining ? (
                        // button.py-1.5 的高度是 36px，但 div.py-1.5 只有 32px。為了視覺效果，所以改成 py-2
                        <div className="flex items-center gap-2 justify-center rounded-md bg-green-500 px-3 py-2 mt-3 leading-6 shadow-sm">
                            <p className="cursor-default text-white text-sm font-semibold">{i18n("logining")}</p>
                            <LoadingIcon />
                        </div>
                    ) :(
                    <button
                        type="submit"
                        style={{ color: '#fff' }}
                        className="flex w-full justify-center rounded-md bg-green-600 px-3 py-1.5 mt-3 text-sm font-semibold leading-6 shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600">
                        {i18n('login')}
                    </button>
                    )}
                </Form>
            </div>
        </div>
    );
}