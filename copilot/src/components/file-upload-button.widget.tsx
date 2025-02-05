import { createRef } from 'react';
import FileUploadIcon from '../../public/svg/attachment.svg?react';

type FileUploadButtonProps = {
    accept?: string;
    onUpload: (e: Promise<unknown>[]) => void;
};

export default function FileUploadButton({ accept="*", onUpload }: FileUploadButtonProps) {
    const inputRef = createRef<HTMLInputElement>();
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        const files = e.target.files; // 獲取使用者選擇的檔案
        const imageFiles = Array.from(files); // 將 FileList 轉換為 Array
        const newImages = imageFiles.map(
            file =>
                new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = () => resolve({
                        name: file.name,
                        data: reader.result as string,
                    }); // 圖片的 Data URL
                    reader.onerror = reject;
                    reader.readAsDataURL(file);
                }),
        );
        onUpload(newImages);
        // 清空 input 的值，以便下次選擇相同檔案時能觸發 onChange 事件
        e.target.value = '';
    };

    return (
        <div>
            <input
                multiple // 支援多檔案上傳
                accept={accept}
                className="hidden"
                type="file"
                ref={inputRef}
                onChange={handleChange}
            />
            <button className="p-1 shadow-sm rounded-md hover:bg-gray-100" onClick={() => inputRef.current?.click()}>
                <FileUploadIcon style={{ width: '24px', height: '24px' }} />
            </button>
        </div>
    );
}
