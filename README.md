# deepset Cloud file deleter

[![Test](https://github.com/silvanocerza/deepset-cloud-file-deleter/actions/workflows/test.yml/badge.svg)](https://github.com/silvanocerza/deepset-cloud-file-deleter/actions/workflows/test.yml)
[![CodeQL](https://github.com/silvanocerza/deepset-cloud-file-deleter/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/silvanocerza/deepset-cloud-file-deleter/actions/workflows/codeql-analysis.yml)

Use this GH Action to delete files from [deepset Cloud](cloud.deepset.ai).

## Usage

A minimal usage of this action could look like the example below. `api-key`, `workspace-name` and `file` are always required, if they're not the action will fail.
In this case we're deleting the `my-file.md` file from the workspace specified by the `DEEPSET_CLOUD_WORKSPACE` secret.

If no file is found the action won't fail.

```
- name: Delete file from deepset Cloud
  uses: silvanocerza/deepset-cloud-file-deleter@v1
  with:
    api-key: ${{ secrets.DEEPSET_CLOUD_API_KEY }}
    workspace-name: ${{ secrets.DEEPSET_CLOUD_WORKSPACE }}
    file: my-file.md
```

By default deleter will fail if multiple files with the specified name exist in the specified workspace. If you want to delete all found files set the `safe` flag to `false`.

```
- name: Delete file from deepset Cloud
  uses: silvanocerza/deepset-cloud-file-deleter@v1
  with:
    api-key: ${{ secrets.DEEPSET_CLOUD_API_KEY }}
    workspace-name: ${{ secrets.DEEPSET_CLOUD_WORKSPACE }}
    file: my-file.md
    safe: false
```

## Development

Install dependencies

```bash
$ npm install
```

Lint, test and build the typescript and package it for distribution

```bash
$ npm run all
```

Run the tests :heavy_check_mark:

```bash
$ npm test
```

If `DEEPSET_CLOUD_API_KEY` and `DEEPSET_CLOUD_WORKSPACE` env vars are set integrations tests will also be run.

⚠️⚠️⚠️
Integration test are destructive and delete all files in the used workspace after each tests. Run them only in a test workspace in which you can afford to lose files!
⚠️⚠️⚠️
