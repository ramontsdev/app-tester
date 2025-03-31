import EventEmitter from 'eventemitter3'

export enum FavoriteEventsType {
	ADD = 'favorite:add',
	REMOVE = 'favorite:remove',
}

export const favoriteEvents = new EventEmitter<FavoriteEventsType>()
