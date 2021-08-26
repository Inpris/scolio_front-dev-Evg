export const EMPTY_NK = {
  id: '',
  name: '',
  dateOfIssue: '',
  guarantee: '',
  prothesisFastening: '',
  dateSendingToBranch: '',
  branchId: '',

  footSize: null,
  growth: null,
  weight: null,
  amputationSide: null,
  model3d: false,
  htv: false,
  lamination: false,
  cosmeticCladding: false,

  assemblyExecutor1: '',
  assemblyExecutor2: '',
  assemblyFinished: '',
  assemblyStatus: null,

  blockingExecutor1: '',
  blockingExecutor2: '',
  blockingFinished: '',
  blockingStatus: null,

  deliveryExecutor1: '',
  deliveryExecutor2: '',
  deliveryFinished: '',
  deliveryStatus: null,

  firstFittingExecutor1: '',
  firstFittingExecutor2: '',
  firstFittingFinished: '',
  firstFittingStatus: null,

  htvExecutor1: '',
  htvExecutor2: '',
  htvFinished: '',
  htvStatus: null,

  impressionTakingExecutor1: '',
  impressionTakingExecutor2: '',
  impressionTakingFinished: '',
  impressionTakingStatus: null,

  laminationExecutor1: '',
  laminationExecutor2: '',
  laminationFinished: '',
  laminationStatus: null,

  model3dExecutor1: '',
  model3dExecutor2: '',
  model3dFinished: '',
  model3dStatus: null,

  productionCosmeticCladdingExecutor1: '',
  productionCosmeticCladdingExecutor2: '',
  productionCosmeticCladdingFinished: '',
  productionCosmeticCladdingStatus: null,

  secondFittingExecutor1: '',
  secondFittingExecutor2: '',
  secondFittingFinished: '',
  secondFittingStatus: null,

  thirdFittingExecutor1: '',
  thirdFittingExecutor2: '',
  thirdFittingFinished: '',
  thirdFittingStatus: null,

  createModel3dExecutor1: '',
  createModel3dExecutor2: '',
  createModel3dExecutorFinished: '',
  createModel3dStatus: null,

  impressionProcessingExecutor1: '',
  impressionProcessingExecutor2: '',
  impressionProcessingFinished: '',
  impressionProcessingStatus: null,

  comment: '',
  controlledBy: '',
  isControlled: false,
};

export const FULL_SCHEMA = [
  { name: '3D модель', field: 'model3d' }, // если model3d +
  { name: 'Снятие слепка', field: 'impressionTaking' }, // если model3d -
  { name: 'Создание 3D формы', field: 'createModel3d' }, // если model3d +
  { name: 'Обработка слепка', field: 'impressionProcessing' }, // если model3d -
  { name: 'Блоковка', field: 'blocking' },
  { name: 'Примерка 1', field: 'firstFitting' },
  { name: 'Первичная сборка протеза', field: 'assembly' },
  { name: 'Примерка 2', field: 'secondFitting' },
  { name: 'HTV силикон', field: 'htv' }, // если htv +
  { name: 'Ламинация', field: 'lamination' }, // если lamination +
  { name: 'Изготовление косметической облицовки', field: 'productionCosmeticCladding' }, // если productionCosmeticCladding +
  { name: 'Примерка 3', field: 'thirdFitting' }, // если lamination +
];

export const INFO_CONTROL_VALUE = {
  name: null,
  dateOfIssue: null,
  guarantee: null,
  prothesisFastening: null,
  sleeveMaterial: null,
  prothesisParts: null,
  dateSendingToBranch: null,
  branch: null,
};

export const MEASUREMENT_FORM = {
  amputationDate: [null],
  amputationCause: [''],
  accompanyingIllnesses: [''],
  prothesisUseDuring: [''],
  oldProthesis: [''],
  currentProthesis: [''],
  oldCompany: [''],
  prothesisBracing: [''],
  sleeveMaterial: [''],
  prothesisParts: [''],
  additionalInfo: [''],
  tcpUsing: [''],
  id: [''],
};

export const FORM_VALUE = {
  id: [null],
  visitId: [null],
  dealId: [null],
  generalStatus: [null],
  number: [null],
  productType: [null],

  footSize: [null],
  growth: [null],
  weight: [null],
  amputationSide: [null],
  model3d: [null],
  htv: [null],
  lamination: [null],
  cosmeticCladding: [null],

  name: [null],
  dateOfIssue: [null],
  guarantee: [null],
  prothesisFastening: [null],
  sleeveMaterial: [null],
  prothesisParts: [null],
  dateSendingToBranch: [null],
  branch: [null],
};

export const MANUFACTURING_DATA = {
  assemblyExecutor1: null,
  assemblyExecutor2: null,
  assemblyFinished: null,
  assemblyStatus: null,

  blockingExecutor1: null,
  blockingExecutor2: null,
  blockingFinished: null,
  blockingStatus: null,

  deliveryExecutor1: null,
  deliveryExecutor2: null,
  deliveryFinished: null,
  deliveryStatus: null,

  firstFittingExecutor1: null,
  firstFittingExecutor2: null,
  firstFittingFinished: null,
  firstFittingStatus: null,

  htvExecutor1: null,
  htvExecutor2: null,
  htvFinished: null,
  htvStatus: null,

  impressionTakingExecutor1: null,
  impressionTakingExecutor2: null,
  impressionTakingFinished: null,
  impressionTakingStatus: null,

  laminationExecutor1: null,
  laminationExecutor2: null,
  laminationFinished: null,
  laminationStatus: null,

  model3dExecutor1: null,
  model3dExecutor2: null,
  model3dFinished: null,
  model3dStatus: null,

  productionCosmeticCladdingExecutor1: null,
  productionCosmeticCladdingExecutor2: null,
  productionCosmeticCladdingFinished: null,
  productionCosmeticCladdingStatus: null,

  secondFittingExecutor1: null,
  secondFittingExecutor2: null,
  secondFittingFinished: null,
  secondFittingStatus: null,

  thirdFittingExecutor1: null,
  thirdFittingExecutor2: null,
  thirdFittingFinished: null,
  thirdFittingStatus: null,

  createModel3dExecutor1: null,
  createModel3dExecutor2: null,
  createModel3dExecutorFinished: null,
  createModel3dStatus: null,

  impressionProcessingExecutor1: null,
  impressionProcessingExecutor2: null,
  impressionProcessingFinished: null,
  impressionProcessingStatus: null,

  comment: null,
  controlledBy: null,
  isControlled: null,
};

export const MANUFACTURING_PROGRESS = {
  model3d: false,
  impressionTaking: false,
  createModel3d: false,
  impressionProcess: false,
  blocking: false,
  firstFitting: false,
  assembly: false,
  secondFitting: false,
  htv: false,
  lamination: false,
  productionCosmeticCladding: false,
  thirdFitting: false,
};
