/**
 * This file was generated by Nexus Schema
 * Do not make changes to this file directly
 */


import type { FieldAuthorizeResolver } from "nexus/dist/plugins/fieldAuthorizePlugin"
import type { core } from "nexus"
declare global {
  interface NexusGenCustomInputMethods<TypeName extends string> {
    /**
     * The `Upload` scalar type represents a file upload.
     */
    upload<FieldName extends string>(fieldName: FieldName, opts?: core.CommonInputFieldConfig<TypeName, FieldName>): void // "Upload";
    /**
     * The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf).
     */
    json<FieldName extends string>(fieldName: FieldName, opts?: core.CommonInputFieldConfig<TypeName, FieldName>): void // "JSON";
  }
}
declare global {
  interface NexusGenCustomOutputMethods<TypeName extends string> {
    /**
     * The `Upload` scalar type represents a file upload.
     */
    upload<FieldName extends string>(fieldName: FieldName, ...opts: core.ScalarOutSpread<TypeName, FieldName>): void // "Upload";
    /**
     * The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf).
     */
    json<FieldName extends string>(fieldName: FieldName, ...opts: core.ScalarOutSpread<TypeName, FieldName>): void // "JSON";
  }
}


declare global {
  interface NexusGen extends NexusGenTypes {}
}

export interface NexusGenInputs {
  AddRelationInput: { // input type
    endDate?: NexusGenScalars['DateTime'] | null; // DateTime
    relation: string; // String!
    targetId: string; // String!
    userId: string; // String!
  }
  AssignSubmissionInput: { // input type
    ownerId: string; // String!
    rootId: string; // String!
  }
  ChairRequestReviewInput: { // input type
    parentRequestId: string; // String!
    userId: string; // String!
  }
  DeclineReviewRequestInput: { // input type
    id: string; // String!
    note?: string | null; // String
  }
  SearchReviewersInput: { // input type
    articleId: string; // String!
    query: string; // String!
  }
  ThreadMessageCreateInput: { // input type
    articleId: string; // String!
    headId?: string | null; // String
    reviewRequestId?: string | null; // String
    type: NexusGenEnums['TheadMessageType']; // TheadMessageType!
    venueId?: string | null; // String
  }
  ThreadMessageUpdateInput: { // input type
    body?: string | null; // String
    decision?: boolean | null; // Boolean
    highlights?: NexusGenScalars['JSON'] | null; // JSON
    id: string; // String!
  }
  ThreadMessagesInput: { // input type
    after?: string | null; // String
    articleId: string; // String!
    headId?: string | null; // String
  }
  UserArticlesInput: { // input type
    after?: string | null; // String
    limit?: number | null; // Int
    userId: string; // String!
  }
  UserReviewsInput: { // input type
    after?: string | null; // String
    limit?: number | null; // Int
    userId: string; // String!
  }
  UserUpdateInput: { // input type
    id: string; // String!
    institution?: string | null; // String
    name?: string | null; // String
    profilePictureRef?: string | null; // String
    twitter?: string | null; // String
    website?: string | null; // String
  }
  VenueArticlesInput: { // input type
    after?: string | null; // String
    headId?: string | null; // String
    venueId: string; // String!
  }
  VenueCreateInput: { // input type
    abbreviation?: string | null; // String
    name: string; // String!
    venueDate?: NexusGenScalars['DateTime'] | null; // DateTime
  }
  VenueMembershipsCreateInput: { // input type
    role: string; // String!
    userIds: Array<string | null>; // [String]!
    venueId: string; // String!
  }
  VenueMembershipsInput: { // input type
    after?: string | null; // String
    headId?: string | null; // String
    role: string; // String!
    venueId: string; // String!
  }
  VenueReviewRequestsInput: { // input type
    after?: string | null; // String
    headId?: string | null; // String
    venueId: string; // String!
  }
  VenueUpdateInput: { // input type
    abbreviation?: string | null; // String
    acceptingSubmissions?: boolean | null; // Boolean
    description?: string | null; // String
    name?: string | null; // String
    reviewTemplate?: string | null; // String
    submissionDeadline?: NexusGenScalars['DateTime'] | null; // DateTime
    venueDate?: NexusGenScalars['DateTime'] | null; // DateTime
    venueId: string; // String!
  }
}

