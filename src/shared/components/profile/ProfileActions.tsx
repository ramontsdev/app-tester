import { ReactNode, useMemo, useState } from 'react'
import { View } from 'react-native'
import Animated, { useAnimatedStyle, useDerivedValue, useSharedValue, withTiming } from 'react-native-reanimated'
import { Bell, ChevronRight, Fingerprint, List, LogOut, MapPin, Settings } from 'lucide-react-native'

import type {
	GestureResponderEvent,
	LayoutChangeEvent,
	SwitchProps as NativeSwitchProps,
	TouchableOpacityProps,
} from 'react-native'
import type { AnimatedStyle, SharedValue } from 'react-native-reanimated'

import { useOpenGlobalLoading } from '@/widgets/GlobalLoding'
import { useSignOut } from '@/features/authenticate/useSignOut'
import { useRequestLocationPermission } from '@/features/location/useLocationPersmission'
import { useNotificationStore } from '@/features/notification/useNotificationStore'
import { useNotificationToggle } from '@/features/notification/useNotificationToggle'
import { Text } from '@/shared/components/Text'
import { TouchableFeedback } from '@/shared/components/TouchableFeedback'
import { localStorage } from '@/shared/lib/localStorage'
import { LocalStorageKeys } from '@/shared/utils/localStorageKeys'

import { Switch } from '../Switch'

type PreferencesAccordionItemProps = {
	isExpanded: SharedValue<boolean>
	children: ReactNode
	viewKey: string
	animatedStyle?: AnimatedStyle
	duration?: number
}

type PreferencesAccordionInnerItemProps = {
	children: React.ReactNode
	icon: JSX.Element
	isLink?: boolean
	valueSwitch: NativeSwitchProps['value']
	handleSwitch: NativeSwitchProps['onValueChange']
}

type ProfileActionItemVariant = 'link' | 'accordion' | 'action'

type ProfileActionItemProps = {
	animatedStyle?: AnimatedStyle
	children: React.ReactNode
	icon: JSX.Element
	onPress: TouchableOpacityProps['onPress']
	variant?: ProfileActionItemVariant
}

function PreferencesAccordionItem({
	isExpanded,
	children,
	viewKey,
	animatedStyle,
	duration = 200,
}: PreferencesAccordionItemProps) {
	const height = useSharedValue(0)

	const derivedHeight = useDerivedValue(() => withTiming(height.value * Number(isExpanded.value), { duration }))

	const contentStyle = useAnimatedStyle(() => ({
		height: derivedHeight.value,
	}))

	const handleLayout = (event: LayoutChangeEvent) => {
		height.value = event.nativeEvent.layout.height
	}

	return (
		<Animated.View
			key={`accordionItem_${viewKey}`}
			className="w-full overflow-hidden"
			style={[contentStyle, animatedStyle]}
		>
			<View className="w-full absolute items-center" onLayout={handleLayout}>
				{children}
			</View>
		</Animated.View>
	)
}

function PreferencesAccordionInnerItem({
	children,
	icon,
	isLink,
	valueSwitch,
	handleSwitch,
}: PreferencesAccordionInnerItemProps) {
	const isSwitch = !isLink && handleSwitch

	return (
		<TouchableFeedback>
			<View className="w-full bg-[#9AB4D080] p-4">
				<View className="flex-row items-center gap-x-4 w-full">
					{icon}
					<Text className="flex-1 text-sm">{children}</Text>
					{isSwitch && handleSwitch && <Switch onValueChange={handleSwitch} value={valueSwitch} />}
				</View>
			</View>
		</TouchableFeedback>
	)
}

