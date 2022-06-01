export type LogEntry = {
  ipAddress?: string;
  rfc931?: string;
  user?: string;
  datetime?: string;
  request?: LogRequest;
  responseStatus?: number;
  numberOfBytes?: number;
};

type LogRequest = {
  method: string;
  path: string;
  protocol: string;
};

export interface LogAnalyser {
  analyse(entry: LogEntry): Promise<void>;
  report(): Promise<LogAnalyserReport>;
}

export type LogAnalyserReport = {
  name: string;
  result: string;
};
