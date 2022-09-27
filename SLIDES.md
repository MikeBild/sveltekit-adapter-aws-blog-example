---
marp: true
title: SvelteKit & AWS-CDK
description: SvelteKit & AWS-CDK
theme: uncover
paginate: true
_paginate: false
---

# <!--fit--> Serverless Development

## Sveltekit & AWS-CDK

https://github.com/MikeBild/sveltkit-adapter-aws-blog

<style scoped>a { color: #eee; }</style>

---

# WHY!

- A productive full stack developer experience
- Reduce and conveniences the initial setup complexity of serverless cloud development
- High performance web application using Static Sites, SSR and CSR
- Code reuse by modular design and components
- Stable deployable, scalable and secure cloud based runtime environment

<style scoped>ul { font-size: 20px; }</style>

---

# HOW!

- SvelteKit + AWS-CDK = Svelte Adapter AWS
  - https://www.npmjs.com/package/sveltekit-adapter-aws
  - https://github.com/MikeBild/sveltekit-adapter-aws
- SvelteKit adapters are small plugins to transform build inputs to deployable outputs
- In case of AWS note the AWS resource quotas!

<style scoped>ul { font-size: 20px; }</style>

---

```svelte
<svelte:head>
	<title>Welcome</title>
</svelte:head>

<h2>Welcome</h2>
```