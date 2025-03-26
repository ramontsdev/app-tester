import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Dimensions, FlatList, Platform, StatusBar, StyleSheet, TouchableOpacity, View } from 'react-native'
import { ChevronLeft, ChevronRight } from 'lucide-react-native'
import Constants from 'expo-constants'
import { ImageBackground } from 'expo-image'
import { Stack, useRouter } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { useQueryClient } from '@tanstack/react-query'

import { useAppStore } from '@/app/useAppStore'
import { GovLogo, OnboardingSecurity, OnboardingServices, OnboardingWallet } from '@/shared/assets/images'
import { Text } from '@/shared/components/Text'
import { localStorage } from '@/shared/lib/localStorage'
import { cn } from '@/shared/utils/cn'
import { LocalStorageKeys } from '@/shared/utils/localStorageKeys'

const { width } = Dimensions.get('window')

const Onboarding = () => {
	const queryClient = useQueryClient()
	const setIsAppReady = useAppStore((state) => state.setIsAppReady)

	const onLayoutRootView = useCallback(() => {
		SplashScreen.hide()
	}, [])

	useEffect(() => {
		if (queryClient.isFetching() === 0 && queryClient.isMutating() === 0) {
			setIsAppReady(true)
		}
	}, [queryClient, setIsAppReady])

	const slides = [
		{
			id: 1,
			image: (
				<View className="relative h-full">
					<View className="absolute w-full items-center overflow-hidden top-72">
						<GovLogo />
					</View>
					<View className="p-8 h-full justify-center top-28">
						<Text className="text-center font-semibold tracking-wide text-lg">Serviços públicos na palma da mão</Text>
						<Text className="text-center tracking-wide p-6">
							A sua plataforma digital de serviços públicos do Governo do Piauí
						</Text>
					</View>
				</View>
			),
		},
		{
			id: 2,
			image: (
				<ImageBackground
					source={require('../../shared/assets/images/onboarding-wave-01.png')}
					contentFit="fill"
					className="flex-1 justify-end"
				>
					<View className="relative h-full">
						<View className="absolute w-full items-center overflow-hidden top-44">
							<OnboardingSecurity />
						</View>
						<View className="p-10 h-full justify-center top-28">
							<Text className="text-center font-semibold tracking-wide text-lg">Segurança ao acessar</Text>
							<Text className="text-center tracking-wide p-6">
								Seus dados estão protegidos em um ambiente de alta segurança.
							</Text>
						</View>
					</View>
				</ImageBackground>
			),
		},
		{
			id: 3,
			image: (
				<ImageBackground
					source={require('../../shared/assets/images/onboarding-wave-02.png')}
					contentFit="fill"
					className="flex-1 justify-end"
				>
					<View className="relative h-full">
						<View className="absolute w-full items-center overflow-hidden top-44">
							<OnboardingWallet />
						</View>
						<View className="p-10 h-full justify-center top-28">
							<Text className="text-center font-semibold tracking-wide text-lg">Carteira Digital</Text>
							<Text className="text-center tracking-wide p-6">
								Tenha a praticidade de ter todos os seus documentos digitais em um só lugar.
							</Text>
						</View>
					</View>
				</ImageBackground>
			),
		},
		{
			id: 4,
			image: (
				<ImageBackground
					source={require('../../shared/assets/images/onboarding-wave-03.png')}
					contentFit="fill"
					className="flex-1 justify-end"
				>
					<View className="relative h-full">
						<View className="absolute w-full items-center overflow-hidden top-44">
							<OnboardingServices />
						</View>
						<View className="p-10 h-full justify-center top-28">
							<Text className="text-center font-semibold tracking-wide text-lg">Serviços Digitais</Text>
							<Text className="text-center tracking-wide p-6">
								Acesse a nossa carta de serviços e resolva tudo online, sem precisar sair de casa.
							</Text>
						</View>
					</View>
				</ImageBackground>
			),
		},
	]
	const router = useRouter()
	const [mounted, setMounted] = useState(false)
	const [currentIndex, setCurrentIndex] = useState(0)
	const [activeIndex, setActiveIndex] = useState(0)
	const flatListRef = useRef<FlatList>(null)

	const handleScroll = (event: any) => {
		const offsetX = event.nativeEvent.contentOffset.x
		const newIndex = Math.round(offsetX / width)
		setCurrentIndex(newIndex)
		setActiveIndex(newIndex)
	}

	const handleNext = () => {
		if (flatListRef.current && currentIndex < slides.length - 1) {
			flatListRef.current.scrollToIndex({ index: currentIndex + 1 })
			setCurrentIndex(currentIndex + 1)
			setActiveIndex(currentIndex + 1)
		}
	}

	const handlePrev = () => {
		if (flatListRef.current && currentIndex > 0) {
			flatListRef.current.scrollToIndex({ index: currentIndex - 1 })
			setCurrentIndex(currentIndex - 1)
			setActiveIndex(currentIndex - 1)
		}
	}

	const finishOnboarding = () => {
		localStorage.setItem(LocalStorageKeys.ONBOARDING_VISIBLE, 'true')
		router.replace('/(tabs)')
	}

	useEffect(() => {
		setMounted(true)
	}, [])

	useEffect(() => {
		if (mounted && localStorage.getItem(LocalStorageKeys.ONBOARDING_VISIBLE) === 'true') {
			router.replace('/(tabs)')
		}
	}, [mounted, router])

	const isIOS = Platform.OS === 'ios'

	const statusBarHeight = isIOS ? Constants.statusBarHeight : StatusBar.currentHeight

	return (
		<>
			<Stack.Screen
				options={{
					headerShown: false,
				}}
			/>
			<>
				<View className="p-6 px-4 bg-white" style={{ padding: statusBarHeight }} onLayout={onLayoutRootView}>
					{currentIndex !== slides.length - 1 ? (
						<TouchableOpacity onPress={finishOnboarding} className="py-2 px-7 self-end">
							<Text className="text-right font-semibold tracking-wide">Pular</Text>
						</TouchableOpacity>
					) : (
						<TouchableOpacity className="px-4 py-2">
							<Text className="text-right font-semibold tracking-wide"></Text>
						</TouchableOpacity>
					)}
				</View>
				<FlatList
					ref={flatListRef}
					data={slides}
					horizontal
					pagingEnabled
					onMomentumScrollEnd={(event) => {
						handleScroll(event)
					}}
					scrollEventThrottle={16}
					showsHorizontalScrollIndicator={false}
					keyExtractor={(item) => String(item.id)}
					renderItem={({ item }) => (
						<View className="justify-center bg-white" style={{ width: width }}>
							{item.image}
						</View>
					)}
				/>
				<View className="absolute bottom-0 w-full">
					<View className={cn('h-40 ', isIOS && 'h-44')}>
						<View className="flex-row justify-center">
							{slides.map((slide, i) => (
								<View
									key={slide.id}
									style={[styles.dot, { backgroundColor: i === activeIndex ? '#7F7D7D' : '#BABABC' }]}
								/>
							))}
						</View>

						{currentIndex !== slides.length - 1 ? (
							<View className={cn('m-6 flex-row justify-end items-end py-3', isIOS && 'py-10')}>
								{currentIndex > 0 && (
									<TouchableOpacity onPress={handlePrev} className="px-4 flex-row items-center">
										<ChevronLeft color={'#000'} width={18} height={18} />
										<Text className="font-semibold tracking-wide leading-none ">Voltar</Text>
									</TouchableOpacity>
								)}
								<View className="flex-1 h-2" />
								<TouchableOpacity onPress={handleNext} className="px-4 flex-row items-center">
									<Text className="font-semibold tracking-wide leading-none">Próximo</Text>
									<ChevronRight color={'#000'} width={18} height={18} />
								</TouchableOpacity>
							</View>
						) : (
							<View className="m-12 py-3 bg-[#034EA2] rounded-lg">
								<TouchableOpacity onPress={finishOnboarding} className="px-4 py-2">
									<Text className="text-center font-semibold tracking-wide color-white text-xl leading-none">
										Começar
									</Text>
								</TouchableOpacity>
							</View>
						)}
					</View>
				</View>
			</>
		</>
	)
}

const styles = StyleSheet.create({
	dot: {
		width: 10,
		height: 10,
		borderRadius: 5,
		backgroundColor: '#555',
		margin: 5,
	},
})

export default Onboarding
