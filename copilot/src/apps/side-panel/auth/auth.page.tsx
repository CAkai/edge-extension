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

export default function Auth() {
    const theme = useStorage(themeStorage);
    const { textColor, bgColor } = getThemeProps(theme);
    const [error, setError] = useState<string>("");
    navStorage.set("side-panel/auth");

    const handleSubmiit = async (data: {[key: string]: string}) => {
        const user = await userStorage.logInCloud(data as iCloudLoginForm);
        if (!user.icloud.access_token) {
            setError(i18n("loginError"));
        } else {
            setError("");
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
                <Form schema={iCloudLoginFormSchema} submit={handleSubmiit}>
                    <FormInput formFor="username" label={i18n("empid")} textColor={textColor} error={error} />
                    <FormInput className="mt-2" formFor="password" label={i18n("password")} type="password" textColor={textColor} error={error} />
                    <button
                        type="submit"
                        style={{ color: '#fff' }}
                        className="flex w-full justify-center rounded-md bg-green-600 px-3 py-1.5 mt-3 text-sm font-semibold leading-6 shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600">
                        {i18n('login')}
                    </button>
                </Form>
            </div>
        </div>
    );
}