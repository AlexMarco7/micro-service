import { EventBus } from './event-bus';
import { Options } from './options';
export declare class MicroService {
    static start(name: string, opt?: Options, cb?: (eb: EventBus) => void): void;
    private static startDirs(name, opt, eb, cb?);
    private static startActions(name, dir);
}
