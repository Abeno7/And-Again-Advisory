# Installed Claude Code skills

259 skills vendored into `.claude/skills/` from 11 upstream repositories, pinned to the commits below. Project-scope skills load automatically for anyone working in this repo.

## Sources

| Pack | Skills | Upstream | Pinned commit | Date |
|---|---|---|---|---|
| `Brand-building-skills` | 29 | [arnabbagxd/Brand-building-skills](https://github.com/arnabbagxd/Brand-building-skills) | `4a0a8b5b7a` | 2026-06-12 |
| `marketingskills` | 49 | [coreyhaines31/marketingskills](https://github.com/coreyhaines31/marketingskills) | `7868cb9251` | 2026-07-27 |
| `Sales-Skills` | 122 | [louisblythe/Sales-Skills](https://github.com/louisblythe/Sales-Skills) | `e0f13a6eb4` | 2026-01-24 |
| `impeccable` | 1 | [pbakaus/impeccable](https://github.com/pbakaus/impeccable) | `1cf7d7ab0f` | 2026-07-28 |
| `taste-skill` | 13 | [Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill) | `e988add20d` | 2026-07-23 |
| `ui-ux-pro-max-skill` | 7 | [nextlevelbuilder/ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) | `4857a2c5ef` | 2026-07-28 |
| `no-ai-slop` | 1 | [petergyang/no-ai-slop](https://github.com/petergyang/no-ai-slop) | `e81170dcae` | 2026-07-26 |
| `awesome-claude-design` | 1 | [rohitg00/awesome-claude-design](https://github.com/rohitg00/awesome-claude-design) | `7f60ee56b9` | 2026-04-23 |
| `claude-ads` | 34 | [AgriciDaniel/claude-ads](https://github.com/AgriciDaniel/claude-ads) | `669c7608ec` | 2026-07-13 |
| `nano-banana-2-skill` | 1 | [kingbootoshi/nano-banana-2-skill](https://github.com/kingbootoshi/nano-banana-2-skill) | `80bab9a921` | 2026-02-26 |
| `gpt-image-2-skill` | 1 | [dshark3y/gpt-image-2-skill](https://github.com/dshark3y/gpt-image-2-skill) | `a66e031dd1` | 2026-04-22 |

**Total: 259 skills.** Upstream licenses are preserved verbatim in `.claude/skill-licenses/`.

## Deviations from a plain copy

Everything below is a deliberate, minimal change — skill bodies are otherwise
upstream's, unmodified.

### 1. Six name collisions resolved

`.claude/skills/` is a flat namespace, so two skills cannot share a directory
name. Where two packs shipped the same name, the pack with more inbound
references kept the plain name and the other was prefixed. The `name:` field in
the moved skill's frontmatter and any cross-references inside its own pack were
updated to match, so intra-pack routing stays correct.

| Name | Kept by | Renamed to | Renamed from |
|---|---|---|---|
| `ads` | claude-ads (19 inbound refs) | `marketing-ads` | marketingskills (7 inbound refs) |
| `copywriting` | marketingskills (11 refs) | `sales-copywriting` | Sales-Skills (1 ref) |
| `copy-editing` | marketingskills | `sales-copy-editing` | Sales-Skills |
| `aso` | marketingskills | `brand-aso` | Brand-building-skills |
| `influencer-marketing` | marketingskills | `brand-influencer-marketing` | Brand-building-skills |
| `brand-guidelines` | built-in (user scope) | `brand-book` | Brand-building-skills |

### 2. taste-skill directories renamed to their declared names

Ten skills in `taste-skill` shipped a directory name that differed from their
frontmatter `name:`. Directories now match the declared name, so the skill is
invocable under the name it advertises:

`brutalist-skill`→`industrial-brutalist-ui`, `gpt-tasteskill`→`gpt-taste`,
`image-to-code-skill`→`image-to-code`, `minimalist-skill`→`minimalist-ui`,
`output-skill`→`full-output-enforcement`,
`redesign-skill`→`redesign-existing-projects`,
`soft-skill`→`high-end-visual-design`, `stitch-skill`→`stitch-design-taste`,
`taste-skill`→`design-taste-frontend`, `taste-skill-v1`→`design-taste-frontend-v1`.
(`brandkit`, `imagegen-frontend-web`, `imagegen-frontend-mobile` already matched.)

### 3. Support files placed outside the skill directories

- **`.claude/tools/`** — marketingskills' tools registry. Its `attribution`,
  `referrals` and `revops` skills link to `../../tools/REGISTRY.md`, which
  resolves to `.claude/tools/` from a skill directory. Copied so those links work.
- **`.claude/skills/ads/scripts/`** — claude-ads' `scripts/*.py`,
  `claude_ads_core/` and `requirements.{txt,lock}`, staged exactly where
  upstream's `install.sh` puts them. Python deps are **not** installed; the pack's
  scripts need `pip install -r .claude/skills/ads/requirements.txt` before use.

### 4. awesome-claude-design has no upstream SKILL.md

That repo is a curated reference library (DESIGN.md specs by aesthetic family,
remix specs, workflow recipes, prompt packs), not a packaged skill. Its
`design-md/`, `recipes/` and `prompts/` trees were vendored as-is and a wrapper
`SKILL.md` indexing them was **authored locally** — it is the one SKILL.md here
that is not upstream's. `assets/` and `showcase/` (1.1 MB of screenshots) were
skipped. The upstream index is kept as `UPSTREAM-README.md`.

### 5. `brand-guidelines` → `brand-book`

Brand-building-skills ships `brand-guidelines` — a skill for authoring a brand
standards document. A built-in user-scope skill of the same name applies
*Anthropic's* brand colors and typography to an artifact. Different jobs, same
name. Installed as-is, the built-in won the name and the vendored skill was
unreachable, so it is installed as `brand-book` instead; its trigger phrases
("brand guidelines", "brand standards", "brand book", "style guide") are
unchanged, and both skills are now reachable.

## Things to know before relying on these

- **Context cost.** Every skill's name and description is loaded into context at
  session start — ~27k characters' worth of descriptions, roughly 27k tokens
  across 259 skills. Deleting packs you don't need is the way to shrink it.
- **Third-party executable code.** These packs ship Python/Node scripts that run
  with your permissions. Nothing in the audit phoned home unexpectedly, with one
  exception worth naming: `impeccable`'s `scripts/context.mjs` does a throttled
  daily version check against `impeccable.style`, and `scripts/concept-seed.mjs`
  POSTs the chosen concept id there. Set `IMPECCABLE_UPDATE_HOST` /
  `IMPECCABLE_API_URL` to disable or redirect.
- **API keys.** `gpt-image` needs `OPENAI_API_KEY`; `nano-banana` and
  ui-ux-pro-max's image scripts expect Gemini credentials; marketingskills'
  `.claude/tools/clis/*.js` wrap third-party APIs (Clearbit, HubSpot, …) and each
  needs its own key. None are configured.

## Skill index


### Brand-building-skills — 29 skills

| Skill | What it covers |
|---|---|
| `b2b-brand-marketing` | Build and execute brand marketing strategy for B2B companies — thought leadership, ABM brand layer, trust sign… |
| `brand-architecture` | Define how multiple brands, sub-brands, and product lines relate to each other under one organization |
| `brand-aso` | Optimize an app's store listing for maximum visibility and downloads — keyword strategy, title and subtitle op… |
| `brand-audit` | Assess the health and consistency of an existing brand — identity, messaging, voice, positioning, and market p… |
| `brand-book` | Create a comprehensive brand standards document — covering logo usage, color, typography, voice, messaging, an… |
| `brand-context` | Foundation skill that captures and stores core brand context — identity, audience, positioning, values, and vo… |
| `brand-identity` | Create a visual identity brief for a brand — logo direction, color palette, typography, imagery style, and des… |
| `brand-influencer-marketing` | Build an influencer marketing strategy — finding influencers, briefing, contracts, deliverables, performance t… |
| `brand-launch` | Plan and execute a new brand launch — from internal rollout to public debut |
| `brand-manifesto` | Write a brand manifesto — a bold, belief-driven declaration of what the brand stands for, fights against, and… |
| `brand-measurement` | Define KPIs, metrics, and tracking systems to measure brand health, awareness, perception, and equity over tim… |
| `brand-messaging` | Build a brand's messaging hierarchy — taglines, value propositions, key messages, and proof points for each au… |
| `brand-naming` | Full brand naming workflow for founders, agencies, and businesses |
| `brand-packaging` | Create a packaging design brief — structure, visual direction, hierarchy, materials, and unboxing experience |
| `brand-partnerships` | Build brand partnership strategy — co-branding campaigns, brand collaborations, licensing deals, partner brand… |
| `brand-positioning` | Define and sharpen a brand's market positioning — where it sits relative to competitors, what it owns, and how… |
| `brand-story` | Craft a brand's origin story, founder narrative, and "why we exist" statement |
| `brand-strategy` | > |
| `brand-voice` | Define a brand's verbal identity — tone, voice, writing style, vocabulary, and messaging rules |
| `competitor-branding` | Analyze how competitors present their brand — identity, messaging, positioning, voice, and visual style — to f… |
| `d2c-marketing` | Build and execute marketing strategy for Direct-to-Consumer (DTC) brands — customer acquisition, retention, em… |
| `email-marketing` | Build and run a full email marketing channel — list building, deliverability, segmentation, newsletter strateg… |
| `google-ads` | Plan, build, and optimize Google Ads campaigns — Search, Shopping, Performance Max, Display, and YouTube — inc… |
| `meta-ads` | Plan, build, and optimize Meta advertising campaigns on Facebook and Instagram — campaign structure, audience… |
| `personal-brand` | Build a personal brand strategy for founders, executives, creators, and consultants |
| `rebranding` | Plan and execute a brand transformation — from diagnosis to new brand definition to rollout |
| `target-audience` | Define a brand's target audience with deep personas, psychographics, and ICP (Ideal Customer Profile) |
| `ugc-strategy` | Build a User Generated Content (UGC) strategy — getting customers to create content, review generation, UGC br… |
| `whatsapp-marketing` | Build a WhatsApp marketing strategy — WhatsApp Business setup, broadcast campaigns, automated flows, customer… |

### marketingskills — 49 skills

| Skill | What it covers |
|---|---|
| `ab-testing` | When the user wants to plan, design, or implement an A/B test or experiment, or build a growth experimentation… |
| `ad-creative` | When the user wants to generate, iterate, or scale ad creative — headlines, descriptions, primary text, or ful… |
| `ai-seo` | When the user wants to optimize content for AI search engines, get cited by LLMs, or appear in AI-generated an… |
| `analytics` | When the user wants to set up, improve, or audit analytics tracking and measurement |
| `aso` | When the user wants to audit or optimize an App Store or Google Play listing |
| `attribution` | When the user wants to figure out which marketing actually drives conversions and revenue, choose or interpret… |
| `churn-prevention` | When the user wants to reduce churn, build cancellation flows, set up save offers, recover failed payments, or… |
| `co-marketing` | When the user wants to find co-marketing partners, plan joint campaigns, or brainstorm partnership opportuniti… |
| `cold-email` | Write B2B cold emails and follow-up sequences that get replies |
| `community-marketing` | Build and leverage online communities to drive product growth and brand loyalty |
| `competitor-profiling` | When the user wants to research, profile, or analyze competitors from their URLs |
| `competitors` | When the user wants to create competitor comparison or alternative pages for SEO and sales enablement |
| `content-strategy` | When the user wants to plan a content strategy, decide what content to create, or figure out what topics to co… |
| `copy-editing` | When the user wants to edit, review, or improve existing marketing copy, or refresh outdated content |
| `copywriting` | When the user wants to write, rewrite, or improve marketing copy for any page — including homepage, landing pa… |
| `cro` | When the user wants to optimize, improve, or increase conversions on any marketing page or form — including ho… |
| `customer-research` | When the user wants to conduct, analyze, or synthesize customer research |
| `directory-submissions` | When the user wants to submit their product to startup, SaaS, AI, agent, MCP, no-code, or review directories f… |
| `emails` | When the user wants to create or optimize an email sequence, drip campaign, automated email flow, or lifecycle… |
| `free-tools` | When the user wants to plan, evaluate, or build a free tool for marketing purposes — lead generation, SEO valu… |
| `image` | When the user wants to create, generate, edit, or optimize images for marketing — blog heroes, social graphics… |
| `influencer-marketing` | When the user wants to run influencer, creator, or ambassador partnerships to promote their product — finding… |
| `launch` | When the user wants to plan a product launch, feature announcement, or release strategy |
| `lead-magnets` | When the user wants to create, plan, or optimize a lead magnet for email capture or lead generation |
| `marketing-ads` | When the user wants help with paid advertising campaigns on Google Ads, Meta (Facebook/Instagram), LinkedIn, T… |
| `marketing-council` | When the user wants multiple expert perspectives on a marketing question — a simulated board of advisors staff… |
| `marketing-ideas` | When the user needs marketing ideas, inspiration, or strategies for their SaaS or software product |
| `marketing-loops` | When the user wants to set up a recurring, self-running marketing workflow — a repeatable loop an AI agent run… |
| `marketing-plan` | When the user needs a comprehensive marketing plan for a client, a company they advise, or their own product |
| `marketing-psychology` | When the user wants to apply psychological principles, mental models, or behavioral science to marketing |
| `offers` | When the user wants to design, construct, or improve an offer — the thing they actually sell — including value… |
| `onboarding` | When the user wants to optimize post-signup onboarding, user activation, first-run experience, or time-to-valu… |
| `paywalls` | When the user wants to create or optimize in-app paywalls, upgrade screens, upsell modals, or feature gates |
| `popups` | When the user wants to create or optimize popups, modals, overlays, slide-ins, or banners for conversion purpo… |
| `pricing` | When the user wants help with pricing decisions, packaging, or monetization strategy |
| `product-marketing` | When the user wants to create or update their product marketing context document |
| `programmatic-seo` | When the user wants to create SEO-driven pages at scale using templates and data |
| `prospecting` | When the user wants to find, qualify, and build a list of prospects to reach out to — across B2B SaaS, general… |
| `public-relations` | When the user wants help with public relations, earned media, press coverage, journalist outreach, or media st… |
| `referrals` | When the user wants to create, optimize, or analyze a referral program, affiliate program, or word-of-mouth st… |
| `revops` | When the user wants help with revenue operations, lead lifecycle management, or marketing-to-sales handoff pro… |
| `sales-enablement` | When the user wants to create sales collateral, pitch decks, one-pagers, objection handling docs, or demo scri… |
| `schema` | When the user wants to add, fix, or optimize schema markup and structured data on their site |
| `seo-audit` | When the user wants to audit, review, or diagnose SEO issues on their site |
| `signup` | When the user wants to optimize signup, registration, account creation, or trial activation flows |
| `site-architecture` | When the user wants to plan, map, or restructure their website's page hierarchy, navigation, URL structure, or… |
| `sms` | When the user wants to plan, build, or optimize SMS or MMS marketing — including welcome flows, abandoned cart… |
| `social` | When the user wants help creating, scheduling, or optimizing social media content for LinkedIn, Twitter/X, Ins… |
| `video` | When the user wants to create, generate, or produce video content using AI tools or programmatic frameworks |

### Sales-Skills — 122 skills

| Skill | What it covers |
|---|---|
| `ab-message-testing` | When the user wants to build or improve a sales bot's ability to automatically test message variations to opti… |
| `ab-test-setup` | When the user wants to test and optimize sales approaches, outreach sequences, or pitch variations |
| `active-listening` | When the user wants to improve their ability to understand prospects, hear what's really being said, or become… |
| `adaptability` | When the user wants to improve their ability to adjust their approach based on buyer personality, industry, or… |
| `analytics-tracking` | When the user wants to set up, improve, or audit sales metrics and pipeline tracking |
| `appointment-booking` | When the user wants to build or improve a sales bot's ability to integrate with calendars and schedule meeting… |
| `asking-effective-questions` | When the user wants to improve their questioning technique in sales conversations, uncover pain points, unders… |
| `attachment-media-handling` | When the user wants to build or improve a sales bot's ability to send brochures, videos, floorplans, or other… |
| `budget-extraction-qualification` | When the user wants to build or improve a sales bot's ability to uncover budget and financial capacity |
| `building-rapport` | When the user wants to improve their ability to create genuine connection and trust quickly with prospects |
| `buying-signal-amplification` | When the user wants to build or improve a sales bot's ability to recognize and reinforce buying signals |
| `callback-scheduling` | When the user wants to build or improve a sales bot's ability to offer and confirm specific callback times whe… |
| `channel-fallback-logic` | When the user wants to build or improve a sales bot's ability to try alternative channels when one fails |
| `channel-preference-detection` | When the user wants to build or improve a sales bot's ability to detect and adapt to prospect communication pr… |
| `closing` | When the user wants to improve their ability to recognize buying signals, ask for the sale, and confidently mo… |
| `competitive-intelligence-gathering` | When the user wants to build or improve a sales bot's ability to extract market insights from prospect convers… |
| `competitive-positioning` | When the user wants to improve their ability to differentiate without disparaging competitors |
| `competitor-alternatives` | When the user needs to handle competitive situations in sales conversations |
| `competitor-mention-handling` | When the user wants to build or improve a sales bot's ability to respond appropriately when prospects bring up… |
| `compliance-handling` | When the user wants to build or improve a sales bot's ability to respect opt-outs, DNC lists, and regulatory r… |
| `conversation-ab-testing` | When the user wants to build or improve a sales bot's ability to test individual message variants |
| `conversation-branching` | When the user wants to build or improve a sales bot's ability to dynamically choose conversation paths based o… |
| `conversation-compliance-auditing` | When the user wants to build or improve a sales bot's ability to ensure conversations meet regulatory and comp… |
| `conversation-memory` | When the user wants to build or improve a sales bot's ability to reference previous interactions within and ac… |
| `conversation-pause-intelligence` | When the user wants to build or improve a sales bot's ability to distinguish when prospect silence means think… |
| `conversation-quality-scoring` | When the user wants to build or improve a sales bot's ability to rate conversation quality |
| `conversation-resurrection` | When the user wants to build or improve a sales bot's ability to re-engage dead threads weeks or months later |
| `conversation-summarization` | When the user wants to build or improve a sales bot's ability to create handoff summaries and conversation not… |
| `conversation-velocity-optimization` | When the user wants to build or improve a sales bot's ability to match reply speed to prospect pace |
| `conversational-flow-management` | When the user wants to build or improve a sales bot's ability to keep exchanges natural while progressing towa… |
| `cross-sell-upsell-detection` | When the user wants to build or improve a sales bot's ability to identify expansion opportunities with existin… |
| `custom-field-population` | When the user wants to build or improve a sales bot's ability to automatically update CRM fields from conversa… |
| `customer-onboarding` | When the user wants to optimize new customer onboarding, implementation, time-to-value, or customer activation |
| `customer-referrals` | When the user wants to generate referrals from customers, build partner sales channels, or leverage relationsh… |
| `data-enrichment-integration` | When the user wants to build or improve a sales bot's ability to pull in firmographic or contact data mid-conv… |
| `deal-documentation` | When the user wants to improve deal documentation, CRM hygiene, or sales data structure |
| `deal-review-win-loss` | When the user wants to analyze deal outcomes, conduct win/loss reviews, audit pipeline health, or improve deal… |
| `deal-upselling` | When the user wants to increase deal sizes, upsell existing opportunities, or expand accounts during the sales… |
| `decision-maker-identification` | When the user wants to build or improve a sales bot's ability to identify decision-makers vs gatekeepers |
| `discovery` | When the user wants to improve their ability to run thorough needs assessments before proposing solutions |
| `disqualification-messaging` | When the user wants to build or improve a sales bot's ability to gracefully end conversations with poor-fit pr… |
| `drip-pacing-intelligence` | When the user wants to build or improve a sales bot's ability to adjust sequence timing based on engagement si… |
| `duplicate-conversation-prevention` | When the user wants to build or improve a sales bot's ability to prevent contacting the same prospect through… |
| `dynamic-script-generation` | When the user wants to build or improve a sales bot's ability to generate personalized scripts on the fly |
| `email-sequence` | When the user wants to create or optimize a sales outreach sequence, follow-up cadence, or prospecting campaig… |
| `emotional-arc-management` | When the user wants to build or improve a sales bot's ability to guide conversations through optimal emotional… |
| `empathy` | When the user wants to improve their ability to genuinely understand the buyer's situation and pressures |
| `entity-extraction` | When the user wants to build or improve a sales bot's ability to pull key data points (budget, timeline, compa… |
| `fallback-gracefully` | When the user wants to build or improve a sales bot's ability to handle unexpected inputs without breaking the… |
| `feedback-loop-integration` | When the user wants to build or improve a sales bot's ability to learn from deal outcomes |
| `follow-up-discipline` | When the user wants to improve their persistent but respectful outreach that keeps deals moving |
| `ghost-recovery-sequences` | When the user wants to build or improve a sales bot's ability to recover prospects who stopped responding mid-… |
| `handoff-detection` | When the user wants to build or improve a sales bot's ability to know when to escalate to a human rep |
| `human-in-the-loop-training` | When the user wants to build or improve a sales bot's ability to learn from human corrections and feedback |
| `ideal-customer-profile-matching` | When the user wants to build or improve a sales bot's ability to compare prospects against best customer profi… |
| `intent-detection` | When the user wants to build or improve an automated sales bot's ability to recognize prospect intent—whether… |
| `lead-qualification` | When the user wants to design, optimize, or improve lead qualification forms and processes |
| `lead-qualification-logic` | When the user wants to build or improve a sales bot's ability to ask the right questions to score and route le… |
| `legal-compliance-phrase-avoidance` | When the user wants to build or improve a sales bot's ability to avoid making claims that create liability |
| `meeting-confirmation-reminder-logic` | When the user wants to build or improve a sales bot's ability to confirm meetings and reduce no-shows |
| `meeting-conversion` | When the user wants to improve meeting show rates, optimize prospect engagement, or convert scheduled meetings… |
| `message-deliverability-optimization` | When the user wants to build or improve a sales bot's ability to manage sender reputation and ensure messages… |
| `micro-commitment-stacking` | When the user wants to build or improve a sales bot's ability to get small agreements that lead to larger ones |
| `multi-channel-coordination` | When the user wants to build or improve a sales bot's ability to orchestrate SMS, email, voice, and chat witho… |
| `multi-stakeholder-thread-management` | When the user wants to build or improve a sales bot's ability to handle conversations involving multiple decis… |
| `multi-turn-context-retention` | When the user wants to build or improve a sales bot's ability to maintain coherent conversations across dozens… |
| `multilingual-support` | When the user wants to build or improve a sales bot's ability to detect prospect language and respond appropri… |
| `negative-sentiment-de-escalation` | When the user wants to build or improve a sales bot's ability to calm frustrated prospects |
| `negotiation` | When the user wants to improve their ability to find mutually beneficial outcomes without eroding value |
| `objection-handling` | When the user wants to improve their ability to address prospect concerns, overcome resistance, or respond to… |
| `objection-pattern-learning` | When the user wants to build or improve a sales bot's ability to identify emerging objections across campaigns |
| `objection-recognition` | When the user wants to build or improve a sales bot's ability to identify common pushbacks and deliver appropr… |
| `out-of-scope-request-handling` | When the user wants to build or improve a sales bot's ability to gracefully redirect when prospects ask about… |
| `outbound-prospecting` | When the user wants help with outbound sales prospecting, lead sourcing, or pipeline building |
| `performance-analytics` | When the user wants to build or improve a sales bot's ability to track conversion rates, drop-off points, and… |
| `persona-classification` | When the user wants to build or improve a sales bot's ability to identify buyer personality types |
| `personalization-at-scale` | When the user wants to build or improve a sales bot's ability to dynamically insert names, company details, an… |
| `pipeline-management` | When the user wants to improve their ability to maintain healthy deal flow and accurate forecasting |
| `post-meeting-follow-up-automation` | When the user wants to build or improve a sales bot's ability to send relevant materials after meetings |
| `presentation-skills` | When the user wants to improve their ability to deliver clear, engaging demos and pitches |
| `pricing-discussion-logic` | When the user wants to build or improve a sales bot's ability to know when to quote pricing, when to deflect,… |
| `pricing-negotiation` | When the user wants to handle pricing discussions, negotiate deal terms, or defend value against discounting p… |
| `product-knowledge` | When the user wants to improve their understanding of what they sell and how it solves customer problems |
| `propensity-scoring-realtime` | When the user wants to build or improve a sales bot's ability to update lead scores dynamically during convers… |
| `prospect-fatigue-detection` | When the user wants to build or improve a sales bot's ability to recognize over-contacted prospects |
| `prospect-research-integration` | When the user wants to build or improve a sales bot's ability to enrich prospect data from multiple sources |
| `qualifying-leads` | When the user wants to improve their ability to quickly identify who's worth pursuing in sales |
| `question-disambiguation` | When the user wants to build or improve a sales bot's ability to clarify vague or ambiguous responses before p… |
| `re-engagement-sequencing` | When the user wants to build or improve a sales bot's ability to nurture cold leads back into active conversat… |
| `referral-request-timing` | When the user wants to build or improve a sales bot's ability to request referrals at the right moment |
| `reply-prediction` | When the user wants to build or improve a sales bot's ability to anticipate likely responses |
| `resilience` | When the user wants to improve their ability to bounce back from rejection without losing momentum in sales |
| `response-confidence-scoring` | When the user wants to build or improve a sales bot's ability to know when it's uncertain |
| `response-latency-management` | When the user wants to build or improve a sales bot's ability to reply fast enough to feel real-time but not u… |
| `response-length-calibration` | When the user wants to build or improve a sales bot's ability to match message length to channel and prospect… |
| `sales-copy-editing` | When the user wants to edit, review, or improve sales messages, emails, or scripts |
| `sales-copywriting` | When the user wants to write cold outreach, sales emails, LinkedIn messages, or sales scripts |
| `sales-enablement-tools` | When the user wants to create, improve, or deploy sales enablement tools and resources |
| `sales-playbook-scaling` | When the user wants to build, document, or scale sales playbooks and processes |
| `sales-presentations` | When the user wants to create, optimize, or improve sales presentations, pitch decks, demos, or proposal prese… |
| `sales-process-optimization` | When the user wants to optimize their sales process, improve deal flow, reduce friction in the buying journey,… |
| `sales-psychology` | When the user wants to apply psychological principles to sales conversations, understand buyer behavior, or us… |
| `sales-tactics` | When the user needs sales tactics, prospecting ideas, or pipeline generation strategies |
| `scarcity-urgency-calibration` | When the user wants to build or improve a sales bot's ability to use time pressure appropriately |
| `sentiment-analysis` | When the user wants to build or improve a sales bot's ability to gauge prospect tone—frustrated, curious, warm… |
| `sentiment-trend-tracking` | When the user wants to build or improve a sales bot's ability to monitor sentiment over time |
| `social-proof-injection` | When the user wants to build or improve a sales bot's ability to dynamically insert relevant testimonials and… |
| `social-selling` | When the user wants help with social selling, LinkedIn prospecting, building relationships with buyers online,… |
| `spam-bot-detection-avoidance` | When the user wants to build or improve a sales bot's ability to write and send messages in patterns that don'… |
| `storytelling` | When the user wants to improve their ability to use narratives and case studies to make benefits tangible and… |
| `territory-account-launch` | When the user wants to plan a new territory launch, account expansion, or sales campaign kickoff |
| `time-management` | When the user wants to improve their ability to prioritize high-value activities and prospects in sales |
| `time-to-close-prediction` | When the user wants to build or improve a sales bot's ability to estimate deal timelines based on conversation… |
| `timezone-awareness` | When the user wants to build or improve a sales bot's ability to respect prospect time zones for outreach |
| `timing-optimization` | When the user wants to build or improve a sales bot's ability to send messages or make calls when prospects ar… |
| `tone-matching` | When the user wants to build or improve a sales bot's ability to adapt formality based on how the prospect com… |
| `trigger-event-detection` | When the user wants to build or improve a sales bot's ability to recognize external events that create opportu… |
| `urgency-creation` | When the user wants to build or improve a sales bot's ability to introduce scarcity or time-sensitivity withou… |
| `voicemail-drop-optimization` | When the user wants to build or improve a sales bot's ability to leave compelling pre-recorded voicemails at o… |
| `warm-transfer-execution` | When the user wants to build or improve a sales bot's ability to seamlessly connect prospects to live reps wit… |
| `win-loss-reason-extraction` | When the user wants to build or improve a sales bot's ability to automatically categorize why deals closed or… |
| `written-communication` | When the user wants to improve their ability to craft compelling emails, proposals, and follow-ups in sales |

### impeccable — 1 skill

| Skill | What it covers |
|---|---|
| `impeccable` | Use when the user wants to design, redesign, shape, critique, audit, polish, clarify, distill, harden, optimiz… |

### taste-skill — 13 skills

| Skill | What it covers |
|---|---|
| `brandkit` | Premium brand-kit image generation skill for creating high-end brand-guidelines boards, logo systems, identity… |
| `design-taste-frontend` | Anti-slop frontend skill for landing pages, portfolios, and redesigns |
| `design-taste-frontend-v1` | The original v1 taste-skill, preserved for projects depending on its exact behavior |
| `full-output-enforcement` | Overrides default LLM truncation behavior |
| `gpt-taste` | Elite UX/UI & Advanced GSAP Motion Engineer |
| `high-end-visual-design` | Teaches the AI to design like a high-end agency |
| `image-to-code` | Elite website image-to-code skill for Codex |
| `imagegen-frontend-mobile` | Elite mobile app image-generation skill for creating premium, app-native screen concepts and flows |
| `imagegen-frontend-web` | Elite frontend image-direction skill for generating premium, conversion-aware website design references |
| `industrial-brutalist-ui` | Raw mechanical interfaces fusing Swiss typographic print with military terminal aesthetics |
| `minimalist-ui` | Clean editorial-style interfaces |
| `redesign-existing-projects` | Upgrades existing websites and apps to premium quality |
| `stitch-design-taste` | Semantic Design System Skill for Google Stitch |

### ui-ux-pro-max-skill — 7 skills

| Skill | What it covers |
|---|---|
| `banner-design` | Design banners for social media, ads, website heroes, creative assets, and print |
| `brand` | Brand voice, visual identity, messaging frameworks, asset management, brand consistency |
| `design` | Comprehensive design skill: brand identity, design tokens, UI styling, logo generation (55 styles, Gemini AI),… |
| `design-system` | Token architecture, component specifications, and slide generation |
| `slides` | Create strategic HTML presentations with Chart.js, design tokens, responsive layouts, copywriting formulas, an… |
| `ui-styling` | Create beautiful, accessible user interfaces with shadcn/ui components (built on Radix UI + Tailwind), Tailwin… |
| `ui-ux-pro-max` | UI/UX design intelligence for web and mobile |

### no-ai-slop — 1 skill

| Skill | What it covers |
|---|---|
| `no-ai-slop` | Edit drafts into sharper, more human writing while preserving the writer's personal voice, or detect AI-slop p… |

### awesome-claude-design — 1 skill

| Skill | What it covers |
|---|---|
| `awesome-claude-design` | Reference library of production-grade DESIGN.md aesthetic specs (colors, type scales, component rules, motion)… |

### claude-ads — 34 skills

| Skill | What it covers |
|---|---|
| `ads` | Operate professional paid advertising across Google, Meta, YouTube, LinkedIn, TikTok, Microsoft, Apple, Amazon… |
| `ads-amazon` | Audit Amazon Ads profiles, regions, Sponsored Products, Sponsored Brands, Sponsored Display, DSP, portfolios,… |
| `ads-apple` | Audit Apple Ads measurement, AdServices and AdAttributionKit, campaign and keyword structure, Search Match, Ap… |
| `ads-attribution` | Audit cross-platform attribution, conversion definitions, reporting windows, GA4, AdServices and AdAttribution… |
| `ads-audit` | Run a source-grounded paid-advertising audit for one or more of Google, Meta, YouTube, LinkedIn, TikTok, Micro… |
| `ads-budget` | Plan and review paid-media budgets, bidding, pacing, marginal return, forecasts, CPA, ROAS, MER, LTV:CAC, cons… |
| `ads-competitor` | Research competitor paid-ad presence, messaging, creative, formats, landing pages, keyword and auction signals… |
| `ads-create` | Create source-grounded paid-ad campaign concepts, messaging, copy, creative briefs, and production plans from… |
| `ads-creative` | Audit paid-ad copy, images, video, hooks, concepts, format coverage, platform-native fit, message match, creat… |
| `ads-dna` | Extract a public-safe brand and offer profile for paid advertising from an authorized website and operator inp… |
| `ads-generate` | Generate paid-ad image assets from a validated creative brief and brand profile using an explicitly configured… |
| `ads-google` | Audit Google Ads measurement, Search, Shopping, Performance Max, Demand Gen, YouTube-linked inventory, keyword… |
| `ads-landing` | Audit paid-ad landing pages for message match, mobile experience, performance, accessibility, trust, forms, co… |
| `ads-launch` | Draft or explicitly apply a paid-ad campaign launch through Claude Ads capability-gated adapters |
| `ads-linkedin` | Audit LinkedIn Ads measurement, Insight Tag and conversions, professional audiences, lead generation, ABM, cre… |
| `ads-math` | Calculate and model paid-media CPA, CPL, CPC, CPM, ROAS, MER, break-even targets, contribution margin, LTV:CAC… |
| `ads-meta` | Audit Meta Ads measurement, Pixel and Conversions API, attribution, Facebook and Instagram creative, audiences… |
| `ads-microsoft` | Audit Microsoft Advertising measurement, UET, search and audience campaigns, Google imports, syndication, keyw… |
| `ads-monitor` | Monitor paid-ad account pacing, delivery, performance, creative fatigue, tracking, policy, and data quality ac… |
| `ads-optimize` | Diagnose and draft or explicitly apply paid-ad optimizations using evidence, financial constraints, experiment… |
| `ads-photoshoot` | Generate rights-cleared paid-ad product photography variants from an authorized source image and validated bra… |
| `ads-pinterest` | Audit Pinterest Ads measurement, Pinterest Tag and Conversions API, catalog and shopping readiness, visual cre… |
| `ads-plan` | Create a professional paid-advertising strategy covering objectives, economics, platform selection, campaign a… |
| `ads-reddit` | Audit Reddit Ads measurement, campaign structure, community and interest targeting, creative-native fit, catal… |
| `ads-report` | Render Markdown, HTML, or PDF paid-advertising reports from a validated Claude Ads JSON run bundle |
| `ads-research` | Refresh Claude Ads platform, API, policy, regulation, benchmark, issue, pull-request, fork, and repository evi… |
| `ads-server-side-tracking` | Audit server-side paid-media measurement including server-side tag management, platform conversion APIs, event… |
| `ads-setup` | Set up a paid-media client, brand, account, data-source, privacy, and mutation-guardrail profile for Claude Ad… |
| `ads-snapchat` | Audit Snapchat Ads measurement, Snap Pixel and Conversions API, mobile and app campaigns, creative, AR and cat… |
| `ads-test` | Design and evaluate paid-ad experiments with hypotheses, randomization units, sample-size and duration assumpt… |
| `ads-tiktok` | Audit TikTok Ads measurement, Pixel and Events API, mobile-first creative, audiences, Smart+, Shop and commerc… |
| `ads-validate` | Validate Claude Ads contracts, scoring inputs, run bundles, capabilities, source freshness, safety, installati… |
| `ads-x` | Audit X Ads measurement, X Pixel and Conversions API, campaign objectives, keyword and conversation targeting,… |
| `ads-youtube` | Audit YouTube Ads campaign setup, video and Demand Gen inventory, Shorts, in-stream, CTV, creative, audiences,… |

### nano-banana-2-skill — 1 skill

| Skill | What it covers |
|---|---|
| `nano-banana` | Generates AI images using the nano-banana CLI (Gemini 3.1 Flash default, Pro available) |

### gpt-image-2-skill — 1 skill

| Skill | What it covers |
|---|---|
| `gpt-image` | Generate and edit images using OpenAI's gpt-image-2 model via CLI scripts |
