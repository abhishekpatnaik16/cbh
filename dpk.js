const crypto = require("crypto");

deterministicPartitionKey = (event) => {
  const TRIVIAL_PARTITION_KEY = "0";
  const MAX_PARTITION_KEY_LENGTH = 256;
  let candidate;

  if (event) {
    if (event.partitionKey) {
      candidate = event.partitionKey;
    } else {
      const data = JSON.stringify(event);
      candidate = crypto.createHash("sha3-512").update(data).digest("hex");
    }
  }

  if (candidate) {
    if (typeof candidate !== "string") {
      candidate = JSON.stringify(candidate);
    }
  } else {
    candidate = TRIVIAL_PARTITION_KEY;
  }
  if (candidate.length > MAX_PARTITION_KEY_LENGTH) {
    candidate = crypto.createHash("sha3-512").update(candidate).digest("hex");
  }
  return candidate;
};

exports.deterministicPartitionKey = (event) => {
  const TRIVIAL_PARTITION_KEY = "0";
  const MAX_PARTITION_KEY_LENGTH = 256;

  if (!event) {
    return TRIVIAL_PARTITION_KEY;
  }

  if (
    typeof event.partitionKey === "string" &&
    event.partitionKey.length <= MAX_PARTITION_KEY_LENGTH
  ) {
    return event.partitionKey;
  }

  if (
    typeof event.partitionKey === "string" &&
    event.partitionKey.length > MAX_PARTITION_KEY_LENGTH
  ) {
    return crypto
      .createHash("sha3-512")
      .update(event.partitionKey)
      .digest("hex");
  }

  if (!event.partitionKey) {
    return crypto
      .createHash("sha3-512")
      .update(JSON.stringify(event))
      .digest("hex");
  }

  if (typeof event.partitionKey !== "string") {
    const candidate = JSON.stringify(event.partitionKey);

    if (candidate.length > MAX_PARTITION_KEY_LENGTH) {
      return crypto.createHash("sha3-512").update(event).digest("hex");
    }
  }

  return JSON.stringify(event.partitionKey);
};
