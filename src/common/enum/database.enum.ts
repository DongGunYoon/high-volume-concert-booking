export enum OptimisticLockMode {
  OPTIMISTIC = 'optimistic',
}

export enum PessimisticLockMode {
  PESSIMISTIC_READ = 'pessimistic_read',
  PESSIMISTIC_WRTIE = 'pessimistic_write',
  DIRTY_READ = 'dirty_read',
  PESSIMISTIC_PARTIAL_WRITE = 'pessimistic_partial_write',
  PESSIMISTIC_WRITE_OR_FAIL = 'pessimistic_write_or_fail',
  FOR_NO_KEY_UPDATE = 'for_no_key_update',
  FOR_KEY_SHARE = 'for_key_share',
}
