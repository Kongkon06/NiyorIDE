import { injectable } from '@theia/core/shared/inversify';
import { AssameseService } from '../common/luitPad-engine-protocol'
import { AssameseEngine } from './luitPad-engine';

@injectable()
export class AssameseBackendService implements AssameseService {

    private initialized = false;

    constructor(private engine: AssameseEngine) {}

    async suggest(word: string): Promise<string[]> {

        if (!this.initialized) {
            await this.engine.initialize();
            this.initialized = true;
        }

        return this.engine.suggest(word);
    }
}
