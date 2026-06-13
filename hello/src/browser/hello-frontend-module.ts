import { ContainerModule } from '@theia/core/shared/inversify';
import { bindViewContribution, FrontendApplicationContribution, WidgetFactory } from '@theia/core/lib/browser';
import { CommandContribution } from '@theia/core/lib/common/command';
import { MenuContribution } from '@theia/core/lib/common/menu';
import { HelloConsoleWidget } from './hello-widget';
import { AssameseCompletionContribution, HelloConsoleContribution } from './hello-contribution';

import '../../src/browser/style/index.css';

export default new ContainerModule(bind => {
    bindViewContribution(bind, HelloConsoleContribution);

    bind(FrontendApplicationContribution)
        .to(AssameseCompletionContribution)
        .inSingletonScope();
    bind(FrontendApplicationContribution)
        .toService(HelloConsoleContribution)

    bind(HelloConsoleWidget).toSelf();
    bind(WidgetFactory)
        .toDynamicValue(ctx => ({
            id: HelloConsoleWidget.ID,
            createWidget: () =>
                ctx.container.get<HelloConsoleWidget>(HelloConsoleWidget)
        }))
        .inSingletonScope();

    bind(CommandContribution)
        .to(AssameseCompletionContribution)
        .inSingletonScope();

    bind(MenuContribution)
        .to(AssameseCompletionContribution)
        .inSingletonScope();
});
