import CloseIcon from '../../public/svg/close.svg?react';

type ImageButtonProps = {
    src: string;
    alt: string;
    onClick?: () => void;
};

export default function ImageButton({ src, alt, onClick = () => {} }: ImageButtonProps) {
    return (
        // group 是 tailwindcss 的 class，用來讓子元素可以共用 parent 的 hover 效果
        <div className="relative group" key={crypto.randomUUID()}>
                <img src={src} alt={alt} className="h-16 w-16 rounded-xl object-cover"></img>
            <div className="absolute -top-1 -right-1">
                <button
                    type='button'
                    className="bg-gray-400 text-white border border-white rounded-full group-hover:visible invisible transition"
                    onClick={onClick}>
                    <CloseIcon />
                </button>
            </div>
        </div>
    );
}
