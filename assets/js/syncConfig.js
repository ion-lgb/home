// 远程同步配置：默认关闭。将 enabled 设为 true 并填写 endpoint/API Key 后
// 就可以让所有访问者加载同一份内容。
export const remoteSyncConfig = {
  enabled: false,
  endpoint: "http://localhost:4000/api/content", // 例如 https://api.example.com/content
  readMethod: "GET",
  writeMethod: "PUT",
  apiKeyHeader: "X-API-Key",
  apiKey: "",
  extraHeaders: {},
  /**
   * 如果你的服务需要自定义写入 body，可改写这个函数。
   * 默认直接写入 JSON 内容。
   */
  transformRequestBody(content) {
    return JSON.stringify(content);
  }
};
