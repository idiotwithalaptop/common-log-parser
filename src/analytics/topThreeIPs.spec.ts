import { TopThreeIpAnalyser } from "./topThreeIPs";

describe("Top Three IP Address Analyser", () => {
  let analyser: TopThreeIpAnalyser;

  beforeEach(() => {
    analyser = new TopThreeIpAnalyser();
  });

  test("Null log entry resolves without error and doesn't include in analysis", async () => {
    await expect(analyser.analyse(null)).resolves;
    await expect(analyser.report()).resolves.toStrictEqual({
      name: "Top Three IP Address Analyser",
      result: "There were 0 IP addresses analysed.",
    });
  });

  test("Null IP info resolves without error and doesn't include in analysis", async () => {
    await expect(analyser.analyse({ ipAddress: null })).resolves;
    await expect(analyser.report()).resolves.toStrictEqual({
      name: "Top Three IP Address Analyser",
      result: "There were 0 IP addresses analysed.",
    });
  });

  test("Entry with IP resolves without error and is included in analysis", async () => {
    await expect(analyser.analyse({ ipAddress: "123.456.789.987" })).resolves;
    await expect(analyser.report()).resolves.toStrictEqual({
      name: "Top Three IP Address Analyser",
      result: " - 123.456.789.987",
    });
  });

  test("Multiple log entries resolves without error and are included in analysis", async () => {
    await analyser
      .analyse({ ipAddress: "123.456.789.987" })
      .then(() => analyser.analyse({ ipAddress: "987.654.321.123" }))
      .then(() => analyser.analyse({ ipAddress: "123.456.789.987" }))
      .then(() => analyser.analyse({ ipAddress: "666.555.444.333" }))
      .then(() => analyser.analyse({ ipAddress: "987.654.321.123" }))
      .then(() => analyser.analyse({ ipAddress: "987.654.321.123" }));
    await expect(analyser.report()).resolves.toStrictEqual({
      name: "Top Three IP Address Analyser",
      result: " - 987.654.321.123\n - 123.456.789.987\n - 666.555.444.333",
    });
  });
});
