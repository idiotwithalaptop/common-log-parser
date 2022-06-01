import { LogAnalyser, LogAnalyserReport, LogEntry } from "../types";
import { StringOccuranceCounter } from "./stringOccuranceCounter";

const ANALYSER_NAME = "Top Three URL Analyser";
export class TopThreeUrlAnalyser implements LogAnalyser {
  private readonly urls: StringOccuranceCounter;

  constructor() {
    this.urls = new StringOccuranceCounter();
  }

  analyse(entry: LogEntry): Promise<void> {
    return new Promise((resolve) => {
      if (entry && entry.request) {
        this.urls.add(entry.request.path);
      }
      resolve();
    });
  }

  report(): Promise<LogAnalyserReport> {
    return new Promise<LogAnalyserReport>((resolve) => {
      // Handle special case where no URLs were analysed
      if (this.urls.count() === 0) {
        resolve({
          name: ANALYSER_NAME,
          result: "  There were 0 URLs analysed.",
        });
        return;
      }

      resolve({
        name: ANALYSER_NAME,
        result: this.urls.getTopOccurancesString(3),
      });
    });
  }
}
