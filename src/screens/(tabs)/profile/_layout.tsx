import { Stack } from 'expo-router/stack'

import { headerScreenOptions } from '@/app/styles/headerStyle'

export default function Layout() {
	return (
		<Stack screenOptions={headerScreenOptions}>
			<Stack.Screen name="index" options={{ headerShown: true }} />
		</Stack>
	)
}
