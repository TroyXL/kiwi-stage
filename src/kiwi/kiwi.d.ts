type KiwiErrorHandler = (error: Error) => void

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
type KiwiPrimitiveTypeEnum =
  | 'byte'
  | 'short'
  | 'int'
  | 'long'
  | 'float'
  | 'double'
  | 'boolean'
  | 'char'
  | 'string'
  | 'void'
  | 'never'
  | 'any'
  | 'null'

interface KiwiSchemaInterface {
  access: KiwiClassAccess
  abstract: boolean
  tag: KiwiClassTag
  name: string
  qualifiedName: string
  beanName?: string
  label: string
  constructor: {
    parameters: KiwiParameterInterface[]
  }
  classes: KiwiSchemaInterface[]
  enumConstants: KiwiEnumConstant[]
  fields?: KiwiFieldInterface[]
  methods?: KiwiMethodInterface[]
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
  name?: KiwiPrimitiveTypeEnum
  qualifiedName?: string
  elementType?: KiwiTypeInterface
  alternatives?: KiwiTypeInterface[]
}

interface KiwiParameterInterface {
  name: string
  label: string
  type: KiwiTypeInterface
}

interface KiwiMethodInterface {
  access: KiwiAccess
  abstract: boolean
  name: string
  label: string
  parameters: KiwiParameterInterface[]
  returnType: KiwiTypeInterface
}

type KiwiSchemaCreated = (schema: KiwiSchema) => void

type KiwiObject = {
  id?: string
  type: string
  summary: string
  fields?: Dict
  children?: {
    [key: string]: KiwiObject[]
  }
}

type KiwiCreateOrUpdateChildObject = {
  id?: string
  fields: Dict
  children?: KiwiCreateOrUpdateObjectChildren
}

type KiwiCreateOrUpdateObjectChildren = {
  [type: string]: KiwiCreateOrUpdateChildObject[]
}
type KiwiCreateOrUpdateObject = {
  object: {
    id?: string
    type: string
    fields?: Dict
    children?: KiwiCreateOrUpdateObjectChildren
  }
}
