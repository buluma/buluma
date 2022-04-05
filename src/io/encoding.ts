export function fromBase64(content: string) {
  return Buffer.from(content, "base64").toString("ascii");
}

export function toBase64(content: string) {
  return Buffer.from(content).toString("base64");
}
