import { ReadStream } from "node:tty";
import { createInterface } from "readline";
import { TopThreeIpAnalyser } from "./analytics/topThreeIPs";
import { TopThreeUrlAnalyser } from "./analytics/topThreeUrls";
import { UniqueIpAddressAnalyser } from "./analytics/uniqueIpAddresses";
import parse from "./parser";
import { LogAnalyserReport } from "./types";

export function analyseLogStream(
  streamIn: ReadStream
): Promise<LogAnalyserReport[]> {
  const top3IpAnalyser = new TopThreeIpAnalyser();
  const top3UrlAnalyser = new TopThreeUrlAnalyser();
  const uniqIpAnalyser = new UniqueIpAddressAnalyser();

  return new Promise<void>((resolve) => {
    const reader = createInterface(streamIn);
    reader.on("line", (line) => {
      parse(line)
        .then((logEntry) => {
          return Promise.all([
            uniqIpAnalyser.analyse(logEntry),
            top3IpAnalyser.analyse(logEntry),
            top3UrlAnalyser.analyse(logEntry),
          ]);
        })
        .catch((error) => console.error(`Unable to parse ${line}`));
    });
    reader.on("close", () => {
      resolve();
    });
  }).then(() => {
    return Promise.all([
      uniqIpAnalyser.report(),
      top3IpAnalyser.report(),
      top3UrlAnalyser.report(),
    ]);
  });
}

analyseLogStream(process.stdin).then((reports) =>
  reports.forEach((report) => console.log(`${report.name}:\n${report.result}`))
);
