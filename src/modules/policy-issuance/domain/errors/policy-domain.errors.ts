export class QuoteCannotBeIssuedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'QuoteCannotBeIssuedError';
  }
}

export class PolicyNotFoundError extends Error {
  constructor(policyId: string) {
    super(`Policy ${policyId} was not found.`);
    this.name = 'PolicyNotFoundError';
  }
}
