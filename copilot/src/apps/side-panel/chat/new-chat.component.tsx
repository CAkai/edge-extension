import NewChatIcon from '../../../../public/svg/new-chat.svg?react';
import { i18n } from '../../../libs/alias';
import { useMessageStore } from '../../../libs/chat/chat.store';

export default function NewChat() {
    const { isIdle, clearMessage } = useMessageStore();

    return (
        <button
            title={i18n('newChat')}
            className="p-1 shadow-sm rounded-md hover:bg-gray-100"
            onClick={clearMessage}
            disabled={!isIdle()}>
            <NewChatIcon style={{ width: '20px', height: '20px', color: '#6128ff' }} />
        </button>
    );
}
