export interface UseCase<D = unknown, E = unknown> {
  execute(data: D): Promise<E>;
}
