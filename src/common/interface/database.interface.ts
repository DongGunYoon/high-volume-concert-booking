import { OptimisticLockMode, PessimisticLockMode } from '../enum/database.enum';

export type CustomLock = CustomOptimisticLock | CustomPessimisticLock;

interface CustomOptimisticLock {
  mode: OptimisticLockMode;
  version: number | Date;
}

interface CustomPessimisticLock {
  mode: PessimisticLockMode;
  tables?: string[];
}
