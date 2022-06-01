import { TopThreeUrlAnalyser } from "./topThreeUrls";

describe("Top Three URL Analyser", () => {
  let analyser: TopThreeUrlAnalyser;

  beforeEach(() => {
    analyser = new TopThreeUrlAnalyser();
  });

  test("Null log entry resolves without error and doesn't include in analysis", async () => {
    await expect(analyser.analyse(null)).resolves;
    await expect(analyser.report()).resolves.toStrictEqual({
      name: "Top Three URL Analyser",
      result: "There were 0 URLs analysed.",
    });
  });

  test("Null Request info resolves without error and doesn't include in analysis", async () => {
    await expect(analyser.analyse({ request: null })).resolves;
    await expect(analyser.report()).resolves.toStrictEqual({
      name: "Top Three URL Analyser",
      result: "There were 0 URLs analysed.",
    });
  });

  test("Entry with request resolves without error and is included in analysis", async () => {
    await expect(
      analyser.analyse({
        request: {
          method: "GET",
          path: "/some-site/",
          protocol: "HTTP/1.1",
        },
      })
    ).resolves;
    await expect(analyser.report()).resolves.toStrictEqual({
      name: "Top Three URL Analyser",
      result: " - /some-site/",
    });
  });

  test("Multiple log entries resolves without error and are included in analysis", async () => {
    await analyser
      .analyse({
        request: {
          method: "GET",
          path: "/some-site/",
          protocol: "HTTP/1.1",
        },
      })
      .then(() => {
        analyser.analyse({
          request: {
            method: "GET",
            path: "/some-other-site/",
            protocol: "HTTP/1.1",
          },
        });
      })
      .then(() => {
        analyser.analyse({
          request: {
            method: "GET",
            path: "/some-site/",
            protocol: "HTTP/1.1",
          },
        });
      })
      .then(() => {
        analyser.analyse({
          request: {
            method: "GET",
            path: "/a-different-site/",
            protocol: "HTTP/1.1",
          },
        });
      })
      .then(() => {
        analyser.analyse({
          request: {
            method: "GET",
            path: "/some-other-site/",
            protocol: "HTTP/1.1",
          },
        });
      })
      .then(() => {
        analyser.analyse({
          request: {
            method: "GET",
            path: "/some-other-site/",
            protocol: "HTTP/1.1",
          },
        });
      });
    await expect(analyser.report()).resolves.toStrictEqual({
      name: "Top Three URL Analyser",
      result: " - /some-other-site/\n - /some-site/\n - /a-different-site/",
    });
  });
});
