import EventEmitter from 'eventemitter3'

export const favoriteEvents = new EventEmitter()

export enum FavoriteEventTypes {
	UPDATED = 'favorite:updated',
	ADDED = 'favorite:added',
	REMOVED = 'favorite:removed',
	ERROR = 'favorite:error',
}
