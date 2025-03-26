import { Image, Linking, TouchableOpacity } from 'react-native'
import { Directions, Gesture, GestureDetector } from 'react-native-gesture-handler'
import { useSharedValue } from 'react-native-reanimated'
import CarouselBase from 'react-native-reanimated-carousel'

import { useOpenGlobalLoading } from '@/widgets/GlobalLoding'
import { useIsSignedIn } from '@/features/authenticate/useIsSignedIn'
import { useBannersQuery } from '@/entities/banner/banner.queries'
import { Skeleton } from '@/shared/components/Skeleton'
import { env } from '@/shared/lib/env'
import { DeviceDimensions } from '@/shared/utils/constants'

export function Carousel() {
	const { data, isFetching } = useBannersQuery()
	const globalLoading = useOpenGlobalLoading()
	const isSignedIn = useIsSignedIn()
	const isFling = useSharedValue(false)

	function compose() {
		const fling = Gesture.Fling()
			.direction(Directions.RIGHT | Directions.LEFT)
			.onStart(() => {
				isFling.value = true
			})
			.onEnd(() => {
				isFling.value = false
			})
			.onFinalize(() => {
				isFling.value = false
			})
		return fling
	}
	function openUrlFromBanner(url: string, actionType: string) {
		if (isFling.value) {
			return
		}
		switch (actionType) {
			case 'EXTERNA':
				Linking.openURL(url)
				break
			case 'INTERNA':
				let servico = ''
				try {
					let link = new URL(url)
					servico = link.pathname
				} catch (e) {
					console.log(e)
					servico = url
				}
				globalLoading.openGlobalLoading([`Acessando serviço`, 'Aguarde'], {
					nextRoute: '/service/webView',
					routeParams: {
						uri: servico,
						name: 'Serviço',
					},
				})
				break
			default:
				break
		}
	}

	function disableTouchableOnTrue(link: string): boolean {
		// String vazia ou #
		const semValor = link === '#' || link.length === 0 || !isSignedIn
		return semValor
	}

	return (
		<CarouselBase
			vertical={false}
			width={DeviceDimensions.WINDOW_WIDTH}
			height={176}
			style={{ width: DeviceDimensions.WINDOW_WIDTH }}
			loop
			pagingEnabled
			snapEnabled
			autoPlay
			autoPlayInterval={3000}
			mode="parallax"
			modeConfig={{
				parallaxScrollingScale: 0.9,
				parallaxScrollingOffset: 50,
			}}
			data={data}
			renderItem={({ item }) => (
				<GestureDetector gesture={compose()}>
					<TouchableOpacity
						className="flex-1 rounded-lg overflow-hidden"
						disabled={disableTouchableOnTrue(item.link)}
						onPress={() => openUrlFromBanner(item.link, item.actionType)}
					>
						<Skeleton isLoading={isFetching}>
							<Image
								resizeMode="cover"
								source={{ uri: `${env.EXPO_PUBLIC_ADMIN_URL}${item.pathImage}` }}
								style={{ width: '100%', height: '100%' }}
							/>
						</Skeleton>
					</TouchableOpacity>
				</GestureDetector>
			)}
		/>
	)
}
