import { configType } from './types';
export { SSRPage } from './types';
export default function start(config: configType): (req: any, res: any, next: any, manifest: any) => Promise<any>;
