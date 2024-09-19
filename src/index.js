import configs from "./configs";
import ReactDOM from "react-dom";
import React from "react";
import * as Sentry from "@sentry/browser";
import "abortcontroller-polyfill/dist/polyfill-patch-fetch";
import App from "./ui/App";
import Api from "./api/Api";
import { initTelemetry } from "./telemetry";

if (configs.SENTRY_DSN) {
  Sentry.init({
    dsn: configs.SENTRY_DSN,
    release: process.env.BUILD_VERSION,
    integrations(integrations) {
      return integrations.filter(integration => integration.name !== "Breadcrumbs");
    }
  });
}

initTelemetry();

// eslint-disable-next-line no-undef
console.info(`Spoke version: ${process.env.BUILD_VERSION}`);

const api = new Api();

ReactDOM.render(<App api={api} />, document.getElementById("app"));

// post access info to hubs-observer
var email = "anonymous";
var from = window.location.href;
const localStorageData = localStorage.getItem("___hubs_store");
if (localStorageData) {
    email = JSON.parse(localStorageData).credentials.email;
} 

const req = {
 visitor: { mail: email },
 visited_from: from,
};

fetch('https://hcce-observer-955595017457.us-central1.run.app/visited', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(req)
})