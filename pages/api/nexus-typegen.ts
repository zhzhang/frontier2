/**
 * This file was generated by Nexus Schema
 * Do not make changes to this file directly
 */


import { core } from "nexus"
declare global {
  interface NexusGenCustomInputMethods<TypeName extends string> {
    /**
     * A date string, such as 2007-12-03, compliant with the `full-date` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar.
     */
    date<FieldName extends string>(fieldName: FieldName, opts?: core.CommonInputFieldConfig<TypeName, FieldName>): void // "Date";
    /**
     * The `Upload` scalar type represents a file upload.
     */
    upload<FieldName extends string>(fieldName: FieldName, opts?: core.CommonInputFieldConfig<TypeName, FieldName>): void // "Upload";
  }
}
declare global {
  interface NexusGenCustomOutputMethods<TypeName extends string> {
    /**
     * A date string, such as 2007-12-03, compliant with the `full-date` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar.
     */
    date<FieldName extends string>(fieldName: FieldName, ...opts: core.ScalarOutSpread<TypeName, FieldName>): void // "Date";
    /**
     * The `Upload` scalar type represents a file upload.
     */
    upload<FieldName extends string>(fieldName: FieldName, ...opts: core.ScalarOutSpread<TypeName, FieldName>): void // "Upload";
  }
}


declare global {
  interface NexusGen extends NexusGenTypes {}
}

export interface NexusGenInputs {
}

export interface NexusGenEnums {
  Role: "ADMIN" | "MEMBER" | "NONE" | "REVIEWER"
}

export interface NexusGenScalars {
  String: string
  Int: number
  Float: number
  Boolean: boolean
  ID: string
  Date: any
  Upload: any
}

export interface NexusGenObjects {
  Article: { // root type
    abstract?: string | null; // String
    id?: string | null; // String
    url?: string | null; // String
  }
  Mutation: {};
  Organization: { // root type
    description?: string | null; // String
    id?: string | null; // String
    name?: string | null; // String
  }
  Query: {};
  User: { // root type
    email?: string | null; // String
    id?: string | null; // String
    name?: string | null; // String
  }
  Venue: { // root type
    description?: string | null; // String
    id?: string | null; // String
    name?: string | null; // String
  }
}

export interface NexusGenInterfaces {
}

export interface NexusGenUnions {
}

export type NexusGenRootTypes = NexusGenObjects

export type NexusGenAllTypes = NexusGenRootTypes & NexusGenScalars & NexusGenEnums

export interface NexusGenFieldTypes {
  Article: { // field return type
    abstract: string | null; // String
    authors: Array<NexusGenRootTypes['User'] | null> | null; // [User]
    id: string | null; // String
    url: string | null; // String
  }
  Mutation: { // field return type
    createArticle: NexusGenRootTypes['Article'] | null; // Article
    createOrganization: NexusGenRootTypes['Organization'] | null; // Organization
    createVenue: NexusGenRootTypes['Venue'] | null; // Venue
  }
  Organization: { // field return type
    description: string | null; // String
    id: string | null; // String
    name: string | null; // String
    role: NexusGenEnums['Role'] | null; // Role
    venues: Array<NexusGenRootTypes['Venue'] | null> | null; // [Venue]
  }
  Query: { // field return type
    articles: Array<NexusGenRootTypes['Article'] | null> | null; // [Article]
    browseOrganizations: Array<NexusGenRootTypes['Organization'] | null> | null; // [Organization]
    organization: NexusGenRootTypes['Organization'] | null; // Organization
    searchUsers: Array<NexusGenRootTypes['User'] | null> | null; // [User]
    user: NexusGenRootTypes['User'] | null; // User
  }
  User: { // field return type
    articles: Array<NexusGenRootTypes['Article'] | null> | null; // [Article]
    email: string | null; // String
    id: string | null; // String
    name: string | null; // String
  }
  Venue: { // field return type
    description: string | null; // String
    id: string | null; // String
    name: string | null; // String
  }
}

