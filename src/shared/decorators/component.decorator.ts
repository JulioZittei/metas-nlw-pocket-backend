import { Service } from '@fastify-decorators/simple-di'

export function Component(injectableToken: string | symbol): ClassDecorator {
  return target => {
    Service(injectableToken)(target)
  }
}
