**_For correct work without IVY Renderer, all inner Inputs, Outputs and all host properties ​​must be initialized, you can set them to "undefined"._**

For check project ready to use bindIO directives, you may use [ngx-bind-io-cli](https://www.npmjs.com/package/ngx-bind-io-cli) and run:

```bash
npx ngx-bind-io-cli ./src --maxInputs=0 --maxOutputs=0
```

For check and add initialize statement:

```bash
npx ngx-bind-io-cli ./src --fix=all --maxInputs=0 --maxOutputs=0
```

For check and add initialize statement if you want correct work with tspath:

```bash
npx ngx-bind-io-cli ./src --fix=all --maxInputs=0 --maxOutputs=0  --tsconfig=./src/tsconfig.app.json
```
