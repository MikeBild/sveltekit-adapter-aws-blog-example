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

---

# Handle Page Data

**+page.server.ts**

```ts
import type { PageServerLoad } from './$types';
export const load: PageServerLoad = async (event) => {};
```

**+page.ts**

```ts
import type { PageLoad } from './$types';
export const load: PageLoad = async (event) => {}
```

**+page.svelte**

```html
<script lang="ts">
  import type { PageData } from './$types';
  export let data: PageData;
</script>
```

<style scoped> { font-size: 2rem; }</style>

---

# Handle Form Data

**+page.server.ts**

```ts
import type { Actions } from './$types';

export const actions: Actions = {
  default: async ({ request }) => {
    const form = await request.formData();
    const email = form.get('email');
    return { success: true }
  }
}
```

**+page.svelte**

```html
<script lang="ts">
  import type { ActionData } from './$types';
  export let form: ActionData;
</script>

<form method="post">
  <input type="email" name="email" required />
  <input type="submit" value="submit" />
</form>
```

<style scoped> { font-size: 1.65rem; }</style>

---

# Handle API Data

**+server.ts**

```ts
import { json, error, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async () => {
  return json({});
};

export const PUT: RequestHandler = async () => {
  return json({});
};

```

**+page.ts**

```ts
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
  const request = await fetch('/api/likes');
  const data = await request.json();

  return { data };
};
```

<style scoped> { font-size: 1.65rem; }</style>

---

# Layout & Styles

**+layout.ts**

```ts
<script lang="ts">
  import '@picocss/pico/scss/pico.scss';
  import '../app.scss';
  import Header from '$lib/components/Header.svelte';
</script>

<Header />

<main class="container">
  <slot />
</main>
```

---

# Components

**src/lib/components/Header.svelte**

```html
<header>
  <nav class="container-fluid">
    <ul>
      <li><strong><a href="/">Workshop</a></strong></li>
    </ul>
    <ul>
      <li><a href="/posts">posts</a></li>
      <li><a href="/contact">contact</a></li>
      <li><a href="/slides.html" target="_blank">slides</a></li>
    </ul>
  </nav>
</header>
```

---

# SEO

```html
<svelte:head>
  <title>Welcome</title>
</svelte:head>
```

That's all ;-)

---

# Environment Variables

```ts
import { TABLENAME } from '$env/static/private';
```

---

# Testing

**tests/pages.spec.ts**

```ts
import { expect, test } from '@playwright/test';

test('start page has expected h2', async ({ page }) => {
  await page.goto('/');
  expect(await page.textContent('h2')).toBe('Welcome');
});
```

**tests/api.spec.ts**

```ts
import { expect, test } from '@playwright/test';

test('GET /api/likes export status code 200', async ({ request }) => {
  const expected = await request.get('/api/likes');

  expect(expected.status()).toBe(200);
});

```

<style scoped> { font-size: 1.9rem; }</style>

---

# AWS-CDK

- Infrastructure as Code that syntheses CloudFormation templates
- Configuration and dependency management of cloud resources
- Supports multiple development languages
- Extendable and compositional construction API

---

# AWS-CDK Anatomy

![Anatomy](image.png)

---

# Constructs

- Construct represents a "cloud component" (e.g. a single AWS resource)
  Different levels of constructs
  - Layer 1 - CFN Resources - generated from CF Resource Specification
  - Layer 2 - Higher-Level, reduced complexity, intent-based API
  - Layer 3 - Pattern as complete common tasks in AWS
- Composition is the key pattern for higher-level abstractions through constructs

---

# Stacks

- Stack is a construct that represents a independent deployment unit
- Synthesized into a AWS CloudFormation template for deployments
- It needs to be instantiated

---

# App

- App is a construct and a container for one or more stacks
- App doesn't require any initialization arguments
- App is the root for the construct tree

---

# AWS-CDK issues

- Do not renaming resources after deployment - think about naming conventions
- Cycling dependencies
  - Use interfaces
  - Try to reorganize stacks into separate stacks
  - Try to wildcard policies and permissions
  - Use custom resources
  - Try to resolve resources on application development level

---

# SvelteKit Adapter AWS

**infrastrcture/deploy.js**
```ts
import { App } from 'aws-cdk-lib';
import { AWSAdapterStack } from 'sveltekit-adapter-aws';

const app = new App();

new AWSAdapterStack(app,  'sveltekit-adapter-aws-webapp');
```

**svelte.config.js**
```js
{
  adapter: adapter({
    cdkProjectPath: join(process.cwd(), 'infrastructure/deploy.js')
  })
}
```