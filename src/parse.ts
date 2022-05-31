import { LogEntry } from "./types";

export default function parse(log: string): Promise<LogEntry> {
  return new Promise<LogEntry>((resolve, reject) => {
    reject("Not implemented yet");
  });
}
