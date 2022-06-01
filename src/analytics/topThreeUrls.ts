import { LogAnalyser, LogAnalyserReport, LogEntry } from "../types";

const ANALYSER_NAME = "Top Three URL Analyser";
export class TopThreeUrlAnalyser implements LogAnalyser {
  private readonly urls: Map<string, number>;

  constructor() {
    this.urls = new Map<string, number>();
  }

  analyse(entry: LogEntry): Promise<void> {
    return new Promise((resolve) => {
      if (entry && entry.request) {
        let count = 0;
        const requestPath = entry.request.path;
        if (this.urls.has(requestPath)) {
          count = this.urls.get(entry.request.path);
        }
        this.urls.set(entry.request.path, ++count);
      }
      resolve();
    });
  }

  report(): Promise<LogAnalyserReport> {
    return new Promise<LogAnalyserReport>((resolve) => {
      // Handle special case where no URLs were analysed
      if (this.urls.size == 0) {
        resolve({
          name: ANALYSER_NAME,
          result: "There were 0 URLs analysed.",
        });
        return;
      }

      const top3Urls = Array.from(this.urls.entries())
        .sort((urlA, urlB) => {
          return urlB[1] - urlA[1];
        })
        .slice(0, 3)
        .reduce((previous, current, index, array) => {
          if (index === 0) {
            return ` - ${current[0]}`;
          } else {
            return `${previous}\n - ${current[0]}`;
          }
        }, "");
      resolve({
        name: ANALYSER_NAME,
        result: top3Urls,
      });
    });
  }
}
