import { TrueSheet } from '@lodev09/react-native-true-sheet'

import { useEnableNotification } from '@/features/notification/useEnableNotification'
import { BottomSheet, BottomSheetAction } from '@/shared/components/BottomSheet'
import { Text } from '@/shared/components/Text'

export function EnableNotificationsBottomSheet() {
	const enableNotifications = useEnableNotification()
	const handleDismiss = async () => {
		await TrueSheet.dismiss('enable-login-notifications')
	}

	const handleEnableNotifications = async () => {
		enableNotifications()
		handleDismiss()
	}

	return (
		<BottomSheet name="enable-login-notifications" title="Ativar notifições">
			<Text className="w-full text-justify text-black tracking-wide text-sm">
				Ative as notificações agora para aproveitar ao máximo a sua experiência no app!
			</Text>
			<BottomSheetAction variant="success" label="Ativar" onPress={handleEnableNotifications} />
			<BottomSheetAction variant="critical" label="Cancelar" onPress={handleDismiss} />
		</BottomSheet>
	)
}
