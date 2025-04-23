import 'reflect-metadata';
import { Container } from 'inversify';
export declare const IoC: Container;
export declare const World: import("bitecs").IWorld;
export declare const register: (System: any, opts?: any) => void;
export declare const enableSystem: (System: any, opts?: any) => void;
export declare const disableSystem: (System: any) => void;
