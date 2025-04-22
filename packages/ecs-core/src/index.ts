import 'reflect-metadata';
import { createWorld } from 'bitecs';
import { Container } from 'inversify';

export const IoC = new Container();
export const World = createWorld();

export const register = (System: any, opts: any = {}) => {
  if (!IoC.isBound(System)) {
    IoC.bind(System).toSelf().inSingletonScope();
  }
  const instance = IoC.get<System>(System);
  World.systems = [...(World.systems ?? []), instance];
};

export const enableSystem = (System: any, opts: any = {}) => {
  if (!IoC.isBound(System)) {
    IoC.bind(System).toSelf().inSingletonScope();
  }
  const instance = IoC.get<System>(System);
  if (!(World.systems ?? []).some((s: any) => s instanceof System)) {
    World.systems = [...(World.systems ?? []), instance];
  }
};

export const disableSystem = (System: any) => {
  World.systems = (World.systems ?? []).filter((s: any) => !(s instanceof System));
};
