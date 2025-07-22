export abstract class BaseRepository<E = unknown> {
  abstract createNew(entity: E): Promise<void>;
}
