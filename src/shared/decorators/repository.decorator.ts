import { Service } from '@fastify-decorators/simple-di'

export function Repository(injectableToken: string | symbol): ClassDecorator {
  return target => {
    Service(injectableToken)(target)
  }
}
