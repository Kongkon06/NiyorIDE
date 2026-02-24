import { ContainerModule } from '@theia/core/shared/inversify';
import { FrontendApplicationContribution } from '@theia/core/lib/browser';
import { AssameseCompletionContribution } from './hello-contribution';

export default new ContainerModule(bind => {
    bind(FrontendApplicationContribution)
        .to(AssameseCompletionContribution)
        .inSingletonScope();
});
