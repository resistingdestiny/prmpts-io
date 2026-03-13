-- Seed data for prmpts.io
-- Run this after creating a user account and replacing the UUID below

-- Replace this with the UUID of your first user account
-- You can find it in Supabase Dashboard > Authentication > Users
DO $$
DECLARE
  user_id uuid := '00000000-0000-0000-0000-000000000001'; -- REPLACE ME
BEGIN

-- Update profile
UPDATE profiles SET
  display_name = 'Demo User',
  bio = 'Exploring the world of AI prompts.',
  username = 'demo'
WHERE id = user_id;

-- Seed prompts
INSERT INTO prompts (creator_id, title, slug, description, body, tags, is_public) VALUES
(user_id, 'Blog Post Writer', 'blog-post-writer', 'Generate a well-structured blog post on any topic.', E'Write a comprehensive blog post about {{topic}}.\n\nTarget audience: {{audience}}\nTone: {{tone}}\nLength: approximately {{word_count}} words\n\nStructure the post with:\n1. An engaging introduction with a hook\n2. 3-5 main sections with subheadings\n3. Practical examples or case studies\n4. A conclusion with a call to action\n\nUse clear, accessible language and include relevant statistics or data points where appropriate.', ARRAY['writing', 'blog', 'content'], true),

(user_id, 'Code Reviewer', 'code-reviewer', 'Get a thorough code review with actionable feedback.', E'Review the following {{language}} code and provide detailed feedback:\n\n```{{language}}\n{{code}}\n```\n\nPlease evaluate:\n1. **Correctness**: Are there any bugs or logical errors?\n2. **Performance**: Any potential performance issues or optimizations?\n3. **Readability**: Is the code clean and well-organized?\n4. **Security**: Any security vulnerabilities?\n5. **Best Practices**: Does it follow {{language}} conventions?\n\nFor each issue found, provide:\n- The specific line or section\n- What the problem is\n- A suggested fix with code example', ARRAY['coding', 'review', 'development'], true),

(user_id, 'Email Composer', 'email-composer', 'Craft professional emails for any situation.', E'Write a professional email with the following details:\n\nPurpose: {{purpose}}\nRecipient: {{recipient}}\nKey points to cover:\n{{key_points}}\n\nTone: {{tone}}\n\nThe email should be concise, clear, and end with a specific call to action. Include an appropriate subject line.', ARRAY['email', 'business', 'communication'], true),

(user_id, 'User Story Generator', 'user-story-generator', 'Create well-formatted user stories for agile development.', E'Generate user stories for the following feature:\n\nFeature: {{feature_name}}\nProduct: {{product_name}}\nContext: {{context}}\n\nFor each user story, use the format:\nAs a [type of user], I want [goal] so that [benefit].\n\nInclude:\n- 3-5 user stories covering different user types\n- Acceptance criteria for each story\n- Story point estimate (1, 2, 3, 5, 8, 13)\n- Priority (Must have / Should have / Nice to have)', ARRAY['product', 'agile', 'development'], true),

(user_id, 'Meeting Summary', 'meeting-summary', 'Turn messy meeting notes into clear summaries.', E'Summarize the following meeting notes into a clear, actionable summary:\n\n{{meeting_notes}}\n\nFormat the summary as:\n\n## Meeting Summary\n**Date**: {{date}}\n**Attendees**: {{attendees}}\n\n### Key Decisions\n- [List decisions made]\n\n### Action Items\n| Owner | Task | Deadline |\n|-------|------|----------|\n\n### Discussion Points\n- [Brief summary of main topics discussed]\n\n### Next Steps\n- [What happens next]', ARRAY['meetings', 'productivity', 'business'], true),

(user_id, 'SQL Query Builder', 'sql-query-builder', 'Generate SQL queries from natural language descriptions.', E'Generate a SQL query for the following requirement:\n\nDatabase: {{database_type}}\nRequirement: {{requirement}}\n\nTable schema:\n{{schema}}\n\nProvide:\n1. The SQL query with proper formatting\n2. An explanation of how it works\n3. Any performance considerations\n4. Alternative approaches if applicable', ARRAY['sql', 'database', 'coding'], true),