function PreferencesAccordionContent() {
	const handleToggleNotifications = useNotificationToggle()
	const { mutate: requestLocationPermission } = useRequestLocationPermission()

	const notificationEnable = useNotificationStore((state) => state.notificationEnable)

	const locationEnable = localStorage.getItem(LocalStorageKeys.LOCATION_ENABLE) === 'true'

	const isBiometricSignInCompatible = localStorage.getItem(LocalStorageKeys.IS_BIOMETRY_COMPATIBLE) === 'true'

	const biometricSignInEnable = localStorage.getItem(LocalStorageKeys.BIOMETRIC_SIGN_IN_ENABLE) === 'true'

	return (
		<View className="w-full items-center justify-start">
			{isBiometricSignInCompatible && (
				<PreferencesAccordionInnerItem
					icon={<Fingerprint color="#000000" size={16} />}
					valueSwitch={biometricSignInEnable}
					handleSwitch={(value) => {
						localStorage.setItem(LocalStorageKeys.BIOMETRIC_SIGN_IN_ENABLE, `${value}`)
					}}
				>
					Login por biometria
				</PreferencesAccordionInnerItem>
			)}
			<PreferencesAccordionInnerItem
				icon={<MapPin color="#000000" size={16} />}
				valueSwitch={locationEnable}
				handleSwitch={(value) => {
					requestLocationPermission(value)
				}}
			>
				Localização
			</PreferencesAccordionInnerItem>
			<PreferencesAccordionInnerItem
				valueSwitch={notificationEnable}
				handleSwitch={handleToggleNotifications}
				icon={<Bell color="#000000" size={16} />}
			>
				Receber notificações
			</PreferencesAccordionInnerItem>
			{/* <PreferencesAccordionInnerItem isLink icon={<Info color="#000000" size={16} />}>
				Sobre
			</PreferencesAccordionInnerItem> */}
		</View>
	)
}

function PreferencesAccordion({ open }: { open: SharedValue<boolean> }) {
	return (
		<View className="w-full">
			<PreferencesAccordionItem isExpanded={open} viewKey="Accordion">
				<PreferencesAccordionContent />
			</PreferencesAccordionItem>
		</View>
	)
}

function ProfileActionItem({ children, icon, onPress, variant = 'link' }: ProfileActionItemProps) {
	const [isPressed, setIsPressed] = useState(false)

	const handleProfileActionItemPress = (event: GestureResponderEvent) => {
		setIsPressed((previousValue) => !previousValue)
		if (onPress) onPress(event)
	}

	const chevronAnimatedStyle = useAnimatedStyle(() => ({
		transform: [
			{
				rotate: withTiming(isPressed ? '90deg' : '0deg', { duration: 200 }),
			},
		],
	}))

	const VariantBasedChevron = useMemo(() => {
		const defaultChevron = () => <ChevronRight color="#000000" size={16} />

		const chevronVariantsMap = new Map<ProfileActionItemVariant, () => JSX.Element>([
			['link', () => <ChevronRight color="#000000" size={16} />],
			[
				'accordion',
				() => (
					<Animated.View className="items-center justify-center" style={[chevronAnimatedStyle]}>
						<ChevronRight color="#000000" size={16} />
					</Animated.View>
				),
			],
			['action', () => <></>],
		])

		return chevronVariantsMap.get(variant) ?? defaultChevron
	}, [chevronAnimatedStyle, variant])

	return (
		<TouchableFeedback onPress={handleProfileActionItemPress}>
			<View className="w-full bg-[#DDE3E980] p-4">
				<View className="flex-row items-center gap-x-4 w-full">
					{icon}
					<Text className="flex-1 text-sm">{children}</Text>
					<VariantBasedChevron />
				</View>
			</View>
		</TouchableFeedback>
	)
}

export function ProfileActions() {
	const signOut = useSignOut()

	const openPreferencesAccordion = useSharedValue(false)

	const handlePreferencesAccordionPress = () => {
		openPreferencesAccordion.value = !openPreferencesAccordion.value
	}

	const globalLoding = useOpenGlobalLoading()

	function goToMySolicitations() {
		globalLoding.openGlobalLoading(['Acessando serviço Minhas solicitações', 'Aguarde'], {
			nextRoute: '/service/webView',
			routeParams: {
				uri: '/app/acompanhar-minhas-solicitacoes',
				name: 'Minhas solicitações',
			},
		})
	}

	return (
		<View className="w-full">
			<ProfileActionItem icon={<List color="#000000" size={16} />} onPress={goToMySolicitations}>
				Minhas solicitações
			</ProfileActionItem>
			{/* <ProfileActionItem icon={<User color="#000000" size={16} />} onPress={() => console.log('Informações pessoais')}>
				Informações pessoais
			</ProfileActionItem> */}
			<ProfileActionItem
				variant="accordion"
				icon={<Settings color="#000000" size={16} />}
				onPress={handlePreferencesAccordionPress}
			>
				Preferências
			</ProfileActionItem>
			<View className="flex-1 items-center justify-center">
				<PreferencesAccordion open={openPreferencesAccordion} />
			</View>
			<ProfileActionItem variant="action" icon={<LogOut color="#000000" size={16} />} onPress={signOut}>
				Sair
			</ProfileActionItem>
		</View>
	)
}