export interface NexusGenEnums {
  RelationType: "ADVISEE" | "ADVISOR" | "COAUTHOR" | "COWORKER" | "FAMILY" | "SOCIAL"
  Role: "ACTION_EDITOR" | "ADMIN" | "NONE"
  TheadMessageType: "COMMENT" | "DECISION" | "REVIEW"
}

export interface NexusGenScalars {
  String: string
  Int: number
  Float: number
  Boolean: boolean
  ID: string
  DateTime: any
  JSON: any
  Upload: any
}

export interface NexusGenObjects {
  Article: { // root type
    abstract?: string | null; // String
    anonymous?: boolean | null; // Boolean
    id?: string | null; // String
    title?: string | null; // String
  }
  ArticleVersion: { // root type
    createdAt?: NexusGenScalars['DateTime'] | null; // DateTime
    id?: string | null; // String
    ref?: string | null; // String
    versionNumber?: number | null; // Int
  }
  Mutation: {};
  Query: {};
  Relation: { // root type
    endDate?: NexusGenScalars['DateTime'] | null; // DateTime
    id?: string | null; // String
    relation?: string | null; // String
  }
  ReviewRequest: { // root type
    createdAt?: NexusGenScalars['DateTime'] | null; // DateTime
    id?: string | null; // String
    note?: string | null; // String
    status?: string | null; // String
    type?: string | null; // String
  }
  ThreadMessage: { // root type
    body?: string | null; // String
    decision?: boolean | null; // Boolean
    headId?: string | null; // String
    highlights?: NexusGenScalars['JSON'] | null; // JSON
    id?: string | null; // String
    publishTimestamp?: NexusGenScalars['DateTime'] | null; // DateTime
    published?: boolean | null; // Boolean
    rating?: number | null; // Int
    released?: boolean | null; // Boolean
    type?: NexusGenEnums['TheadMessageType'] | null; // TheadMessageType
  }
  User: { // root type
    email?: string | null; // String
    id?: string | null; // String
    institution?: string | null; // String
    name?: string | null; // String
    profilePictureUrl?: string | null; // String
    twitter?: string | null; // String
    website?: string | null; // String
  }
  Venue: { // root type
    abbreviation?: string | null; // String
    acceptingSubmissions?: boolean | null; // Boolean
    description?: string | null; // String
    id?: string | null; // String
    logoRef?: string | null; // String
    name?: string | null; // String
    ratingFields?: NexusGenScalars['JSON'] | null; // JSON
    reviewTemplate?: string | null; // String
    submissionDeadline?: NexusGenScalars['DateTime'] | null; // DateTime
    venueDate?: NexusGenScalars['DateTime'] | null; // DateTime
    websiteUrl?: string | null; // String
  }
  VenueMembership: { // root type
    id?: string | null; // String
    role?: string | null; // String
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
    acceptedVenues: Array<NexusGenRootTypes['Venue'] | null> | null; // [Venue]
    anonymous: boolean | null; // Boolean
    authors: Array<NexusGenRootTypes['User'] | null> | null; // [User]
    id: string | null; // String
    latestVersion: NexusGenRootTypes['ArticleVersion']; // ArticleVersion!
    title: string | null; // String
    versions: Array<NexusGenRootTypes['ArticleVersion'] | null>; // [ArticleVersion]!
  }
  ArticleVersion: { // field return type
    createdAt: NexusGenScalars['DateTime'] | null; // DateTime
    id: string | null; // String
    ref: string | null; // String
    versionNumber: number | null; // Int
  }
  Mutation: { // field return type
    addRelation: NexusGenRootTypes['Relation'] | null; // Relation
    assignSubmissionOwner: NexusGenRootTypes['ReviewRequest'] | null; // ReviewRequest
    chairRequestReview: NexusGenRootTypes['ReviewRequest'] | null; // ReviewRequest
    createArticle: NexusGenRootTypes['Article'] | null; // Article
    createThreadMessage: NexusGenRootTypes['ThreadMessage'] | null; // ThreadMessage
    createVenue: NexusGenRootTypes['Venue'] | null; // Venue
    createVenueMemberships: Array<NexusGenRootTypes['VenueMembership'] | null> | null; // [VenueMembership]
    declineReviewRequest: NexusGenRootTypes['ReviewRequest'] | null; // ReviewRequest
    deleteRelation: NexusGenRootTypes['Relation'] | null; // Relation
    deleteThreadMessage: NexusGenRootTypes['ThreadMessage'] | null; // ThreadMessage
    deleteVenueMembership: NexusGenRootTypes['VenueMembership'] | null; // VenueMembership
    publishMessage: NexusGenRootTypes['ThreadMessage'] | null; // ThreadMessage
    updateThreadMessage: NexusGenRootTypes['ThreadMessage'] | null; // ThreadMessage
    updateUser: NexusGenRootTypes['User'] | null; // User
    updateVenue: NexusGenRootTypes['Venue'] | null; // Venue
  }
  Query: { // field return type
    article: NexusGenRootTypes['Article'] | null; // Article
    draftMessage: NexusGenRootTypes['ThreadMessage'] | null; // ThreadMessage
    feedArticles: Array<NexusGenRootTypes['Article'] | null> | null; // [Article]
    searchEditors: Array<NexusGenRootTypes['User'] | null> | null; // [User]
    searchOpenVenues: Array<NexusGenRootTypes['Venue'] | null> | null; // [Venue]
    searchReviewers: Array<NexusGenRootTypes['User'] | null> | null; // [User]
    searchUsers: Array<NexusGenRootTypes['User'] | null> | null; // [User]
    submissionOwnerCandidates: Array<NexusGenRootTypes['User'] | null> | null; // [User]
    threadMessages: Array<NexusGenRootTypes['ThreadMessage'] | null> | null; // [ThreadMessage]
    user: NexusGenRootTypes['User'] | null; // User
    userArticles: Array<NexusGenRootTypes['Article'] | null> | null; // [Article]
    userRelations: Array<NexusGenRootTypes['Relation'] | null> | null; // [Relation]
    userRequests: Array<NexusGenRootTypes['ReviewRequest'] | null> | null; // [ReviewRequest]
    userReviews: Array<NexusGenRootTypes['ThreadMessage'] | null> | null; // [ThreadMessage]
    venue: NexusGenRootTypes['Venue'] | null; // Venue
    venueArticles: Array<NexusGenRootTypes['Article'] | null> | null; // [Article]
    venueMemberships: Array<NexusGenRootTypes['VenueMembership'] | null> | null; // [VenueMembership]
    venueReviewRequests: Array<NexusGenRootTypes['ReviewRequest'] | null> | null; // [ReviewRequest]
    venues: Array<NexusGenRootTypes['Venue'] | null> | null; // [Venue]
  }
  Relation: { // field return type
    endDate: NexusGenScalars['DateTime'] | null; // DateTime
    id: string | null; // String
    relation: string | null; // String
    target: NexusGenRootTypes['User'] | null; // User
  }
  ReviewRequest: { // field return type
    article: NexusGenRootTypes['Article'] | null; // Article
    chairRequest: NexusGenRootTypes['ReviewRequest'] | null; // ReviewRequest
    createdAt: NexusGenScalars['DateTime'] | null; // DateTime
    id: string | null; // String
    note: string | null; // String
    status: string | null; // String
    type: string | null; // String
    user: NexusGenRootTypes['User'] | null; // User
    venue: NexusGenRootTypes['Venue'] | null; // Venue
  }
  ThreadMessage: { // field return type
    article: NexusGenRootTypes['Article'] | null; // Article
    author: NexusGenRootTypes['User'] | null; // User
    body: string | null; // String
    decision: boolean | null; // Boolean
    headId: string | null; // String
    highlights: NexusGenScalars['JSON'] | null; // JSON
    id: string | null; // String
    publishTimestamp: NexusGenScalars['DateTime'] | null; // DateTime
    published: boolean | null; // Boolean
    rating: number | null; // Int
    released: boolean | null; // Boolean
    type: NexusGenEnums['TheadMessageType'] | null; // TheadMessageType
    venue: NexusGenRootTypes['Venue'] | null; // Venue
  }
  User: { // field return type
    email: string | null; // String
    id: string | null; // String
    institution: string | null; // String
    name: string | null; // String
    profilePictureUrl: string | null; // String
    twitter: string | null; // String
    website: string | null; // String
  }
  Venue: { // field return type
    abbreviation: string | null; // String
    acceptingSubmissions: boolean | null; // Boolean
    description: string | null; // String
    id: string | null; // String
    logoRef: string | null; // String
    name: string | null; // String
    ratingFields: NexusGenScalars['JSON'] | null; // JSON
    reviewTemplate: string | null; // String
    role: NexusGenEnums['Role'] | null; // Role
    submissionDeadline: NexusGenScalars['DateTime'] | null; // DateTime
    venueDate: NexusGenScalars['DateTime'] | null; // DateTime
    websiteUrl: string | null; // String
  }
  VenueMembership: { // field return type
    id: string | null; // String
    role: string | null; // String
    user: NexusGenRootTypes['User'] | null; // User
    venue: NexusGenRootTypes['Venue'] | null; // Venue
  }
}