(user_id, 'Product Description', 'product-description', 'Write compelling product descriptions that convert.', E'Write a compelling product description for:\n\nProduct: {{product_name}}\nCategory: {{category}}\nKey features: {{features}}\nTarget customer: {{target_customer}}\nPrice point: {{price}}\n\nThe description should:\n- Lead with the main benefit, not features\n- Use sensory and emotional language\n- Include 3-5 bullet points for key features\n- End with a clear value proposition\n- Be optimized for SEO with natural keyword usage\n- Be approximately 150-200 words', ARRAY['marketing', 'copywriting', 'ecommerce'], true),

(user_id, 'Learning Plan Creator', 'learning-plan-creator', 'Create a structured learning plan for any skill.', E'Create a detailed learning plan for:\n\nSkill: {{skill}}\nCurrent level: {{current_level}}\nGoal: {{goal}}\nTime available: {{hours_per_week}} hours per week\nTimeline: {{timeline}}\n\nInclude:\n1. **Assessment**: What to evaluate before starting\n2. **Phase breakdown**: Divide into logical learning phases\n3. **Weekly schedule**: Specific activities for each week\n4. **Resources**: Books, courses, tutorials, practice exercises\n5. **Milestones**: Checkpoints to measure progress\n6. **Projects**: Hands-on projects for each phase', ARRAY['learning', 'education', 'productivity'], true),

(user_id, 'API Documentation', 'api-documentation', 'Generate clean API documentation from endpoint details.', E'Generate comprehensive API documentation for the following endpoint:\n\nEndpoint: {{method}} {{path}}\nDescription: {{description}}\nAuthentication: {{auth_type}}\n\nRequest parameters:\n{{parameters}}\n\nProvide documentation in the following format:\n- Endpoint overview\n- Authentication requirements\n- Request parameters (path, query, body) with types and descriptions\n- Example request (cURL and JavaScript fetch)\n- Response schema with field descriptions\n- Example response (success and error)\n- Rate limiting info\n- Common error codes', ARRAY['api', 'documentation', 'development'], true),

(user_id, 'Debate Prep', 'debate-prep', 'Prepare arguments for both sides of any topic.', E'Help me prepare for a debate on the following topic:\n\nTopic: {{topic}}\nMy position: {{position}}\n\nProvide:\n\n## Arguments FOR my position\n1. [Strong argument with supporting evidence]\n2. [Second argument]\n3. [Third argument]\n\n## Anticipated counterarguments\n1. [What the other side might say]\n   - **Rebuttal**: [How to respond]\n2. [Second counterargument]\n   - **Rebuttal**: [How to respond]\n\n## Key statistics and facts\n- [Relevant data points]\n\n## Opening statement suggestion\n[A compelling opening]\n\n## Closing statement suggestion\n[A strong closing]', ARRAY['debate', 'critical-thinking', 'research'], true);

-- Seed workflows
INSERT INTO workflows (creator_id, title, slug, description, tags, is_public) VALUES
(user_id, 'Content Marketing Pipeline', 'content-marketing-pipeline', 'A complete workflow for creating and publishing content marketing pieces.', ARRAY['marketing', 'content', 'workflow'], true),
(user_id, 'Bug Investigation Workflow', 'bug-investigation-workflow', 'Systematic approach to investigating and fixing software bugs.', ARRAY['debugging', 'development', 'workflow'], true),
(user_id, 'Product Launch Checklist', 'product-launch-checklist', 'Step-by-step workflow for launching a new product or feature.', ARRAY['product', 'launch', 'workflow'], true);

-- Seed workflow steps
INSERT INTO workflow_steps (workflow_id, title, body, notes, position)
SELECT w.id, s.title, s.body, s.notes, s.position
FROM workflows w
CROSS JOIN (VALUES
  ('Research & Ideation', E'Generate 10 content ideas for {{niche}} that would resonate with {{target_audience}}.\n\nFor each idea, provide:\n- Working title\n- Key angle or hook\n- Search intent it addresses\n- Estimated difficulty (easy/medium/hard)', 'Start here to build your content calendar', 0),
  ('Outline Creation', E'Create a detailed outline for the following content piece:\n\nTitle: {{title}}\nFormat: {{format}}\nTarget keyword: {{keyword}}\nWord count target: {{word_count}}\n\nInclude:\n- H2 and H3 subheadings\n- Key points under each section\n- Places to include data/statistics\n- Internal linking opportunities', 'Use the best idea from step 1', 1),
  ('Draft Writing', E'Write a first draft based on the following outline:\n\n{{outline}}\n\nGuidelines:\n- Write in a {{tone}} tone\n- Include transition sentences between sections\n- Add a compelling introduction and conclusion\n- Naturally incorporate the keyword "{{keyword}}"', 'Focus on getting ideas down, polish later', 2),
  ('Editing & Polish', E'Edit the following draft for clarity, engagement, and SEO:\n\n{{draft}}\n\nCheck for:\n1. Grammar and spelling\n2. Sentence variety and flow\n3. Passive voice (minimize)\n4. Keyword density for "{{keyword}}"\n5. Meta description (under 160 chars)\n6. Readability (aim for grade 8 level)', 'Final polish before publishing', 3)
) AS s(title, body, notes, position)
WHERE w.slug = 'content-marketing-pipeline';

