import FileIcon from "../../public/svg/file.svg?react";

type FileButtonProps = {
    name: string;
    size: number;
}

function calculateSize(size: number): string {
    if (size < 1024) {
        return `${size} B`;
    } else if (size < 1024 * 1024) {
        return `${(size / 1024).toFixed(1)} KB`;
    } else {
        return `${(size / 1024 / 1024).toFixed(1)} MB`;
    }
}

export default function FileButton({ name, size }: FileButtonProps) {
    return (
        <div className="self-end">
            <button className="relative group p-1.5 w-60 flex items-center bg-white dark:bg-gray-850  rounded-2xl text-left" type="button">
                <div className="p-3 bg-black/20 dark:bg-white/10 text-white rounded-xl">
                    <FileIcon />
                </div>
                <div className="flex flex-col justify-center -space-y-0.5 ml-1 px-2.5 w-full">
                    <div className="dark:text-gray-100 text-sm font-medium line-clamp-1 mb-1">
                        {name}
                    </div>
                    <div className="flex justify-between text-gray-500 text-xs line-clamp-1">
                        File
                        <span className="capitalize">{calculateSize(size)}</span>
                    </div>
                </div>
            </button>
        </div>);
}