import { UniqueIpAddressAnalyser } from "./uniqueIpAddresses";

describe("Unique Ip Address Analyser", () => {
  let analyser: UniqueIpAddressAnalyser;

  beforeEach(() => {
    analyser = new UniqueIpAddressAnalyser();
  });

  test("Null log entry resolves without error and doesn't increase counter", async () => {
    await expect(analyser.analyse(null)).resolves;
    await expect(analyser.report()).resolves.toStrictEqual({
      name: "Unique IP Address Analyser",
      result: "  There were 0 unique IP addresses analysed.",
    });
  });

  test("Null IP address resolves without error and doesn't increase counter", async () => {
    await expect(analyser.analyse({ ipAddress: null })).resolves;
    await expect(analyser.report()).resolves.toStrictEqual({
      name: "Unique IP Address Analyser",
      result: "  There were 0 unique IP addresses analysed.",
    });
  });

  test("IP address resolves without error and increases counter", async () => {
    await expect(analyser.analyse({ ipAddress: "123.222.123.123" })).resolves;
    await expect(analyser.report()).resolves.toStrictEqual({
      name: "Unique IP Address Analyser",
      result: "  There were 1 unique IP addresses analysed.",
    });
  });

  test("Multiple IP address resolves without error and properly increases counter", async () => {
    await analyser
      .analyse({ ipAddress: "123.123.123.123" })
      .then(() => {
        analyser.analyse({ ipAddress: "987.987.987.987" });
      })
      .then(() => {
        analyser.analyse({ ipAddress: "123.123.123.123" });
      });
    await expect(analyser.report()).resolves.toStrictEqual({
      name: "Unique IP Address Analyser",
      result: "  There were 2 unique IP addresses analysed.",
    });
  });
});
