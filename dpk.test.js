const { deterministicPartitionKey } = require("./dpk");

describe("deterministicPartitionKey", () => {
  it("Returns the literal '0' when given no input", () => {
    const trivialKey = deterministicPartitionKey();
    expect(trivialKey).toBe("0");
  });

  it("Returns correct key when given an empty event object", () => {
    const event = {};
    expect(deterministicPartitionKey(event)).toBe(
      "c1802e6b9670927ebfddb7f67b3824642237361f07db35526c42c555ffd2dbe74156c366e1550ef8c0508a6cc796409a7194a59bba4d300a6182b483d315a862"
    );
  });

  it("Returns the partitionKey when given an event object with some partitonKey", () => {
    const event = {
      partitionKey: (Math.random() * 10 ** 10).toFixed(),
    };
    expect(deterministicPartitionKey(event)).toBe(event.partitionKey);
  });

  it("Returns the stringified partitionKey when given an event object with some partitonKey", () => {
    const event = {
      partitionKey: Math.floor(Math.random() * 10 ** 10),
    };
    expect(deterministicPartitionKey(event)).toBe(
      JSON.stringify(event.partitionKey)
    );
  });

  it("Returns a new parition key when the given events partion key has a length more than 256 characters", () => {
    const event = {
      partitionKey: Array(257).fill("A").join(""),
    };
    expect(deterministicPartitionKey(event)).toBe(
      "437dbfb4791398dad50bf115034dd483a1a365a3b16d270d6c7703c78fb060581a2d2d3e75315d4abaf9e93a1e11ac587056a873238d24ed3053db1885619f4a"
    );
  });
});
