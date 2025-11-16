import { remoteSyncConfig } from "./syncConfig.js";

function isRemoteSyncEnabled() {
  return Boolean(remoteSyncConfig.enabled && remoteSyncConfig.endpoint);
}

function buildHeaders(contentType = "application/json") {
  const headers = new Headers(remoteSyncConfig.extraHeaders || {});
  if (contentType) headers.set("Content-Type", contentType);
  if (remoteSyncConfig.apiKey) {
    headers.set(remoteSyncConfig.apiKeyHeader || "X-API-Key", remoteSyncConfig.apiKey);
  }
  return headers;
}

async function fetchRemoteContent() {
  if (!isRemoteSyncEnabled()) return null;
  try {
    const response = await fetch(remoteSyncConfig.endpoint, {
      method: remoteSyncConfig.readMethod || "GET",
      headers: buildHeaders(null),
      cache: "no-cache"
    });
    if (!response.ok) {
      console.warn("远程内容读取失败", response.status);
      return null;
    }
    if (response.status === 204) return null;
    return await response.json();
  } catch (error) {
    console.warn("远程内容读取异常", error);
    return null;
  }
}

async function pushRemoteContent(content) {
  if (!isRemoteSyncEnabled()) return;
  try {
    const bodyFactory = remoteSyncConfig.transformRequestBody || ((payload) => JSON.stringify(payload));
    const body = bodyFactory(content);
    await fetch(remoteSyncConfig.endpoint, {
      method: remoteSyncConfig.writeMethod || "PUT",
      headers: buildHeaders("application/json"),
      body
    });
  } catch (error) {
    console.warn("远程内容同步失败", error);
  }
}

export { fetchRemoteContent, pushRemoteContent, isRemoteSyncEnabled };
