# PD Client

[![MIT License](https://img.shields.io/github/license/itskyedo/pd-client?color=blue)](https://github.com/itskyedo/pd-client/blob/main/LICENSE)
[![Project Status](https://img.shields.io/badge/project_status-pre--alpha-red)](https://github.com/itskyedo/pd-client)
[![Last Commit](https://img.shields.io/github/last-commit/itskyedo/pd-client/main?color=orange)](https://github.com/itskyedo/pd-client)
[![Commit Activity](https://img.shields.io/github/commit-activity/m/itskyedo/pd-client/main?color=brightgreen)](https://github.com/itskyedo/pd-client)
[![GitHub Stars](https://img.shields.io/github/stars/itskyedo/pd-client)](https://github.com/itskyedo/pd-client)

> [!IMPORTANT]
> This is an unofficial library developed independently and is not affiliated
> with or officially supported by PagerDuty.

## 👋 Introduction

PD Client is an unofficial TypeScript client for PagerDuty.

### Purpose

While PagerDuty provides actively maintained client libraries in several
languages, the TypeScript ecosystem remains comparatively limited. Existing
solutions focus primarily on basic transport-level access with limited type
safety. This exposes several underlying pain points:

- Limited type safety leads to fragile integrations, which introduces
  error-prone queries and unncessary server-side processing costs
- High cognitive overhead and reliance on implicit domain knowledge increases
  integration and support costs
- Inconsistent API behavior increases friction by pushing implementation
  complexity onto downstream codebases
- Modern developer expectations require a dedicated developer experience layer,
  not just an HTTP client

As TypeScript continues to see widespread adoption across both frontend and
backend environments, the need for a dedicated library that provides a type-safe
and ergonomic abstraction has become increasingly important.

### Features

- Fully type-safe API
- Built on PagerDuty's official OpenAPI specification
- Support for region selection (i.e. `us` or `eu`)
- Support for multiple versions

## 🚀 Getting Started

### Project Status

The library is in active development but due to it being in an experimental
stage, production use is not recommended at this time. The goal is to finalize
the API and reach 100% test coverage as part of the 1.0 release.

## 💡 Example

### Client initialization

```typescript
import { createClient } from '@itskyedo/pd-client';

export const pagerduty = createClient({
  token: 'your-api-token',

  // Optionally, you can pass in additional options:
  core: {
    version: 2,
    defaultFrom: 'me@example.com,
  },
  events: {
    version: 2,
  },
});

export async function builtInMethodsExample(): void {
  // Fully type-safe API
  const { data, error } = await pagerduty.createIncident({
    title: 'The server is on fire.',
    service: {
      id: 'PWIXJZS',
      type: 'service_reference',
    },
    priority: {
      id: 'P53ZZH5',
      type: 'priority_reference',
    },
    urgency: 'high',
    incident_key: 'baf7cf21b1da41b4b0221008339ff357',
    incident_type: {
      name: 'major_incident',
    },
    escalation_policy: {
      id: 'PT20YPA',
      type: 'escalation_policy_reference',
    },
  });

  if (error) {
    console.error(error);
    return;
  }

  console.log(`Incident created: ${data.incident.id}`);
}

// Alternatively, you can use the inner implementation if you need more control
// or if a built-in method has not yet been created.
export async function httpMethodsExample(): void {
  // This is also fully-typed, including the endpoint path and parameters
  const response = await pagerduty.fetchers.core.POST('/incidents', {
    headers: {...}
    body: {
      incident: {...}
    },
  });
}
```

## 📃 License

Created by [Kyedo](https://github.com/itskyedo) and is licensed under the MIT
License. See [LICENSE](./LICENSE) for more details.
