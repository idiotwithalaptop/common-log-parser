import parse from "./parse";

describe("parse()", () => {
  describe("Invalid Log Entry", () => {
    test("Empty string causes error callback", () => {
      expect(parse("")).rejects.toBe("Invalid log entry");
    });

    test("Invalid IP Address", () => {
      expect(
        parse(
          `ABC.123.ASDA - - [10/Jul/2018:22:21:28 +0200] "GET /intranet-analytics/ HTTP/1.1" 200 3574"`
        )
      ).rejects.toBe("Invalid log entry");
    });

    test("Invalid datetime", () => {
      expect(
        parse(
          `177.71.128.21 - - ASDASDASD "GET /intranet-analytics/ HTTP/1.1" 200 3574`
        )
      ).rejects.toBe("Invalid log entry");
    });

    test("Invalid request", () => {
      expect(
        parse(
          `177.71.128.21 - - [10/Jul/2018:22:21:28 +0200] "HASDHASH1234" 200 3574`
        )
      ).rejects.toBe("Invalid log entry");
    });

    test("Invalid Response Code", () => {
      expect(
        parse(
          `177.71.128.21 - - [10/Jul/2018:22:21:28 +0200] "GET /intranet-analytics/ HTTP/1.1" FOO 3574`
        )
      ).rejects.toBe("Invalid log entry");
    });

    test("Invalid Bytes", () => {
      expect(
        parse(
          `177.71.128.21 - - [10/Jul/2018:22:21:28 +0200] "GET /intranet-analytics/ HTTP/1.1" 200 NONNUMBER`
        )
      ).rejects.toBe("Invalid log entry");
    });
  });

  describe("Missing Fields", () => {
    test("Missing IP Address", () => {
      expect(
        parse(
          `- test testUser [10/Jul/2018:22:21:28 +0200] "GET /intranet-analytics/ HTTP/1.1" 200 3574`
        )
      ).resolves.toStrictEqual({
        ipAddress: null,
        rfc931: "test",
        user: "testUser",
        datetime: "10/Jul/2018:22:21:28 +0200",
        request: {
          method: "GET",
          path: "/intranet-analytics/",
          protocol: "HTTP/1.1",
        },
        responseStatus: 200,
        numberOfBytes: 3574,
      });
    });

    test("Missing RFC931", () => {
      expect(
        parse(
          `177.71.128.21 - testUser [10/Jul/2018:22:21:28 +0200] "GET /intranet-analytics/ HTTP/1.1" 200 3574`
        )
      ).resolves.toStrictEqual({
        ipAddress: "177.71.128.21",
        rfc931: null,
        user: "testUser",
        datetime: "10/Jul/2018:22:21:28 +0200",
        request: {
          method: "GET",
          path: "/intranet-analytics/",
          protocol: "HTTP/1.1",
        },
        responseStatus: 200,
        numberOfBytes: 3574,
      });
    });

    test("Missing UserID", () => {
      expect(
        parse(
          `177.71.128.21 test - [10/Jul/2018:22:21:28 +0200] "GET /intranet-analytics/ HTTP/1.1" 200 3574`
        )
      ).resolves.toStrictEqual({
        ipAddress: "177.71.128.21",
        rfc931: "test",
        user: null,
        datetime: "10/Jul/2018:22:21:28 +0200",
        request: {
          method: "GET",
          path: "/intranet-analytics/",
          protocol: "HTTP/1.1",
        },
        responseStatus: 200,
        numberOfBytes: 3574,
      });
    });

    test("Missing Datetime", () => {
      expect(
        parse(
          `177.71.128.21 test testUser - "GET /intranet-analytics/ HTTP/1.1" 200 3574`
        )
      ).resolves.toStrictEqual({
        ipAddress: "177.71.128.21",
        rfc931: "test",
        user: "testUser",
        datetime: null,
        request: {
          method: "GET",
          path: "/intranet-analytics/",
          protocol: "HTTP/1.1",
        },
        responseStatus: 200,
        numberOfBytes: 3574,
      });
    });

    test("Missing Request", () => {
      expect(
        parse(
          `177.71.128.21 test testUser [10/Jul/2018:22:21:28 +0200] - 200 3574`
        )
      ).resolves.toStrictEqual({
        ipAddress: "177.71.128.21",
        rfc931: "test",
        user: "testUser",
        datetime: "10/Jul/2018:22:21:28 +0200",
        request: null,
        responseStatus: 200,
        numberOfBytes: 3574,
      });
    });

    test("Missing Response status", () => {
      expect(
        parse(
          `177.71.128.21 test testUser [10/Jul/2018:22:21:28 +0200] "GET /intranet-analytics/ HTTP/1.1" - 3574`
        )
      ).resolves.toStrictEqual({
        ipAddress: "177.71.128.21",
        rfc931: "test",
        user: "testUser",
        datetime: "10/Jul/2018:22:21:28 +0200",
        request: {
          method: "GET",
          path: "/intranet-analytics/",
          protocol: "HTTP/1.1",
        },
        responseStatus: null,
        numberOfBytes: 3574,
      });
    });

    test("Missing Bytes", () => {
      expect(
        parse(
          `177.71.128.21 test testUser [10/Jul/2018:22:21:28 +0200] "GET /intranet-analytics/ HTTP/1.1" 200 -`
        )
      ).resolves.toStrictEqual({
        ipAddress: "177.71.128.21",
        rfc931: "test",
        user: "testUser",
        datetime: "10/Jul/2018:22:21:28 +0200",
        request: {
          method: "GET",
          path: "/intranet-analytics/",
          protocol: "HTTP/1.1",
        },
        responseStatus: 200,
        numberOfBytes: null,
      });
    });
  });

  describe("Other Valid scenarios", () => {
    test("Example from document - passes parsing", () => {
      expect(
        parse(
          `177.71.128.21 - - [10/Jul/2018:22:21:28 +0200] "GET /intranet-analytics/ HTTP/1.1" 200 3574`
        )
      ).resolves.toStrictEqual({
        ipAddress: "177.71.128.21",
        rfc931: null,
        user: null,
        datetime: "10/Jul/2018:22:21:28 +0200",
        request: {
          method: "GET",
          path: "/intranet-analytics/",
          protocol: "HTTP/1.1",
        },
        responseStatus: 200,
        numberOfBytes: 3574,
      });
    });
  });
});
