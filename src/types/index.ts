export type Profile = {
  id: string;
  username: string;
  display_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
};

export type ToolType =
  | "model"
  | "app"
  | "repo"
  | "api"
  | "template"
  | "dataset"
  | "extension"
  | "script"
  | "integration"
  | "platform";

export type PricingType = "free" | "freemium" | "paid" | "open-source";

export type TechnicalLevel = "beginner" | "intermediate" | "advanced";

export type Tool = {
  id: string;
  name: string;
  slug: string;
  type: ToolType;
  description: string | null;
  url: string | null;
  icon_url: string | null;
  pricing_type: PricingType;
  technical_level: TechnicalLevel;
  tags: string[];
  created_at: string;
};

export type DifficultyLevel = "instant" | "light-setup" | "technical-setup";

export type ExecutionContext =
  | "chat-based"
  | "api-based"
  | "local-workflow"
  | "no-code-automation"
  | "research-stack"
  | "design-workflow"
  | "dev-workflow";

export type ExternalLink = {
  label: string;
  url: string;
  type: "repo" | "template" | "docs" | "install" | "other";
};

export type Prompt = {
  id: string;
  creator_id: string;
  title: string;
  slug: string;
  description: string | null;
  body: string;
  tags: string[];
  is_public: boolean;
  copy_count: number;
  save_count: number;
  difficulty_level: DifficultyLevel;
  execution_context: ExecutionContext;
  setup_notes: string | null;
  prerequisites: string[];
  external_links: ExternalLink[];
  compatible_tool_ids: string[];
  required_tool_ids: string[];
  optional_tool_ids: string[];
  created_at: string;
  updated_at: string;
  creator?: Profile;
  compatible_tools?: Tool[];
  required_tools?: Tool[];
  optional_tools?: Tool[];
};

export type WorkflowStep = {
  id: string;
  workflow_id: string;
  title: string;
  body: string;
  notes: string | null;
  tool_id: string | null;
  position: number;
  created_at: string;
  tool?: Tool;
};

export type Workflow = {
  id: string;
  creator_id: string;
  title: string;
  slug: string;
  description: string | null;
  tags: string[];
  is_public: boolean;
  save_count: number;
  difficulty_level: DifficultyLevel;
  execution_context: ExecutionContext;
  setup_notes: string | null;
  prerequisites: string[];
  external_links: ExternalLink[];
  compatible_tool_ids: string[];
  required_tool_ids: string[];
  optional_tool_ids: string[];
  created_at: string;
  updated_at: string;
  creator?: Profile;
  steps?: WorkflowStep[];
  compatible_tools?: Tool[];
  required_tools?: Tool[];
  optional_tools?: Tool[];
};

export type Save = {
  id: string;
  user_id: string;
  prompt_id: string | null;
  workflow_id: string | null;
  created_at: string;
  prompt?: Prompt;
  workflow?: Workflow;
};

export type SearchResult = {
  id: string;
  type: "prompt" | "workflow";
  title: string;
  slug: string;
  description: string | null;
  tags: string[];
  creator_username: string;
  creator_display_name: string | null;
  creator_avatar_url: string | null;
  copy_count: number;
  save_count: number;
  difficulty_level: DifficultyLevel;
  execution_context: ExecutionContext;
  compatible_tool_ids: string[];
  created_at: string;
  compatible_tools?: Tool[];
};
