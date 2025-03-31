import { ScrollView, View } from 'react-native'
import { Stack } from 'expo-router'

import { Departments } from '@/widgets/Departments'
import { MemoizedFavoriteServices } from '@/widgets/FavoriteServices'
import { SearchServicesInput } from '@/widgets/SearchServicesInput'
import { ServiceByCategory } from '@/widgets/ServiceByCategory'
import { ServicesNeedToday } from '@/widgets/ServicesNeedToday'

export default function Services() {
	return (
		<>
			<Stack.Screen options={{ title: 'Serviços' }} />

			<ScrollView keyboardShouldPersistTaps="handled" contentContainerClassName="gap-y-8">
				<View className="px-4 mt-8">
					<SearchServicesInput />
				</View>

				<MemoizedFavoriteServices />

				<ServicesNeedToday />

				<ServiceByCategory />

				<Departments />
			</ScrollView>
		</>
	)
}
