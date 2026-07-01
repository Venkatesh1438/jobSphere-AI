# Contributing to JobSphere AI

Thank you for contributing to JobSphere AI! As an enterprise-grade platform, we maintain strict code standards, quality assurance, and architecture paradigms.

## Development Workflows

### Monorepo Layout
Avoid putting cross-cutting code where it doesn't belong. Keep client assets in `/frontend` and API models/views in `/backend`.

### Backend Standards (Django)
1. **Formatting**: Code must pass `ruff` check or `black` formatting.
2. **Migrations**: Always run `python manage.py makemigrations` and include migration files in the same pull request as the model changes.
3. **Typing**: Use standard Python type hinting.
4. **Environment Variables**: Add new environment configurations to both `.env.example` and `/backend/config/settings/base.py`.

### Frontend Standards (React)
1. **React 18**: Ensure all libraries are fully compatible with React 18.3.x.
2. **Tailwind CSS**: Use Tailwind CSS v3.4.x utility classes. Follow standard design tokens defined in `tailwind.config.js`.
3. **Module Imports**: Always use the `@` alias configuration (e.g., `@/components/ui/Button` instead of relative paths `../../components/ui/Button`).
4. **Types**: Avoid `any` types. Make full use of TypeScript interfaces and Zod validation schemas.

---

## Branching and PR Guidelines

1. Create a branch named by category:
   - `feature/feature-name`
   - `bugfix/bug-name`
   - `docs/doc-name`
2. Run linters locally before pushing code:
   - Backend: `ruff check .`
   - Frontend: `npm run lint` & `npm run build`
3. Write description summaries explaining "What", "Why", and "How" it was verified.
