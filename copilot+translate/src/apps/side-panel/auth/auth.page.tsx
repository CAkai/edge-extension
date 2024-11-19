import Logo from "../../../components/logo.component";
import { i18n } from "../../../libs/alias";
import { getThemeProps, themeStorage } from "../../../libs/theme";
import { useStorage } from "../../../packages/storage";

export default function Auth() {
    const theme = useStorage(themeStorage);
    const { textColor, bgColor } = getThemeProps(theme);
    return (
        <>
            <div
                className={`flex min-h-full flex-1 flex-col items-center justify-center px-6 py-12 lg:px-8 ${bgColor}`}>
                <div className="w-full">
                    <Logo />
                    <h2 className={`text-center text-2xl font-bold leading-9 tracking-tight ${textColor}`}>
                        {i18n('loginTitle')}
                    </h2>
                </div>

                <div className="mt-10 w-full">
                    <form className="space-y-6">
                        <div>
                            <button
                                type="submit"
                                style={{ color: '#fff' }}
                                className="flex w-full justify-center rounded-md bg-green-600 px-3 py-1.5 text-sm font-semibold leading-6 shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600">
                                {i18n('login')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}