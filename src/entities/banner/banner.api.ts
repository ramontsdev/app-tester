import axios from 'axios'

import { env } from '@/shared/lib/env'

import { BannerModel } from './banner.model'

const bannerApi = axios.create({
	baseURL: env.EXPO_PUBLIC_ADMIN_URL,
	headers: {
		Authorization: `Bearer ${env.EXPO_PUBLIC_ADMIN_AUTH_TOKEN}`,
	},
})

export async function getBanners() {
	const { data } = await bannerApi.get('/api/banners-app?populate[banners][populate][imagem]=*')
	const { banners } = data.data.attributes as { banners: BannerModel[] }

	const bannersMapped = banners.map((banner) => {
		return {
			id: banner.id,
			pathImage: banner.imagem.data.attributes.url,
			actionType: banner.tipoAcao,
			link: banner.link,
		}
	})

	return bannersMapped
}
