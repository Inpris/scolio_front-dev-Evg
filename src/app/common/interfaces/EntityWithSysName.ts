import { Entity } from '@common/interfaces/Entity';

export interface EntityWithSysName extends Entity {
  sysName: string;
}
