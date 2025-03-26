import '@/app/styles/global.css'

import { Home, LayoutGrid, User, Wallet } from 'lucide-react-native'
import { Tabs } from 'expo-router'

import { defaultTheme } from '@/app/styles/theme'
import { CustomBottomTabsHeader } from '@/shared/components/customNavigationHeaders'
import { CustomTabBar } from '@/shared/components/CustomTabBar'

export default function Layout() {
	return (
		<Tabs
			screenOptions={{
				headerShown: false,
				tabBarActiveTintColor: defaultTheme.colors.primary.default,
				tabBarItemStyle: { marginVertical: 5 },
				tabBarStyle: {
					backgroundColor: defaultTheme.colors.mystic[200],
					height: 72,
				},
				tabBarLabelStyle: {
					fontSize: 12,
					fontWeight: '400',
				},
				tabBarHideOnKeyboard: true,
				header: (props) => <CustomBottomTabsHeader navigateProps={props} />,
			}}
			tabBar={(props) => <CustomTabBar tabBarProps={props} />}
		>
			<Tabs.Screen
				name="index"
				options={{
					title: 'Início',
					tabBarIcon: ({ color }) => <Home color={color} strokeWidth={2} />,
					lazy: false,
				}}
			/>
			<Tabs.Screen
				name="services"
				options={{
					title: 'Serviços',
					tabBarIcon: ({ color }) => <LayoutGrid color={color} strokeWidth={2} />,
					lazy: false,
				}}
			/>
			<Tabs.Screen
				name="wallet"
				options={{
					title: 'Carteira',
					tabBarIcon: ({ color }) => <Wallet color={color} strokeWidth={2} />,
					lazy: false,
				}}
			/>
			<Tabs.Screen
				name="profile"
				options={{
					title: 'Perfil',
					tabBarIcon: ({ color }) => <User color={color} strokeWidth={2} />,
					lazy: false,
				}}
			/>
		</Tabs>
	)
}
