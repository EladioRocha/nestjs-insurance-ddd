export class QuoteNotFoundError extends Error {
  constructor(quoteId: string) {
    super(`Quote ${quoteId} was not found.`);
    this.name = 'QuoteNotFoundError';
  }
}
