import { ContainerModule } from '@theia/core/shared/inversify';
import { ConnectionHandler, RpcConnectionHandler } from '@theia/core';
import { AssameseService, AssamesePath } from '../common/luitPad-engine-protocol';
import { AssameseBackendService } from './luitPad-backend-service';
import { AssameseEngine } from './luitPad-engine';
import { AxmService, AxmPath } from '../common/axm-protocol';
import { AxmRunner } from './axm-runner';

export default new ContainerModule(bind => {

    // Engine
    bind(AssameseEngine).toSelf().inSingletonScope();

    // Backend Service
    bind(AssameseBackendService).toSelf().inSingletonScope();

    // Axm Runner
    bind(AxmRunner).toSelf().inSingletonScope();

    // RPC Connection
    bind(ConnectionHandler)
        .toDynamicValue(ctx =>
            new RpcConnectionHandler<AssameseService>(
                AssamesePath,
                () => ctx.container.get(AssameseBackendService)
            )
        )
        .inSingletonScope();

      bind(ConnectionHandler)
                .toDynamicValue(ctx =>
                    new RpcConnectionHandler<AxmService>(
                        AxmPath,
                        () => {
                            const runner = ctx.container.get(AxmRunner);
                            return {
                                run: (file: string) => runner.run(file)
                            };
                        }
                    )
                )
                .inSingletonScope();
});
