// Mirrors the service's SSE framing: `\` and newlines inside a data line are escaped
const unescapeData = (data: string) =>
  data.replace(/\\(n|\\)/g, (_, c: string) => (c === "n" ? "\n" : "\\"));

export const readSse = async (
  body: ReadableStream<Uint8Array>,
  onEvent: (event: string, data: string) => void,
) => {
  const reader = body.getReader();
  const decoder = new TextDecoder();

  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const blocks = buffer.split("\n\n");
    buffer = blocks.pop() ?? "";

    for (const block of blocks) {
      let event = "message";
      let data: string | null = null;

      for (const line of block.split("\n")) {
        if (line.startsWith("event: ")) event = line.slice(7);
        else if (line.startsWith("data: ")) data = line.slice(6);
      }

      if (data !== null) onEvent(event, unescapeData(data));
    }
  }
};
