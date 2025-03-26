import React from 'react'
import { ActivityIndicator, ScrollView, View } from 'react-native'
import { MapPinned, Smartphone } from 'lucide-react-native'
import { router, Stack, useLocalSearchParams } from 'expo-router'

import { useIsSignedIn } from '@/features/authenticate/useIsSignedIn'
import { useSignIn } from '@/features/authenticate/useSignIn'
import { Icon } from '@/shared/components/Icon'
import { Accordion } from '@/shared/components/serviceDetails/Accordion'
import { Steps } from '@/shared/components/serviceDetails/Steps'
import {
	levelRoleVariants,
	useServiceDetailsScreenController,
} from '@/shared/components/serviceDetails/useServiceDetailsScreenController'
import { Text } from '@/shared/components/Text'
import { Touchable } from '@/shared/components/Touchable'
import { cn } from '@/shared/utils/cn'
import { formatDate } from '@/shared/utils/formatDate'

export default function ServiceDetails() {
	const isSignedIn = useIsSignedIn()

	const serviceParams = useLocalSearchParams<{ uri: string; name: string; slug: string; icon: string }>()

	const { hasSteps, isLoading, levelRole, service, toFirstLetterUpperCase } = useServiceDetailsScreenController(
		serviceParams.slug,
	)

	const signIn = useSignIn()

	function handlePressAccessService() {
		if (!isSignedIn) {
			signIn({
				nextRoute: '/service/webView',
				routeParams: {
					uri: serviceParams.uri,
					name: serviceParams.name,
					slug: serviceParams.slug,
					icon: serviceParams.icon,
				},
			})

			return
		}

		router.push({
			pathname: '/service/webView',
			params: {
				uri: serviceParams.uri,
				name: serviceParams.name,
				slug: serviceParams.slug,
				icon: serviceParams.icon,
			},
		})
	}

	return (
		<View className="flex-1 bg-white">
			<ScrollView className="p-4" contentContainerClassName="pb-10">
				<Stack.Screen options={{ title: 'Serviços', headerShown: true }} />
				{isLoading && <ActivityIndicator size={'large'} />}

				{service && !isLoading && (
					<>
						<View className="gap-4">
							<View className="flex-row gap-2 justify-between">
								<Text className="text-xl font-semibold text-primary-700 max-w-72">{service.name}</Text>

								<View className={'rounded-lg py-1 px-2 h-8 bg-[#B5CBE4] justify-center'}>
									<Text className="font-semibold text-white text-xs">{service.department.shortName}</Text>
								</View>
							</View>

							<View className={cn('flex flex-row gap-1')}>
								<Text className="text-lg">Última atualização:</Text>
								<Text className="text-lg">{formatDate(new Date(service.updatedAt))}</Text>
							</View>

							<View className="flex flex-row gap-1 items-center">
								<Text>Nível de acesso:</Text>

								<View className={cn('rounded-lg py-1 px-2', levelRoleVariants({ variant: levelRole }))}>
									<Text className="font-medium text-white">{toFirstLetterUpperCase(service.accessProfile.name)}</Text>
								</View>
							</View>
						</View>

						<View className="h-[1px] bg-slate-500 my-4" />

						<View className="flex flex-row items-center justify-between">
							<View className="flex flex-row gap-2 items-center">
								<Icon name={service.category.iconapp} color={'#011731'} strokeWidth={1} />
								<Text className="text-[#011D3C]">{service.category.name.toLocaleUpperCase()}</Text>
							</View>

							<View className="flex flex-row gap-2 items-center">
								<MapPinned color={'#011D3C'} strokeWidth={1} />
								<Smartphone color={'#011D3C'} strokeWidth={1} />
							</View>
						</View>

						<View className="gap-6 p-5 mt-8 rounded-lg bg-mystic-100">
							<Text className="font-semibold text-lg text-primary-default">O que é serviço?</Text>
							<Text className="text-lg">{service?.description}</Text>
						</View>

						{hasSteps && <Steps data={service} />}

						{service.info.length > 0 && (
							<View className="p-5 mt-8 rounded-lg bg-mystic-100">
								<Text className="font-semibold text-lg text-primary-default">Outras informações</Text>

								<Accordion items={service.info.map((info) => ({ title: info.title, content: info.text }))} />
							</View>
						)}
					</>
				)}
			</ScrollView>

			<View className="items-center p-6 pb-10 border-t border-mystic-100 bg-white">
				<Touchable
					onPress={handlePressAccessService}
					className="h-10 w-3/4 bg-primary-default rounded-lg justify-center items-center"
				>
					<Text className="font-semibold text-white">Acessar serviço</Text>
				</Touchable>
			</View>
		</View>
	)
}
