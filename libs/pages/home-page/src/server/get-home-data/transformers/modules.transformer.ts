class ModulesTransform {
  constructor(private readonly modules: ResponseApi) {
    this.transform();
  }

  transform(): ResponseApi {
    return this.modules;
  }
}
