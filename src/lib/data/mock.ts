import type { Profile, Prompt, Workflow, WorkflowStep, Save, SearchResult, Tool } from "@/types";

const mockProfile: Profile = {
  id: "00000000-0000-0000-0000-000000000001",
  username: "demo",
  display_name: "Demo User",
  bio: "Exploring the world of AI prompts.",
  avatar_url: null,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

// --------------- Tools ---------------

export const mockTools: Tool[] = [
  {
    id: "t-chatgpt",
    name: "ChatGPT",
    slug: "chatgpt",
    type: "model",
    description: "OpenAI's conversational AI assistant. Supports GPT-4o and GPT-4.1 models.",
    url: "https://chat.openai.com",
    icon_url: null,
    pricing_type: "freemium",
    technical_level: "beginner",
    tags: ["ai", "chat", "openai"],
    created_at: "2025-01-01T00:00:00Z",
  },
  {
    id: "t-claude",
    name: "Claude",
    slug: "claude",
    type: "model",
    description: "Anthropic's AI assistant. Known for nuance, safety, and long-context capability.",
    url: "https://claude.ai",
    icon_url: null,
    pricing_type: "freemium",
    technical_level: "beginner",
    tags: ["ai", "chat", "anthropic"],
    created_at: "2025-01-01T00:00:00Z",
  },
  {
    id: "t-perplexity",
    name: "Perplexity",
    slug: "perplexity",
    type: "app",
    description: "AI-powered research and search engine with source citations.",
    url: "https://perplexity.ai",
    icon_url: null,
    pricing_type: "freemium",
    technical_level: "beginner",
    tags: ["ai", "search", "research"],
    created_at: "2025-01-01T00:00:00Z",
  },
  {
    id: "t-cursor",
    name: "Cursor",
    slug: "cursor",
    type: "app",
    description: "AI-native code editor built on VS Code. Inline code generation and editing.",
    url: "https://cursor.com",
    icon_url: null,
    pricing_type: "freemium",
    technical_level: "intermediate",
    tags: ["ai", "coding", "editor"],
    created_at: "2025-01-01T00:00:00Z",
  },
  {
    id: "t-notion",
    name: "Notion",
    slug: "notion",
    type: "platform",
    description: "All-in-one workspace for notes, docs, databases, and project management.",
    url: "https://notion.so",
    icon_url: null,
    pricing_type: "freemium",
    technical_level: "beginner",
    tags: ["productivity", "docs", "database"],
    created_at: "2025-01-01T00:00:00Z",
  },
  {
    id: "t-midjourney",
    name: "Midjourney",
    slug: "midjourney",
    type: "model",
    description: "AI image generation via Discord or web. Known for artistic, high-quality outputs.",
    url: "https://midjourney.com",
    icon_url: null,
    pricing_type: "paid",
    technical_level: "beginner",
    tags: ["ai", "image", "design"],
    created_at: "2025-01-01T00:00:00Z",
  },
  {
    id: "t-n8n",
    name: "n8n",
    slug: "n8n",
    type: "integration",
    description: "Open-source workflow automation tool. Connect APIs, services, and AI models.",
    url: "https://n8n.io",
    icon_url: null,
    pricing_type: "open-source",
    technical_level: "intermediate",
    tags: ["automation", "integration", "workflow"],
    created_at: "2025-01-01T00:00:00Z",
  },
  {
    id: "t-zapier",
    name: "Zapier",
    slug: "zapier",
    type: "integration",
    description: "No-code automation platform connecting 6,000+ apps.",
    url: "https://zapier.com",
    icon_url: null,
    pricing_type: "freemium",
    technical_level: "beginner",
    tags: ["automation", "no-code", "integration"],
    created_at: "2025-01-01T00:00:00Z",
  },
  {
    id: "t-github",
    name: "GitHub",
    slug: "github",
    type: "platform",
    description: "Code hosting, version control, and collaboration platform.",
    url: "https://github.com",
    icon_url: null,
    pricing_type: "freemium",
    technical_level: "intermediate",
    tags: ["coding", "git", "collaboration"],
    created_at: "2025-01-01T00:00:00Z",
  },
  {
    id: "t-gsheets",
    name: "Google Sheets",
    slug: "google-sheets",
    type: "template",
    description: "Cloud spreadsheet for data, tracking, and lightweight databases.",
    url: "https://sheets.google.com",
    icon_url: null,
    pricing_type: "free",
    technical_level: "beginner",
    tags: ["spreadsheet", "data", "google"],
    created_at: "2025-01-01T00:00:00Z",
  },
  {
    id: "t-python",
    name: "Python",
    slug: "python",
    type: "script",
    description: "General-purpose programming language. Used for AI/ML, scripting, and automation.",
    url: "https://python.org",
    icon_url: null,
    pricing_type: "free",
    technical_level: "intermediate",
    tags: ["coding", "scripting", "ai"],
    created_at: "2025-01-01T00:00:00Z",
  },
  {
    id: "t-airtable",
    name: "Airtable",
    slug: "airtable",
    type: "platform",
    description: "Spreadsheet-database hybrid for structured data and workflows.",
    url: "https://airtable.com",
    icon_url: null,
    pricing_type: "freemium",
    technical_level: "beginner",
    tags: ["database", "no-code", "productivity"],
    created_at: "2025-01-01T00:00:00Z",
  },
];

function toolsById(ids: string[]): Tool[] {
  return ids.map((id) => mockTools.find((t) => t.id === id)!).filter(Boolean);
}

// --------------- Prompts ---------------

export const mockPrompts: Prompt[] = [
  {
    id: "p1",
    creator_id: mockProfile.id,
    title: "Blog Post Writer",
    slug: "blog-post-writer",
    description: "Generate a well-structured blog post on any topic.",
    body: `Write a comprehensive blog post about {{topic}}.

Target audience: {{audience}}
Tone: {{tone}}
Length: approximately {{word_count}} words

Structure the post with:
1. An engaging introduction with a hook
2. 3-5 main sections with subheadings
3. Practical examples or case studies
4. A conclusion with a call to action

Use clear, accessible language and include relevant statistics or data points where appropriate.`,
    tags: ["writing", "blog", "content"],
    is_public: true,
    copy_count: 142,
    save_count: 38,
    difficulty_level: "instant",
    execution_context: "chat-based",
    setup_notes: null,
    prerequisites: [],
    external_links: [],
    compatible_tool_ids: ["t-chatgpt", "t-claude"],
    required_tool_ids: [],
    optional_tool_ids: ["t-notion"],
    created_at: "2025-12-01T00:00:00Z",
    updated_at: "2025-12-01T00:00:00Z",
    creator: mockProfile,
    compatible_tools: toolsById(["t-chatgpt", "t-claude"]),
    required_tools: [],
    optional_tools: toolsById(["t-notion"]),
  },
  {
    id: "p2",
    creator_id: mockProfile.id,
    title: "Code Reviewer",
    slug: "code-reviewer",
    description: "Get a thorough code review with actionable feedback.",
    body: `Review the following {{language}} code and provide detailed feedback:

\`\`\`{{language}}
{{code}}
\`\`\`

Please evaluate:
1. **Correctness**: Are there any bugs or logical errors?
2. **Performance**: Any potential performance issues or optimizations?
3. **Readability**: Is the code clean and well-organized?
4. **Security**: Any security vulnerabilities?
5. **Best Practices**: Does it follow {{language}} conventions?

For each issue found, provide:
- The specific line or section
- What the problem is
- A suggested fix with code example`,
    tags: ["coding", "review", "development"],
    is_public: true,
    copy_count: 89,
    save_count: 27,
    difficulty_level: "instant",
    execution_context: "dev-workflow",
    setup_notes: null,
    prerequisites: [],
    external_links: [],
    compatible_tool_ids: ["t-claude", "t-chatgpt", "t-cursor"],
    required_tool_ids: [],
    optional_tool_ids: ["t-github"],
    created_at: "2025-11-28T00:00:00Z",
    updated_at: "2025-11-28T00:00:00Z",
    creator: mockProfile,
    compatible_tools: toolsById(["t-claude", "t-chatgpt", "t-cursor"]),
    required_tools: [],
    optional_tools: toolsById(["t-github"]),
  },
  {
    id: "p3",
    creator_id: mockProfile.id,
    title: "Email Composer",
    slug: "email-composer",
    description: "Craft professional emails for any situation.",
    body: `Write a professional email with the following details:

Purpose: {{purpose}}
Recipient: {{recipient}}
Key points to cover:
{{key_points}}

Tone: {{tone}}

The email should be concise, clear, and end with a specific call to action. Include an appropriate subject line.`,
    tags: ["email", "business", "communication"],
    is_public: true,
    copy_count: 64,
    save_count: 19,
    difficulty_level: "instant",
    execution_context: "chat-based",
    setup_notes: null,
    prerequisites: [],
    external_links: [],
    compatible_tool_ids: ["t-chatgpt", "t-claude"],
    required_tool_ids: [],
    optional_tool_ids: [],
    created_at: "2025-11-25T00:00:00Z",
    updated_at: "2025-11-25T00:00:00Z",
    creator: mockProfile,
    compatible_tools: toolsById(["t-chatgpt", "t-claude"]),
    required_tools: [],
    optional_tools: [],
  },
  {
    id: "p4",
    creator_id: mockProfile.id,
    title: "SQL Query Builder",
    slug: "sql-query-builder",
    description: "Generate SQL queries from natural language descriptions.",
    body: `Generate a SQL query for the following requirement:

Database: {{database_type}}
Requirement: {{requirement}}

Table schema:
{{schema}}

Provide:
1. The SQL query with proper formatting
2. An explanation of how it works
3. Any performance considerations
4. Alternative approaches if applicable`,
    tags: ["sql", "database", "coding"],
    is_public: true,
    copy_count: 53,
    save_count: 14,
    difficulty_level: "light-setup",
    execution_context: "dev-workflow",
    setup_notes: "Have your table schema ready before starting.",
    prerequisites: ["Access to a SQL database"],
    external_links: [],
    compatible_tool_ids: ["t-chatgpt", "t-claude", "t-cursor"],
    required_tool_ids: [],
    optional_tool_ids: ["t-github"],
    created_at: "2025-11-20T00:00:00Z",
    updated_at: "2025-11-20T00:00:00Z",
    creator: mockProfile,
    compatible_tools: toolsById(["t-chatgpt", "t-claude", "t-cursor"]),
    required_tools: [],
    optional_tools: toolsById(["t-github"]),
  },
  {
    id: "p5",
    creator_id: mockProfile.id,
    title: "Learning Plan Creator",
    slug: "learning-plan-creator",
    description: "Create a structured learning plan for any skill.",
    body: `Create a detailed learning plan for:

Skill: {{skill}}
Current level: {{current_level}}
Goal: {{goal}}
Time available: {{hours_per_week}} hours per week
Timeline: {{timeline}}

Include:
1. **Assessment**: What to evaluate before starting
2. **Phase breakdown**: Divide into logical learning phases
3. **Weekly schedule**: Specific activities for each week
4. **Resources**: Books, courses, tutorials, practice exercises
5. **Milestones**: Checkpoints to measure progress
6. **Projects**: Hands-on projects for each phase`,
    tags: ["learning", "education", "productivity"],
    is_public: true,
    copy_count: 41,
    save_count: 22,
    difficulty_level: "instant",
    execution_context: "chat-based",
    setup_notes: null,
    prerequisites: [],
    external_links: [],
    compatible_tool_ids: ["t-chatgpt", "t-claude", "t-perplexity"],
    required_tool_ids: [],
    optional_tool_ids: ["t-notion"],
    created_at: "2025-11-18T00:00:00Z",
    updated_at: "2025-11-18T00:00:00Z",
    creator: mockProfile,
    compatible_tools: toolsById(["t-chatgpt", "t-claude", "t-perplexity"]),
    required_tools: [],
    optional_tools: toolsById(["t-notion"]),
  },
  {
    id: "p6",
    creator_id: mockProfile.id,
    title: "Product Description",
    slug: "product-description",
    description: "Write compelling product descriptions that convert.",
    body: `Write a compelling product description for:

Product: {{product_name}}
Category: {{category}}
Key features: {{features}}
Target customer: {{target_customer}}
Price point: {{price}}

The description should:
- Lead with the main benefit, not features
- Use sensory and emotional language
- Include 3-5 bullet points for key features
- End with a clear value proposition
- Be optimized for SEO with natural keyword usage
- Be approximately 150-200 words`,
    tags: ["marketing", "copywriting", "ecommerce"],
    is_public: true,
    copy_count: 37,
    save_count: 11,
    difficulty_level: "instant",
    execution_context: "chat-based",
    setup_notes: null,
    prerequisites: [],
    external_links: [],
    compatible_tool_ids: ["t-chatgpt", "t-claude"],
    required_tool_ids: [],
    optional_tool_ids: [],
    created_at: "2025-11-15T00:00:00Z",
    updated_at: "2025-11-15T00:00:00Z",
    creator: mockProfile,
    compatible_tools: toolsById(["t-chatgpt", "t-claude"]),
    required_tools: [],
    optional_tools: [],
  },
];

// --------------- Workflows ---------------

const contentSteps: WorkflowStep[] = [
  {
    id: "ws1", workflow_id: "w1", title: "Research & Ideation", tool_id: "t-perplexity",
    tool: mockTools.find((t) => t.id === "t-perplexity"),
    body: `Generate 10 content ideas for {{niche}} that would resonate with {{target_audience}}.

For each idea, provide:
- Working title
- Key angle or hook
- Search intent it addresses
- Estimated difficulty (easy/medium/hard)`,
    notes: "Start here to build your content calendar", position: 0, created_at: "2025-12-01T00:00:00Z",
  },
  {
    id: "ws2", workflow_id: "w1", title: "Outline Creation", tool_id: "t-claude",
    tool: mockTools.find((t) => t.id === "t-claude"),
    body: `Create a detailed outline for the following content piece:

Title: {{title}}
Format: {{format}}
Target keyword: {{keyword}}
Word count target: {{word_count}}

Include:
- H2 and H3 subheadings
- Key points under each section
- Places to include data/statistics
- Internal linking opportunities`,
    notes: "Use the best idea from step 1", position: 1, created_at: "2025-12-01T00:00:00Z",
  },
  {
    id: "ws3", workflow_id: "w1", title: "Draft Writing", tool_id: "t-chatgpt",
    tool: mockTools.find((t) => t.id === "t-chatgpt"),
    body: `Write a first draft based on the following outline:

{{outline}}

Guidelines:
- Write in a {{tone}} tone
- Include transition sentences between sections
- Add a compelling introduction and conclusion
- Naturally incorporate the keyword "{{keyword}}"`,
    notes: "Focus on getting ideas down, polish later", position: 2, created_at: "2025-12-01T00:00:00Z",
  },
  {
    id: "ws4", workflow_id: "w1", title: "Editing & Polish", tool_id: "t-claude",
    tool: mockTools.find((t) => t.id === "t-claude"),
    body: `Edit the following draft for clarity, engagement, and SEO:

{{draft}}

Check for:
1. Grammar and spelling
2. Sentence variety and flow
3. Passive voice (minimize)
4. Keyword density for "{{keyword}}"
5. Meta description (under 160 chars)
6. Readability (aim for grade 8 level)`,
    notes: "Final polish before publishing", position: 3, created_at: "2025-12-01T00:00:00Z",
  },
];

const bugSteps: WorkflowStep[] = [
  {
    id: "ws5", workflow_id: "w2", title: "Reproduce the Bug", tool_id: "t-cursor",
    tool: mockTools.find((t) => t.id === "t-cursor"),
    body: `Help me create a minimal reproduction for this bug:

Bug report: {{bug_description}}
Expected behavior: {{expected}}
Actual behavior: {{actual}}
Environment: {{environment}}

Provide:
1. Step-by-step reproduction steps
2. Minimal code to trigger the issue
3. What variables to isolate`,
    notes: "Always start by reproducing reliably", position: 0, created_at: "2025-11-28T00:00:00Z",
  },
  {
    id: "ws6", workflow_id: "w2", title: "Root Cause Analysis", tool_id: "t-claude",
    tool: mockTools.find((t) => t.id === "t-claude"),
    body: `Analyze the following bug reproduction and identify the root cause:

Reproduction steps: {{steps}}
Relevant code:
\`\`\`
{{code}}
\`\`\`
Error output: {{error}}

Provide:
1. Root cause identification
2. Why this bug occurs
3. What conditions trigger it
4. Impact assessment`,
    notes: "Dig deep — symptoms vs root cause", position: 1, created_at: "2025-11-28T00:00:00Z",
  },
  {
    id: "ws7", workflow_id: "w2", title: "Fix Implementation", tool_id: "t-cursor",
    tool: mockTools.find((t) => t.id === "t-cursor"),
    body: `Suggest a fix for the following bug:

Root cause: {{root_cause}}
Affected code:
\`\`\`
{{code}}
\`\`\`

Provide:
1. The minimal fix
2. Any edge cases to consider
3. Regression test to add
4. Related areas that might need updating`,
    notes: "Keep the fix minimal and focused", position: 2, created_at: "2025-11-28T00:00:00Z",
  },
];

export const mockWorkflows: Workflow[] = [
  {
    id: "w1",
    creator_id: mockProfile.id,
    title: "Content Marketing Pipeline",
    slug: "content-marketing-pipeline",
    description: "A complete workflow for creating and publishing content marketing pieces.",
    tags: ["marketing", "content", "workflow"],
    is_public: true,
    save_count: 31,
    difficulty_level: "light-setup",
    execution_context: "research-stack",
    setup_notes: "Works best if you have accounts on all three AI platforms.",
    prerequisites: ["Perplexity account", "Target keyword list"],
    external_links: [],
    compatible_tool_ids: ["t-perplexity", "t-claude", "t-chatgpt"],
    required_tool_ids: ["t-perplexity"],
    optional_tool_ids: ["t-notion", "t-gsheets"],
    created_at: "2025-12-01T00:00:00Z",
    updated_at: "2025-12-01T00:00:00Z",
    creator: mockProfile,
    steps: contentSteps,
    compatible_tools: toolsById(["t-perplexity", "t-claude", "t-chatgpt"]),
    required_tools: toolsById(["t-perplexity"]),
    optional_tools: toolsById(["t-notion", "t-gsheets"]),
  },
  {
    id: "w2",
    creator_id: mockProfile.id,
    title: "Bug Investigation Workflow",
    slug: "bug-investigation-workflow",
    description: "Systematic approach to investigating and fixing software bugs.",
    tags: ["debugging", "development", "workflow"],
    is_public: true,
    save_count: 24,
    difficulty_level: "technical-setup",
    execution_context: "dev-workflow",
    setup_notes: "Requires a local development environment with the codebase checked out.",
    prerequisites: ["Local dev environment", "Access to bug tracker", "Git repo cloned"],
    external_links: [],
    compatible_tool_ids: ["t-cursor", "t-claude"],
    required_tool_ids: ["t-cursor", "t-github"],
    optional_tool_ids: ["t-chatgpt"],
    created_at: "2025-11-28T00:00:00Z",
    updated_at: "2025-11-28T00:00:00Z",
    creator: mockProfile,
    steps: bugSteps,
    compatible_tools: toolsById(["t-cursor", "t-claude"]),
    required_tools: toolsById(["t-cursor", "t-github"]),
    optional_tools: toolsById(["t-chatgpt"]),
  },
];

export const mockProfiles: Profile[] = [mockProfile];
export const mockSaves: Save[] = [];

export function isDemo(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  return !url || url.includes("placeholder");
}

export function getToolById(id: string): Tool | undefined {
  return mockTools.find((t) => t.id === id);
}

export function getToolBySlug(slug: string): Tool | undefined {
  return mockTools.find((t) => t.slug === slug);
}

export function getPromptsByToolId(toolId: string): Prompt[] {
  return mockPrompts.filter(
    (p) =>
      p.compatible_tool_ids.includes(toolId) ||
      p.required_tool_ids.includes(toolId) ||
      p.optional_tool_ids.includes(toolId),
  );
}

export function getWorkflowsByToolId(toolId: string): Workflow[] {
  return mockWorkflows.filter(
    (w) =>
      w.compatible_tool_ids.includes(toolId) ||
      w.required_tool_ids.includes(toolId) ||
      w.optional_tool_ids.includes(toolId),
  );
}

export function mockSearchContent(
  query: string,
  type: string,
  toolFilter?: string,
  difficultyFilter?: string,
  contextFilter?: string,
): SearchResult[] {
  const results: SearchResult[] = [];

  if (type === "all" || type === "prompts") {
    for (const p of mockPrompts) {
      if (toolFilter && !p.compatible_tool_ids.includes(toolFilter) && !p.required_tool_ids.includes(toolFilter)) continue;
      if (difficultyFilter && p.difficulty_level !== difficultyFilter) continue;
      if (contextFilter && p.execution_context !== contextFilter) continue;
      if (
        !query ||
        p.title.toLowerCase().includes(query.toLowerCase()) ||
        p.description?.toLowerCase().includes(query.toLowerCase()) ||
        p.tags.some((t) => t.toLowerCase().includes(query.toLowerCase())) ||
        p.compatible_tools?.some((t) => t.name.toLowerCase().includes(query.toLowerCase()))
      ) {
        results.push({
          id: p.id,
          type: "prompt",
          title: p.title,
          slug: p.slug,
          description: p.description,
          tags: p.tags,
          creator_username: mockProfile.username,
          creator_display_name: mockProfile.display_name,
          creator_avatar_url: mockProfile.avatar_url,
          copy_count: p.copy_count,
          save_count: p.save_count,
          difficulty_level: p.difficulty_level,
          execution_context: p.execution_context,
          compatible_tool_ids: p.compatible_tool_ids,
          created_at: p.created_at,
          compatible_tools: p.compatible_tools,
        });
      }
    }
  }

  if (type === "all" || type === "workflows") {
    for (const w of mockWorkflows) {
      if (toolFilter && !w.compatible_tool_ids.includes(toolFilter) && !w.required_tool_ids.includes(toolFilter)) continue;
      if (difficultyFilter && w.difficulty_level !== difficultyFilter) continue;
      if (contextFilter && w.execution_context !== contextFilter) continue;
      if (
        !query ||
        w.title.toLowerCase().includes(query.toLowerCase()) ||
        w.description?.toLowerCase().includes(query.toLowerCase()) ||
        w.tags.some((t) => t.toLowerCase().includes(query.toLowerCase())) ||
        w.compatible_tools?.some((t) => t.name.toLowerCase().includes(query.toLowerCase()))
      ) {
        results.push({
          id: w.id,
          type: "workflow",
          title: w.title,
          slug: w.slug,
          description: w.description,
          tags: w.tags,
          creator_username: mockProfile.username,
          creator_display_name: mockProfile.display_name,
          creator_avatar_url: mockProfile.avatar_url,
          copy_count: 0,
          save_count: w.save_count,
          difficulty_level: w.difficulty_level,
          execution_context: w.execution_context,
          compatible_tool_ids: w.compatible_tool_ids,
          created_at: w.created_at,
          compatible_tools: w.compatible_tools,
        });
      }
    }
  }

  return results;
}
