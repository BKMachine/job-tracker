module 'mongoose' {
  interface Model {
    nextCount: (cb: { (err: Error, count: number): void }) => void
    resetCount: (cb: { (err: error, nextCount: number): void }) => void
  }
}
// TODO: only on auto increment models
