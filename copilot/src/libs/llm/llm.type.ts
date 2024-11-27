export type Model = OpenAIModel | OllamaModel;

type BaseModel = {
	id: string;
	name: string;
	owned_by: 'ollama' | 'openai' | 'arena';
	created: number;
	object: "model";
	actions: string[];
	info?: ModelConfig;
};

export interface OpenAIModel extends BaseModel {
	owned_by: 'openai';
	external: boolean;
	source?: string;
	openai?: {
		created: number;
		id: string;
		object: "model";
		owned_by: string;
	}
}

export interface OllamaModel extends BaseModel {
	owned_by: 'ollama';
	details: OllamaModelDetails;
	size: number;
	description: string;
	model: string;
	modified_at: string;
	digest: string;
	ollama?: {
		name: string;
		model: string;
		modified_at: string;
		size: number;
		digest: string;
		details?: OllamaModelDetails;
		urls?: number[];
	};
}

type OllamaModelDetails = {
	parent_model: string;
	format: string;
	family: string;
	families: string[] | null;
	parameter_size: string;
	quantization_level: string;
};

interface ModelConfig {
	id: string;
	name: string;
	meta: ModelMeta;
	base_model_id?: string;
	params: ModelParams;
}

interface ModelMeta {
    position: number;
	description?: string;
	capabilities?: object;
	profile_image_url?: string;
    hidden?: boolean;
}

type ModelParams = object
// interface ModelParams {}