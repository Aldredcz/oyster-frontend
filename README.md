# Oyster Frontend!
## Prerequisites:
```
node >=6.10
yarn >=0.22 || npm >=3.10
```


## Installation:
```
npm start
```
Content is served on URL `localhost:9090`. also uses `localhost:8899` behind the curtains for serving Javascript.

If you wanna set custom URL for backend requests, you can do it in browser console with `SETTINGS.setApiUrl('<custom_url>')` and refreshing page (F5). This settings persist in your browser, if you wanna reset it, use `SETTINGS.resetApiUrl()` and push F5 again.
