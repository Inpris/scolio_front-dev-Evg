import { Entity } from '@common/interfaces/Entity';
import { ProductOperationStatus } from '@modules/common/enums/product-operation-status';

export interface ManufacturingFormData {
  blocking: {
    blockingExecutor1: Entity,
    blockingExecutor2: Entity,
    blockingStatus: ProductOperationStatus,
    defects: {
      purityBeforeLoadingInThermostol: boolean,
      deformationInsideCorsetLiner: boolean,
      afterBlockCorsetPlasticThickness: boolean,
      corsetProblocking: boolean,
      paintQualityAfterBlocking: boolean,
      stonesAfterTights: boolean,
    },
  };
  comment: string;
  isControlled: boolean;
  cutting: {
    cuttingExecutor1: Entity,
    cuttingExecutor2: Entity,
    cuttingStatus: ProductOperationStatus,
    defects: {
      competentCutting: boolean,
    },
  };
  fastenersInstall: {
    fastenersInstallExecutor1: Entity,
    fastenersInstallExecutor2: Entity,
    fastenersInstallStatus: ProductOperationStatus,
    defects: {
      corsetFastenersInstallation: boolean,
      sameColorFrames: boolean,
      whriteWhoInstalledFasteners: boolean,
    },
  };
  turning: {
    turningExecutor1: Entity,
    turningExecutor2: Entity,
    turningStatus: ProductOperationStatus,
    defects: {
      surfaceScratches: boolean,
      levelOfAxillaryPelot: boolean,
      whriteWhoTurned: boolean,
      turningQuality: boolean,
      seamPolishing: boolean,
      plasticBend: boolean,
    },
  };
}


