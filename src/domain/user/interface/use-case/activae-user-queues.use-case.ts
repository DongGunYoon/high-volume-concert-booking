export const ActivateUserQueuesUseCaseSymbol = Symbol.for('ActivateUserQueuesUseCase');

export interface ActivateUserQueuesUseCase {
  execute(): Promise<void>;
}
