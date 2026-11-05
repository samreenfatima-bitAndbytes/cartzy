# Cartzy static demo — local setup

Vite + React static build for Vercel. No Node API, PHP, or WordPress.

## Run locally

```bash
cd local-projects/cartzy-static
npm install
npm run dev
```

Open http://localhost:2140

## Demo login

| Role | Email | Password |
|------|-------|----------|
| Merchant | `merchant@cartzy.demo` | `DemoPass1!` |

## Flows

- Landing → Sign in → merchant builder (overview, products, orders, shop settings)
- Switch between **Northloom Goods** and **Fieldkit Supply** in the sidebar
- Storefronts: `/s/northloom`, `/s/fieldkit` → add to cart → checkout
- Orders land under the active shop’s Orders page

## Vercel

- Root: this folder
- Build: `npm run build`
- Output: `dist`
