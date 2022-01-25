export enum RoleEnum {
  ADMIN = "ADMIN",
  ACTION_EDITOR = "ACTION_EDITOR",
  NONE = "NONE",
}

export enum IdentityContextEnum {
  AUTHOR = "AUTHOR",
  REVIEWER = "REVIEWER",
  CHAIR = "CHAIR",
}

export enum ThreadMessageTypeEnum {
  COMMENT = "COMMENT",
  REVIEW = "REVIEW",
  DECISION = "DECISION",
}

export enum ReviewRequestStatusEnum {
  CREATED = "CREATED",
  RELEASED = "RELEASED",
  DECLINED = "DECLINED",
}

export enum RelationEnum {
  ADVISOR = "ADVISOR",
  ADVISEE = "ADVISEE",
  COAUTHOR = "COAUTHOR",
  COWORKER = "COWORKER",
  FAMILY = "FAMILY",
  SOCIAL = "SOCIAL",
}

export enum ReviewRequestTypeEnum {
  ROOT = "ROOT",
  CHAIR = "CHAIR",
  REVIEW = "REVIEW",
}

export enum UploadTypeEnum {
  ARTICLE,
  LOGO,
  PROFILE_IMAGE,
}
