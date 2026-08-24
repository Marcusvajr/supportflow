$ErrorActionPreference = "Stop"

Write-Host "Instalando skills universais do SupportFlow..."

npx skills add https://github.com/hashicorp/agent-skills --yes --skill terraform-style-guide --agent universal
npx skills add https://github.com/vercel/next.js/tree/canary/skills --yes --agent universal --skill next-best-practices next-cache-components deploy-to-vercel react-best-practices web-design-guidelines composition-patterns
npx skills add https://github.com/prisma/skills --yes --agent universal --skill prisma-database-setup
npx skills add https://github.com/supabase/agent-skills --yes --agent universal
npx skills add https://github.com/clerk/skills --yes --agent universal --skill clerk-setup clerk
npx skills add https://github.com/mattpocock/skills --yes --agent universal --skill improve-codebase-architecture
npx skills add https://github.com/addyosmani/agent-skills --yes --agent universal --skill frontend-ui-engineering code-review-and-quality ci-cd-and-automation
npx skills add https://github.com/sickn33/antigravity-awesome-skills --yes --agent universal --skill backend-architect nestjs-expert docker-expert github-actions-templates

Write-Host "Concluído. Verifique a pasta .agents/skills/."
