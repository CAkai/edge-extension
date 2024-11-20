// ChatBase 是 Open WebUI 的聊天室基本資料
export type ChatBase = {
    id: string;
    title: string;
    updated_at: number;
    created_at: number;
}

export type Message = {
    role: string
    content: string
    images?: Uint8Array[] | string[]
    tool_calls?: ToolCall[]
}

type ToolCall = {
    function: {
        name: string;
        arguments: {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            [key: string]: any;
        };
    };
}

export type ChatCompletionRequest = {
    model: string
    stream: boolean
    messages: Message[]
}

type ChatCompletionChoice = {
    index: number
    finish_reason: string
    logprobs: string;
    message: {
        role: string
        content: string
    }
    delta: {
        role: string
        content: string
    }
}

type ChatCompletionUsage = {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
}

export type ChatCompletionResponse = {
    id: string;
    object: string;
    created: number;
    model: string;
    choices: ChatCompletionChoice[];
    usage?: ChatCompletionUsage;
};

// ChatData 是 Open WebUI 的聊天室完整資料，包含聊天室的訊息、檔案、標籤等等
export type ChatData = {
    archived: boolean;
    user_id: string;
    id: string;
    title: string;
    updated_at: number;
    created_at: number;
    pinned: boolean;
    share_id: string;
    folder_id: string;
    timestamp: number;
    tags: string[];
    meta: ChatMeta;
    chat: ChatInfo;
}

type ChatMeta = {
    tags: string[];
}

type ChatInfo = {
    files: string[];
    models: string[];
    messages: MessageInfo[];
    history: {
        currentId: string;
        messages: { [key: string]: MessageInfo };
    }
}

type MessageInfo = {
    id: string;
    role: string;
    content: string;
    timestamp: number;
    parentId: string;
    chiildrenIds: string[];
    model?: string;
    info: ChatUsage;
    modelIdx?: number;
    modelName?: string;
    models?: string[];
    context?: string;
    done?: boolean;
    userContext?: string;
}

type ChatUsage = {
    eval_count: number;
    eval_duration: number;
    load_duration: number;
    prompt_eval_count: number;
    total_duration: number;
};