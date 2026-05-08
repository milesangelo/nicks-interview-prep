const VALID_STATUSES = ["want_to_read", "reading", "read"];

// Returns an array of error strings. Empty array = valid input.
export function validate(input) {
  const errors = [];

  // TODO: check that title exists and is a non-empty string
  // TODO: check that author exists and is a non-empty string
  // TODO: check that status is one of VALID_STATUSES
  // TODO: if rating is provided, check it is an integer between 1 and 5

  return errors;
}

// Takes raw input and returns a clean book object ready to persist.
export function normalize(input) {
  // TODO: return an object with trimmed title/author, valid status,
  //       rating as a number or null, and notes as a string or null
  return input;
}
