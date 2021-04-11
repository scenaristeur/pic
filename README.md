# pic

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```
### custom service worker
https://levelup.gitconnected.com/vue-pwa-example-298a8ea953c9

https://github.com/stetrevor/vuejs-pwa-demo

```
npm run build && cd dist && npx http-server && cd ..
```

### ngrok

ngrok http --host-header=rewrite 8080

https://gist.github.com/xola139/906cff7d4c2460e6de1dd6998386a0d8

When Invalid Host Header when ngrok tries to connect to Angular or React dev server use this form for run ngrok.

( ? ngrok http 8080 -host-header="localhost:8080" )
ngrok http --host-header=rewrite 8080

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
