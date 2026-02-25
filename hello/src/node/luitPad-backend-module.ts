import { ContainerModule } from '@theia/core/shared/inversify';
import { ConnectionHandler, RpcConnectionHandler } from '@theia/core';
import { AssameseService, AssamesePath } from '../common/luitPad-engine-protocol';
import { AssameseBackendService } from './luitPad-backend-service';
import { AssameseEngine } from './luitPad-engine';

export default new ContainerModule(bind => {

    // Engine
    bind(AssameseEngine).toSelf().inSingletonScope();

    // Backend Service
    bind(AssameseBackendService).toSelf().inSingletonScope();

    // RPC Connection
    bind(ConnectionHandler)
        .toDynamicValue(ctx =>
            new RpcConnectionHandler<AssameseService>(
                AssamesePath,
                () => ctx.container.get(AssameseBackendService)
            )
        )
        .inSingletonScope();
});
