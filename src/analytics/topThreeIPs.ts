import { LogAnalyser, LogAnalyserReport, LogEntry } from "../types";
import { StringOccuranceCounter } from "./stringOccuranceCounter";

const ANALYSER_NAME = "Top Three IP Address Analyser";
export class TopThreeIpAnalyser implements LogAnalyser {
  private readonly ips: StringOccuranceCounter;

  constructor() {
    this.ips = new StringOccuranceCounter();
  }

  analyse(entry: LogEntry): Promise<void> {
    return new Promise((resolve) => {
      if (entry && entry.ipAddress) {
        this.ips.add(entry.ipAddress);
      }
      resolve();
    });
  }

  report(): Promise<LogAnalyserReport> {
    return new Promise<LogAnalyserReport>((resolve) => {
      // Handle special case where no IPs were analysed
      if (this.ips.count() === 0) {
        resolve({
          name: ANALYSER_NAME,
          result: "  There were 0 IP addresses analysed.",
        });
        return;
      }

      resolve({
        name: ANALYSER_NAME,
        result: this.ips.getTopOccurancesString(3),
      });
    });
  }
}
