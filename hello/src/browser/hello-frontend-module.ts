import { ContainerModule } from '@theia/core/shared/inversify';
import { FrontendApplicationContribution } from '@theia/core/lib/browser';
import { CommandContribution } from '@theia/core/lib/common/command';
import { MenuContribution } from '@theia/core/lib/common/menu';

import { AssameseCompletionContribution } from './hello-contribution';

export default new ContainerModule(bind => {
    bind(FrontendApplicationContribution)
        .to(AssameseCompletionContribution)
        .inSingletonScope();

    bind(CommandContribution)
        .to(AssameseCompletionContribution)
        .inSingletonScope();

    bind(MenuContribution)
        .to(AssameseCompletionContribution)
        .inSingletonScope();
});