INSERT INTO workflow_steps (workflow_id, title, body, notes, position)
SELECT w.id, s.title, s.body, s.notes, s.position
FROM workflows w
CROSS JOIN (VALUES
  ('Reproduce the Bug', E'Help me create a minimal reproduction for this bug:\n\nBug report: {{bug_description}}\nExpected behavior: {{expected}}\nActual behavior: {{actual}}\nEnvironment: {{environment}}\n\nProvide:\n1. Step-by-step reproduction steps\n2. Minimal code to trigger the issue\n3. What variables to isolate', 'Always start by reproducing reliably', 0),
  ('Root Cause Analysis', E'Analyze the following bug reproduction and identify the root cause:\n\nReproduction steps: {{steps}}\nRelevant code:\n```\n{{code}}\n```\nError output: {{error}}\n\nProvide:\n1. Root cause identification\n2. Why this bug occurs\n3. What conditions trigger it\n4. Impact assessment', 'Dig deep — symptoms vs root cause', 1),
  ('Fix Implementation', E'Suggest a fix for the following bug:\n\nRoot cause: {{root_cause}}\nAffected code:\n```\n{{code}}\n```\n\nProvide:\n1. The minimal fix\n2. Any edge cases to consider\n3. Regression test to add\n4. Related areas that might need updating', 'Keep the fix minimal and focused', 2),
  ('Verification & Prevention', E'Create a verification plan for this bug fix:\n\nBug: {{bug_description}}\nFix applied: {{fix_description}}\n\nProvide:\n1. Manual test cases to verify the fix\n2. Automated test code\n3. How to prevent similar bugs in the future\n4. Documentation updates needed', 'Compound the fix with tests and docs', 3)
) AS s(title, body, notes, position)
WHERE w.slug = 'bug-investigation-workflow';

INSERT INTO workflow_steps (workflow_id, title, body, notes, position)
SELECT w.id, s.title, s.body, s.notes, s.position
FROM workflows w
CROSS JOIN (VALUES
  ('Pre-Launch Audit', E'Perform a pre-launch audit for {{product_name}}:\n\nProduct type: {{product_type}}\nTarget launch date: {{launch_date}}\n\nCheck:\n1. Feature completeness against requirements\n2. Critical bugs or blockers\n3. Performance benchmarks met\n4. Security review completed\n5. Legal/compliance requirements\n6. Analytics and tracking setup\n7. Error monitoring configured', 'Do this 2 weeks before launch', 0),
  ('Launch Communications', E'Draft launch communications for {{product_name}}:\n\nKey value proposition: {{value_prop}}\nTarget audience: {{audience}}\nLaunch date: {{launch_date}}\n\nCreate:\n1. Launch announcement email\n2. Social media posts (Twitter, LinkedIn)\n3. Internal team announcement\n4. Press release draft\n5. Product Hunt listing copy', 'Prepare all comms before launch day', 1),
  ('Launch Day Execution', E'Create a launch day runbook for {{product_name}}:\n\nLaunch time: {{launch_time}}\nTeam members: {{team}}\n\nInclude:\n1. Hour-by-hour timeline\n2. Who does what and when\n3. Go/no-go checklist\n4. Communication channels to monitor\n5. Rollback plan if needed\n6. Success metrics to track in real-time', 'Print this out on launch day', 2),
  ('Post-Launch Review', E'Create a post-launch review template for {{product_name}}:\n\nLaunch date: {{launch_date}}\nKey metrics from launch: {{metrics}}\n\nReview:\n1. What went well\n2. What could be improved\n3. Unexpected issues and how they were handled\n4. Key metrics vs targets\n5. Customer feedback themes\n6. Action items for next launch', 'Do this 1 week after launch', 3)
) AS s(title, body, notes, position)
WHERE w.slug = 'product-launch-checklist';

END $$;
