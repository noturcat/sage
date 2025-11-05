export enum StatusEnum {
	PUBLISHED = 'published',
	DRAFT = 'draft',
	ARCHIVED = 'archived',
}

export enum CommentableTypeEnum {
	PROTOCOL = 'protocol',
	THREAD = 'thread',
	DISCOVERY = 'discovery',
	COMMENT = 'comment',
}

export enum VoteableTypeEnum {
	PROTOCOL = 'protocol',
	THREAD = 'thread',
	DISCOVERY = 'discovery',
	COMMENT = 'comment',
	REPLY = 'reply',
}

export enum VoteTypeEnum {
	UPVOTE = 'upvote',
	DOWNVOTE = 'downvote',
}

export enum ChatMessageTypeEnum {
	ENCRYPTED_TEXT = 'encrypted_text',
	TEXT = 'text',
	IMAGE = 'image',
	FILE = 'file',
	SYSTEM = 'system',
}

export enum ChatReactionTypeEnum {
	LIKE = 'like',
	DISLIKE = 'dislike',
	LOVE = 'love',
	HAHA = 'haha',
	SAD = 'sad',
	ANGRY = 'angry',
}

export enum MessageActionEnum {
	SENT = 'sent',
	EDITED = 'edited',
	DELETED = 'deleted',
}

export enum ReactionActionEnum {
	ADDED = 'added',
	REMOVED = 'removed',
}
