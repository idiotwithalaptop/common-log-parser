# Common Log Analyser

A simple command-line tool to parse log input in the [Common Log Format](https://www.w3.org/Daemon/User/Config/Logging.html#common-logfile-format).

## Design Decisions

- Solution consists of two parts, a line parser and a number of analytical plugins.
  - The line parser - It's responsibility is to consume a textual line, confirm it is in the log format and parse it into it's fields.
  - The analytical plugins - Each plugin's responsiblity is to consume a parsed log entry and process it for an analytic need. In this case there are 3 analytical plugins: Number of Unique Ips, Top 3 most visted URLS and Top 3 most active IP addresses.
- Processing is done line-by-line and does not load the entire parsed log file into memory. This is to ensure it only consumes the memory required and avoids issues that would be introduced by processing large log files.
- Using a extensible analytics approach allows for each of the analytical plugins to only be concerned with gathering the data needed to complete their own calculations, they must written independently of any other plugin so they can be swapped out as needed.
  - This approach also lends itself well to a cloud based solution, where each plugin could be run completely independently of each other from a message bus, queue or other decoupled messaging system. This wasn't attempted as it seemed overkill for needs of this code exercise due to the need of also introducing cloud infrastructure-as-code and data persistence.
- Because of the intention for the plugins to manage their state, including the analysis, a functional programming approach wasn't appropriate.

## Assumptions

- Log format follows the Common Log Format. While not explicitly mentioned in the challenge requirements, the provided examples follow this format. This format declares that each line in the file is a seperate log entry, each field is seperated by a space and follows the format of:
  ```
  ip-address rfc931 user [datetime] "request details" response-status number-of-bytes
  ```
  - `ip-address`: The remote host of the client the request originates from
  - `rfc931`: The RFC931 identity of the client
  - `user`: The user id for an authenticated user
  - `[datetime]`: The date and time of the incoming request. In the format of `[day/month/year:hour:minute:second timezone]`
  - `"request details"`: Information about the incoming request. In the format of `"request-method request-path request-protocol"`
  - `response-status`: The HTTP numeric status code. Full list of status codes available in the [HTTP Specification](http://www.w3.org/Protocols/rfc2616/rfc2616.txt)
  - `number-of-bytes`: The size of the content of the request, not including the headers, in bytes.
- Any log field with a value of "-" is considered to be an unavailable value.
- The requirement for "Top 3 most visited URLs" is referring to the request paths. There are no URLs in the log entries as we don't have the host of these requests, I had to assume that these paths are for the same host and therefore analysing the request paths forfills this requirement.
