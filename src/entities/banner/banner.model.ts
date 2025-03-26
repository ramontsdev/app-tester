export type BannerModel = {
	id: number
	titulo: string
	link: string
	tipoAcao: string
	imagem: Imagem
}

export type Imagem = {
	data: DataImage
}

export type DataImage = {
	id: number
	attributes: AttributesImage
}

export type AttributesImage = {
	name: string
	alternativeText: any
	caption: any
	width: number
	height: number
	formats: Formats
	hash: string
	ext: string
	mime: string
	size: number
	url: string
	previewUrl: any
	provider: string
	provider_metadata: any
	createdAt: string
	updatedAt: string
}

export type Formats = {
	large: Large
	small: Small
	medium: Medium
	thumbnail: Thumbnail
}

export type Large = {
	ext: string
	url: string
	hash: string
	mime: string
	name: string
	path: any
	size: number
	width: number
	height: number
}

export type Small = {
	ext: string
	url: string
	hash: string
	mime: string
	name: string
	path: any
	size: number
	width: number
	height: number
}

export type Medium = {
	ext: string
	url: string
	hash: string
	mime: string
	name: string
	path: any
	size: number
	width: number
	height: number
}

export type Thumbnail = {
	ext: string
	url: string
	hash: string
	mime: string
	name: string
	path: any
	size: number
	width: number
	height: number
}
