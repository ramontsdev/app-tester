import { Platform, StyleSheet, View } from 'react-native'
import { ArrowRight } from 'lucide-react-native'

import { useSignIn } from '@/features/authenticate/useSignIn'
import { NegativeGovLogoIcon } from '@/shared/assets/images'
import { Text } from '@/shared/components/Text'
import { Touchable } from '@/shared/components/Touchable'
import { cn } from '@/shared/utils/cn'

type Props = {
	className?: string
}

export function SignInButton({ className = '' }: Props) {
	const signIn = useSignIn()

	return (
		<Touchable
			className={cn('bg-success-default shadow-sm p-4 flex flex-row justify-between rounded-lg', className)}
			style={Platform.select({ android: styles.shadow })}
			onPress={() => signIn()}
		>
			<View className="flex flex-row items-center gap-1">
				<Text className="text-white">Entre com sua conta</Text>
				<ArrowRight color={'white'} />
			</View>

			<NegativeGovLogoIcon />
		</Touchable>
	)
}

const styles = StyleSheet.create({
	shadow: {
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 3,
		},
		shadowOpacity: 0.2,
		shadowRadius: 3,

		elevation: 5,
	},
})