export interface NexusGenFieldTypeNames {
  Article: { // field return type name
    abstract: 'String'
    authors: 'User'
    id: 'String'
    url: 'String'
  }
  Mutation: { // field return type name
    createArticle: 'Article'
    createOrganization: 'Organization'
    createVenue: 'Venue'
  }
  Organization: { // field return type name
    description: 'String'
    id: 'String'
    name: 'String'
    role: 'Role'
    venues: 'Venue'
  }
  Query: { // field return type name
    articles: 'Article'
    browseOrganizations: 'Organization'
    organization: 'Organization'
    searchUsers: 'User'
    user: 'User'
  }
  User: { // field return type name
    articles: 'Article'
    email: 'String'
    id: 'String'
    name: 'String'
  }
  Venue: { // field return type name
    description: 'String'
    id: 'String'
    name: 'String'
  }
}

export interface NexusGenArgTypes {
  Mutation: {
    createArticle: { // args
      abstract: string; // String!
      authorIds: string[]; // [String!]!
      fileData: NexusGenScalars['Upload']; // Upload!
    }
    createOrganization: { // args
      description: string; // String!
      name: string; // String!
    }
    createVenue: { // args
      description: string; // String!
      name: string; // String!
      organizationId: string; // String!
    }
  }
  Query: {
    browseOrganizations: { // args
      tags?: Array<string | null> | null; // [String]
    }
    organization: { // args
      id: string; // String!
    }
    searchUsers: { // args
      query?: string | null; // String
    }
    user: { // args
      userId: string; // String!
    }
  }
}

export interface NexusGenAbstractTypeMembers {
}

export interface NexusGenTypeInterfaces {
}

export type NexusGenObjectNames = keyof NexusGenObjects;

export type NexusGenInputNames = never;

export type NexusGenEnumNames = keyof NexusGenEnums;

export type NexusGenInterfaceNames = never;

export type NexusGenScalarNames = keyof NexusGenScalars;

export type NexusGenUnionNames = never;

export type NexusGenObjectsUsingAbstractStrategyIsTypeOf = never;

export type NexusGenAbstractsUsingStrategyResolveType = never;

export type NexusGenFeaturesConfig = {
  abstractTypeStrategies: {
    isTypeOf: false
    resolveType: true
    __typename: false
  }
}

export interface NexusGenTypes {
  context: any;
  inputTypes: NexusGenInputs;
  rootTypes: NexusGenRootTypes;
  inputTypeShapes: NexusGenInputs & NexusGenEnums & NexusGenScalars;
  argTypes: NexusGenArgTypes;
  fieldTypes: NexusGenFieldTypes;
  fieldTypeNames: NexusGenFieldTypeNames;
  allTypes: NexusGenAllTypes;
  typeInterfaces: NexusGenTypeInterfaces;
  objectNames: NexusGenObjectNames;
  inputNames: NexusGenInputNames;
  enumNames: NexusGenEnumNames;
  interfaceNames: NexusGenInterfaceNames;
  scalarNames: NexusGenScalarNames;
  unionNames: NexusGenUnionNames;
  allInputTypes: NexusGenTypes['inputNames'] | NexusGenTypes['enumNames'] | NexusGenTypes['scalarNames'];
  allOutputTypes: NexusGenTypes['objectNames'] | NexusGenTypes['enumNames'] | NexusGenTypes['unionNames'] | NexusGenTypes['interfaceNames'] | NexusGenTypes['scalarNames'];
  allNamedTypes: NexusGenTypes['allInputTypes'] | NexusGenTypes['allOutputTypes']
  abstractTypes: NexusGenTypes['interfaceNames'] | NexusGenTypes['unionNames'];
  abstractTypeMembers: NexusGenAbstractTypeMembers;
  objectsUsingAbstractStrategyIsTypeOf: NexusGenObjectsUsingAbstractStrategyIsTypeOf;
  abstractsUsingStrategyResolveType: NexusGenAbstractsUsingStrategyResolveType;
  features: NexusGenFeaturesConfig;
}


declare global {
  interface NexusGenPluginTypeConfig<TypeName extends string> {
  }
  interface NexusGenPluginFieldConfig<TypeName extends string, FieldName extends string> {
  }
  interface NexusGenPluginInputFieldConfig<TypeName extends string, FieldName extends string> {
  }
  interface NexusGenPluginSchemaConfig {
  }
  interface NexusGenPluginArgConfig {
  }
}