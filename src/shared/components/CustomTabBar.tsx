import { TouchableOpacity, View } from 'react-native'
import { BottomTabBarProps } from '@react-navigation/bottom-tabs'

import { defaultTheme } from '@/app/styles/theme'
import { useAppStore } from '@/app/useAppStore'
import { Text } from '@/shared/components/Text'
import { cn } from '@/shared/utils/cn'

type Props = {
	tabBarProps: BottomTabBarProps
}
export function CustomTabBar({ tabBarProps: { state, descriptors, navigation, insets } }: Props) {
	const hasBottomPadding = insets.bottom > 16

	const isAnimatedSplashVisible = useAppStore((state) => state.isAnimatedSplashVisible)

	if (isAnimatedSplashVisible) return null

	return (
		<View className={'bg-mystic-200'}>
			<View
				style={{ paddingBottom: insets.bottom }}
				className={cn('flex flex-row justify-evenly py-2 pt-4 bg-mystic-200', !hasBottomPadding && '!pb-2')}
			>
				{state.routes.map((route, index) => {
					const { options } = descriptors[route.key]

					const Icon = options.tabBarIcon
					const isFocused = state.index === index

					const onPress = () => {
						const event = navigation.emit({
							type: 'tabPress',
							target: route.key,
							canPreventDefault: true,
						})

						if (!isFocused && !event.defaultPrevented) {
							navigation.navigate(route.name, route.params)
						}
					}

					return (
						<TouchableOpacity key={route.key} onPress={onPress} activeOpacity={0.7} className="items-center gap-2">
							{typeof Icon === 'function' && (
								<Icon
									focused={isFocused}
									color={isFocused ? defaultTheme.colors.primary[800] : defaultTheme.colors.gray.default}
									size={24}
								/>
							)}

							<Text className={cn('text-gray-500 text-sm', isFocused && 'text-primary-800 font-semibold')}>
								{options.title}
							</Text>
						</TouchableOpacity>
					)
				})}
			</View>
		</View>
	)
}
