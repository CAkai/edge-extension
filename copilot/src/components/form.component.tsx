import { zodResolver } from '@hookform/resolvers/zod';
import {Children, isValidElement, cloneElement} from "react";
import { useForm } from "react-hook-form";
import { z } from 'zod';

interface ComponentProps {
    submit: (result: z.infer<z.AnyZodObject>) => void;
    schema: z.AnyZodObject;
    className?: string;
    children: React.ReactNode;
};

export default function Form({ schema, submit, children, className="" }: ComponentProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
    });

    return (
        <form className={className} onSubmit={handleSubmit((result) => submit(result))}>
            {Children.map(children, (child) => {
                // 複製子元素，並加入 register 與 error props
                if (isValidElement(child)) {
                    const childProps = {
                        ...child.props,
                        register: child.props.formFor ? register(child.props.formFor) : undefined,
                        error: child.props.formFor ? errors[child.props.formFor]?.message?.toString() ?? child.props.error : child.props.error,
                    };
                    return cloneElement(child, {
                        ...childProps,
                    });
                }
                return child;
            })}
        </form>
    )
}