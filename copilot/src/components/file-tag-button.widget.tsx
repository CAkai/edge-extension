type FileTagButtonProps = {
    index: number;
    name: string;
}

export default function FileTagButton({ index, name }: FileTagButtonProps) {
    return (
        <button className="no-toggle outline-none flex dark:text-gray-300 p-1 bg-gray-50 hover:bg-gray-100 dark:bg-gray-900 dark:hover:bg-gray-850 transition rounded-xl max-w-96">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-full size-4">{index}</div>
            <div className="flex-1 mx-1 line-clamp-1 truncate">{name}</div>
        </button>
    );
}