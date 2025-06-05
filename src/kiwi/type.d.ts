type KiwiManagerAuthorization = {
  loginName: string
  password: string
}

type KiwiManagerLoginInfo = {
  appId: number
  userId: string
}

type KiwiAppInfo = {
  id: number
  name: string
  ownerId?: string
}

interface KiwiEnumConstant {
  name: string
  label: string
}

interface KiwiSchemaInterface {
  access: KiwiClassAccess
  abstract: boolean
  tag: KiwiClassTag
  name: string
  qualifiedName: string
  beanName?: string
  label: string
  classes: KiwiSchemaInterface[]
  enumConstants: KiwiEnumConstant[]
}

type KiwiSchemaCreated = (schema: KiwiSchema) => void
