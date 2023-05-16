

export  class PlatformNotSupportedError extends Error {

}
export  class NotSupportedError extends Error {

}
export class ArgumentError extends TypeError {
  constructor(name: string) {
    super(`Invalid argument '${name}'`);
  }
}