export interface NexusGenFieldTypeNames {
  Article: { // field return type name
    abstract: 'String'
    acceptedVenues: 'Venue'
    anonymous: 'Boolean'
    authors: 'User'
    id: 'String'
    latestVersion: 'ArticleVersion'
    title: 'String'
    versions: 'ArticleVersion'
  }
  ArticleVersion: { // field return type name
    createdAt: 'DateTime'
    id: 'String'
    ref: 'String'
    versionNumber: 'Int'
  }
  Mutation: { // field return type name
    addRelation: 'Relation'
    assignSubmissionOwner: 'ReviewRequest'
    chairRequestReview: 'ReviewRequest'
    createArticle: 'Article'
    createThreadMessage: 'ThreadMessage'
    createVenue: 'Venue'
    createVenueMemberships: 'VenueMembership'
    declineReviewRequest: 'ReviewRequest'
    deleteRelation: 'Relation'
    deleteThreadMessage: 'ThreadMessage'
    deleteVenueMembership: 'VenueMembership'
    publishMessage: 'ThreadMessage'
    updateThreadMessage: 'ThreadMessage'
    updateUser: 'User'
    updateVenue: 'Venue'
  }
  Query: { // field return type name
    article: 'Article'
    draftMessage: 'ThreadMessage'
    feedArticles: 'Article'
    searchEditors: 'User'
    searchOpenVenues: 'Venue'
    searchReviewers: 'User'
    searchUsers: 'User'
    submissionOwnerCandidates: 'User'
    threadMessages: 'ThreadMessage'
    user: 'User'
    userArticles: 'Article'
    userRelations: 'Relation'
    userRequests: 'ReviewRequest'
    userReviews: 'ThreadMessage'
    venue: 'Venue'
    venueArticles: 'Article'
    venueMemberships: 'VenueMembership'
    venueReviewRequests: 'ReviewRequest'
    venues: 'Venue'
  }
  Relation: { // field return type name
    endDate: 'DateTime'
    id: 'String'
    relation: 'String'
    target: 'User'
  }
  ReviewRequest: { // field return type name
    article: 'Article'
    chairRequest: 'ReviewRequest'
    createdAt: 'DateTime'
    id: 'String'
    note: 'String'
    status: 'String'
    type: 'String'
    user: 'User'
    venue: 'Venue'
  }
  ThreadMessage: { // field return type name
    article: 'Article'
    author: 'User'
    body: 'String'
    decision: 'Boolean'
    headId: 'String'
    highlights: 'JSON'
    id: 'String'
    publishTimestamp: 'DateTime'
    published: 'Boolean'
    rating: 'Int'
    released: 'Boolean'
    type: 'TheadMessageType'
    venue: 'Venue'
  }
  User: { // field return type name
    email: 'String'
    id: 'String'
    institution: 'String'
    name: 'String'
    profilePictureUrl: 'String'
    twitter: 'String'
    website: 'String'
  }
  Venue: { // field return type name
    abbreviation: 'String'
    acceptingSubmissions: 'Boolean'
    description: 'String'
    id: 'String'
    logoRef: 'String'
    name: 'String'
    ratingFields: 'JSON'
    reviewTemplate: 'String'
    role: 'Role'
    submissionDeadline: 'DateTime'
    venueDate: 'DateTime'
    websiteUrl: 'String'
  }
  VenueMembership: { // field return type name
    id: 'String'
    role: 'String'
    user: 'User'
    venue: 'Venue'
  }
}

