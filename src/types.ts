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
  Method: string;
  Path: string;
  Protocol: string;
};
