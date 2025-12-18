import { defineConfig } from 'orval';

export default defineConfig({
  attendees: {
    output: {
      mode: 'tags-split',
      target: 'lib/generated/api.ts',
      schemas: 'lib/generated/models',
      client: 'axios',
      mock: false,
      clean: true,
      prettier: true,
      override: {
        mutator: {
          path: 'lib/api-mutator.ts',
          name: 'customInstance',
        },
      },
    },
    input: {
      // Option 1: Use local OpenAPI spec file (default)
    //   target: './openapi.yaml',
      
      // Option 2: Use URL to fetch OpenAPI spec from running backend (uncomment to use)
      target: process.env.OPENAPI_URL || 'http://0.0.0.0:8080/api-json',
    },
    hooks: {
      afterAllFilesWrite: 'prettier --write',
    },
  },
});