export interface NexusGenArgTypes {
  Mutation: {
    addRelation: { // args
      input?: NexusGenInputs['AddRelationInput'] | null; // AddRelationInput
    }
    assignSubmissionOwner: { // args
      input: NexusGenInputs['AssignSubmissionInput']; // AssignSubmissionInput!
    }
    chairRequestReview: { // args
      input: NexusGenInputs['ChairRequestReviewInput']; // ChairRequestReviewInput!
    }
    createArticle: { // args
      abstract: string; // String!
      anonymous: boolean; // Boolean!
      authorIds: string[]; // [String!]!
      ref: string; // String!
      title: string; // String!
      venueId?: string | null; // String
    }
    createThreadMessage: { // args
      input: NexusGenInputs['ThreadMessageCreateInput']; // ThreadMessageCreateInput!
    }
    createVenue: { // args
      input?: NexusGenInputs['VenueCreateInput'] | null; // VenueCreateInput
    }
    createVenueMemberships: { // args
      input?: NexusGenInputs['VenueMembershipsCreateInput'] | null; // VenueMembershipsCreateInput
    }
    declineReviewRequest: { // args
      input: NexusGenInputs['DeclineReviewRequestInput']; // DeclineReviewRequestInput!
    }
    deleteRelation: { // args
      id?: string | null; // String
    }
    deleteThreadMessage: { // args
      id?: string | null; // String
    }
    deleteVenueMembership: { // args
      id?: string | null; // String
    }
    publishMessage: { // args
      body: string; // String!
      highlights: NexusGenScalars['JSON']; // JSON!
      id: string; // String!
    }
    updateThreadMessage: { // args
      input: NexusGenInputs['ThreadMessageUpdateInput']; // ThreadMessageUpdateInput!
    }
    updateUser: { // args
      input?: NexusGenInputs['UserUpdateInput'] | null; // UserUpdateInput
    }
    updateVenue: { // args
      input?: NexusGenInputs['VenueUpdateInput'] | null; // VenueUpdateInput
    }
  }
  Query: {
    article: { // args
      id?: string | null; // String
    }
    draftMessage: { // args
      articleId?: string | null; // String
      headId?: string | null; // String
    }
    searchEditors: { // args
      organizationId: string; // String!
      query?: string | null; // String
    }
    searchOpenVenues: { // args
      query?: string | null; // String
    }
    searchReviewers: { // args
      input?: NexusGenInputs['SearchReviewersInput'] | null; // SearchReviewersInput
    }
    searchUsers: { // args
      query?: string | null; // String
    }
    submissionOwnerCandidates: { // args
      venueId?: string | null; // String
    }
    threadMessages: { // args
      input?: NexusGenInputs['ThreadMessagesInput'] | null; // ThreadMessagesInput
    }
    user: { // args
      id?: string | null; // String
    }
    userArticles: { // args
      input?: NexusGenInputs['UserArticlesInput'] | null; // UserArticlesInput
    }
    userRelations: { // args
      userId?: string | null; // String
    }
    userRequests: { // args
      userId?: string | null; // String
    }
    userReviews: { // args
      input?: NexusGenInputs['UserReviewsInput'] | null; // UserReviewsInput
    }
    venue: { // args
      id?: string | null; // String
    }
    venueArticles: { // args
      input?: NexusGenInputs['VenueArticlesInput'] | null; // VenueArticlesInput
    }
    venueMemberships: { // args
      input?: NexusGenInputs['VenueMembershipsInput'] | null; // VenueMembershipsInput
    }
    venueReviewRequests: { // args
      input?: NexusGenInputs['VenueReviewRequestsInput'] | null; // VenueReviewRequestsInput
    }
  }
}

export interface NexusGenAbstractTypeMembers {
}

export interface NexusGenTypeInterfaces {
}

export type NexusGenObjectNames = keyof NexusGenObjects;

export type NexusGenInputNames = keyof NexusGenInputs;

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
  interface NexusGenPluginInputTypeConfig<TypeName extends string> {
  }
  interface NexusGenPluginFieldConfig<TypeName extends string, FieldName extends string> {
    /**
     * Authorization for an individual field. Returning "true"
     * or "Promise<true>" means the field can be accessed.
     * Returning "false" or "Promise<false>" will respond
     * with a "Not Authorized" error for the field.
     * Returning or throwing an error will also prevent the
     * resolver from executing.
     */
    authorize?: FieldAuthorizeResolver<TypeName, FieldName>
  }
  interface NexusGenPluginInputFieldConfig<TypeName extends string, FieldName extends string> {
  }
  interface NexusGenPluginSchemaConfig {
  }
  interface NexusGenPluginArgConfig {
  }
}