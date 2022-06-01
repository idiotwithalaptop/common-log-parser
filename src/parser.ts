import { LogEntry } from "./types";

const LOG_ENTRY_REGEX =
  /^(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}|-) (.+) (.+) (\[(.+)\]|-) ("(\S+) (\S+) (\S+)"|-) (\d\d\d|-) (\d+|-).*$/;

export default function parse(log: string): Promise<LogEntry> {
  return new Promise<LogEntry>((resolve, reject) => {
    const logEntryResult = LOG_ENTRY_REGEX.exec(log);
    if (logEntryResult === null) {
      reject("Invalid log entry");
      return;
    }

    const [
      ,
      ipAddress,
      rfc931,
      user,
      datetime,
      datetimeValue,
      request,
      requestMethod,
      requestPath,
      requestProtocol,
      responseStatus,
      bytes,
    ] = logEntryResult;

    const logEntry: LogEntry = {
      ipAddress: parseStringEntry(ipAddress),
      rfc931: parseStringEntry(rfc931),
      user: parseStringEntry(user),
      datetime: parseStringEntry(datetime) === null ? null : datetimeValue,
      request:
        parseStringEntry(request) === null
          ? null
          : {
              method: requestMethod,
              path: requestPath,
              protocol: requestProtocol,
            },
      responseStatus: parseNumberEntry(responseStatus),
      numberOfBytes: parseNumberEntry(bytes),
    };
    resolve(logEntry);
  });
}

function parseStringEntry(entry: string): string | null {
  return entry === "-" ? null : entry;
}

function parseNumberEntry(entry: string): number | null {
  return entry === "-" ? null : Number.parseInt(entry);
}
