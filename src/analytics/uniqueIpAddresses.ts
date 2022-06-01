import { LogAnalyser, LogAnalyserReport, LogEntry } from "../types";

export class UniqueIpAddressAnalyser implements LogAnalyser {
  private readonly ipAddresses: Set<string>;

  constructor() {
    this.ipAddresses = new Set<string>();
  }

  analyse(entry: LogEntry): Promise<void> {
    return new Promise((resolve) => {
      if (entry && entry.ipAddress) {
        this.ipAddresses.add(entry.ipAddress);
      }
      resolve();
    });
  }

  report(): Promise<LogAnalyserReport> {
    return new Promise<LogAnalyserReport>((resolve) => {
      resolve({
        name: "Unique IP Address Analyser",
        result: `There were ${this.ipAddresses.size} unique IP addresses analysed.`,
      });
    });
  }
}
