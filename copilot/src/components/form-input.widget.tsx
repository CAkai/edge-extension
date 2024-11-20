import { FieldError, FieldErrorsImpl, Merge, UseFormRegisterReturn } from 'react-hook-form';

export type FormInputProps = {
    label: string;
    formFor: string;
    textColor: string;
    className?: string;
    type?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error?: string | FieldError | Merge<FieldError, FieldErrorsImpl<any>>;
    register?: UseFormRegisterReturn<string>;
}

export default function FormInput({label, className="", textColor, type="text", error, register}: FormInputProps) {
    return (
        <div className={className} key={crypto.randomUUID()}>
            <label className={`block text-sm font-medium leading-6 pb-[1px] ${textColor}`}>
                    {label}
                </label>
            <div>
                <input
                    {...register}
                    type={type}
                    className="block w-full text-base rounded-md border-0 py-1.5 px-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
            </div>
            <div className="mt-1 h-[16px] min-w-1">
            {error !== "" && (
                <p className="text-red-500 text-xs text-left mt-1">{error?.toString()}</p>
            )}
            </div>
        </div>
    );
}