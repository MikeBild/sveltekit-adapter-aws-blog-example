---
marp: true
title: SvelteKit & AWS-CDK
description: SvelteKit & AWS-CDK
theme: uncover
paginate: true
_paginate: false
---

<style>ul { font-size: 20px; }</style>

# <!--fit--> Serverless Development

## Sveltekit & AWS-CDK

https://github.com/MikeBild/sveltkit-adapter-aws-blog

---

# WHY!

- A productive full stack developer experience
- Reduce and conveniences the initial setup complexity of serverless cloud development
- High performance web application using Static Sites, SSR and CSR
- Code reuse by modular design and components
- Stable deployable, scalable and secure cloud based runtime environment

---

# HOW!

- SvelteKit + AWS-CDK = Svelte Adapter AWS
  - [NPM](https://www.npmjs.com/package/sveltekit-adapter-aws)
  - [GitHub](https://github.com/MikeBild/sveltekit-adapter-aws)
- SvelteKit adapters are small plugins to transform build inputs to deployable outputs
- Note the AWS resource quotas!

---

# WHAT!

- Building a simple project structure
- Setup and configuration of infrastructure and deployment environment(s)
- Setup the testing environment
- Integration of CI and CD (GitHub Actions)
- Additional development tools
  - [VS Code extensions](https://marketplace.visualstudio.com/items?itemName=svelte.svelte-vscode)
  - Custom-Stacks, Storybook, Component-Library, Markdown Svelte Extension, etc.

---

# Prerequisites

- NodeJS >= 16.x / NVM
- AWS account setup
- Install and setup the [AWS-CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)
  - `aws configure`
- Install and bootstrapping the [AWS-CDK](https://www.npmjs.com/package/aws-cdk)
  - `npm install -g aws-cdk`
  - `cdk bootstrap aws://<account-id>/<region>`

---

# SvelteKit

- `npm create svelte@latest blog`
- `npm run dev`

---

# SvelteKit Adapter AWS

- `npm install -D sveltekit-adapter-aws`
- edit the **svelte.config.js**

```js
import { adapter } from 'sveltekit-adapter-aws';
```

- `npm run build`

---

# SvelteKit

- The lightness of Svelte combined with flexible filesystem-based routing
- Supports Static-Sites, Client- and Server-Side-Rendering and JSON APIs
- Nice initial load experience
- App-like navigation within uncompromising SEO
- Structure applications into Pages, Layouts and UI Components
- Supports Service-Worker and Progressive Web Apps
- Extensible using hooks as middleware
- Fast DX using VITE and Playwright

---

## Project structure

```sh
.
├── src
├── static
└── tests
```

- **src**
  - **lib** library code (import via $lib)
  - **routes** contains pages
  - **app.html** page template
- **static** static assets (robots.txt, images, etc.)
- **tests** contains specs/tests

---

# Routing

```sh
src/routes
├── +layout.svelte
├── +page.svelte
├── api
├── contact
└── posts
```

- Directory based routing
  - **+page.svelte** page component rendered on CSR + SSR
  - **+page.ts/js** load data CSR + SSR
  - **+page.server.ts/js** handle data SSR only
  - **+server.ts/js** defines API like routes
