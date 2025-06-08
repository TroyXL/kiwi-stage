type KiwiPaginationRequest<T extends Dict> = {
  page?: number
  pageSize?: number
} & T

type KiwiPaginationResponse<T extends Dict> = {
  total: number
} & T

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

type KiwiEnumConstant = {
  name: string
  label: string
}

type KiwiAccess = 'public' | 'private' | 'protected' | 'package'

type KiwiClassTag = 'class' | 'interface' | 'enum' | 'value'

type KiwiTypeKind = 'primitive' | 'class' | 'array' | 'union'

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
  fields?: KiwiFieldInterface[]
}

interface KiwiFieldInterface {
  access: KiwiAccess
  name: string
  label: string
  type: KiwiTypeInterface
  summary: boolean
}

interface KiwiTypeInterface {
  kind: KiwiTypeKind
  name?: string
  qualifiedName?: string
  elementType?: KiwiTypeInterface
  alternatives?: KiwiTypeInterface[]
}

type KiwiSchemaCreated = (schema: KiwiSchema) => void

type KiwiObject = {
  id?: string
  type: string
  summary: string
  fields?: Dict
}
