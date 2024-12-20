/**
 * 擴充功能接收的訊息
 */
export type Message = {
    role: string;
    content: string;
    images?: string[];
};

/**
 * Open WebUI 允許的訊息格式
 */
export type OpenAIMessage = {
    role: string
    content: string | OpenAIMessageContent[]
}

export type OpenAIMessageContent = {
    type: "text";
    content: string;
} | {
    type: "image_url";
    image_url: { url: string };
}

export type OllamaMessage = {
    role: "system" | "user" | "assistant" | "tool";
    content: string;
    images?: string[] | Uint8Array[];
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

/**
 * Chat Completion 相關
 */
// ChatBase 是 Open WebUI 的聊天室基本資料
export type ChatBase = {
    id: string;
    title: string;
    updated_at: number;
    created_at: number;
}

export type ChatCompletionRequest = {
    model: string
    stream: boolean
    messages: OllamaMessage[] | OpenAIMessage[]
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

export type ChatCompletionResponse = OllamaChatCompletionResponse | OpenAIChatCompletionResponse;

export type OllamaChatCompletionResponse = {
    model: string;
    created_at: string;
    message: OllamaMessage;
    done: boolean;
}

export type OpenAIChatCompletionResponse = {
    id: string;
    object: string;
    created: number;
    model: string;
    choices: ChatCompletionChoice[];
    usage?: ChatCompletionUsage;
}

/**
 * Open WebUI 回傳的聊天室完整資料
 */
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
    files: ChatFile[];
    models: string[];
    messages: MessageInfo[];
    history: {
        currentId: string;
        messages: { [key: string]: MessageInfo };
    }
}

export type MessageInfo = {
    id: string;
    role: string;
    content: string;
    timestamp: number;
    parentId: string;
    chiildrenIds: string[];
    info: ChatUsage;
    // 檔案相關
    files?: ChatFile[];
    citations?: ChatCitation[];
    // 模型相關
    model?: string;
    modelIdx?: number;
    models?: string[];
    modelName?: string;
    //
    context?: string;
    done?: boolean;
    userContext?: string;
}

type ChatCitation = {
    source: ChatFileNormal;
    distances: number[];
    document: string[];
    metadata: ChatCitationMetadata[];
}

type ChatCitationMetadata = {
    file_id: string;
    hash: string;
    name: string;
    source: string;
    embedding_config: string;
}

export type ChatFile = ChatFileImage | ChatFileNormal;

type ChatFileImage = {
    type: "image";
    url: string;
}

type ChatFileNormal = {
    id: string;
    itemId: string;
    type: "file";
    url: string;
    status: string;
    error: string;
    collection_name: string;
    name: string;
    size: number;
    file: OpenWebUIFile[];
}

type OpenWebUIFile = {
    id: string;
    hash: string;
    user_id: string;
    filename: string;
    created_at: number;
    updated_at: number;
    data: { content: string };
    meta: OpenWebUIFileMeta;
}

type OpenWebUIFileMeta = {
    collection_name: string;
    content_type: string;
    name: string;
    size: number;
}

type ChatUsage = {
    eval_count: number;
    eval_duration: number;
    load_duration: number;
    prompt_eval_count: number;
    total_duration: number;
};