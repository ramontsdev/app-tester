import { ActivityIndicator, View } from 'react-native'
import { useRouter } from 'expo-router'

import { defaultTheme } from '@/app/styles/theme'
import { departmentQueries } from '@/entities/department'
import { SectionTitle } from '@/shared/components/SectionTitle'
import { DepartmentCard } from '@/shared/components/services/DepartmentCard'
import { TypesOfSearch } from '@/shared/utils/typesOfSearch'

export function Departments() {
	const {
		data: departmentData,
		isLoading: departmentIsLoading,
		error: departmentError,
	} = departmentQueries.useDepartmentQuery()

	const router = useRouter()

	if (!departmentData?.success) return null

	return (
		<View className="gap-4 px-4">
			<View className="flex flex-row justify-between items-center">
				<SectionTitle>Serviços por Órgão</SectionTitle>
			</View>

			{departmentIsLoading && (
				<View className="flex-1 justify-center items-center">
					<ActivityIndicator size="large" color={defaultTheme.colors.primary.default} />
				</View>
			)}

			<View className="flex-row flex-wrap mb-8 gap-3">
				{departmentData.data
					.filter((departament) => departament.active === true)
					.map((department) => (
						<DepartmentCard
							key={department.slug}
							title={department.shortName}
							icon=""
							handleRedirect={() => {
								router.push({
									pathname: '/services/search',
									params: {
										slug: department.slug,
										searchType: TypesOfSearch.DEPARTMENT,
										badgeValue: department.shortName,
									},
								})
							}}
							className="min-w-[48%]"
						/>
					))}
			</View>
		</View>
	)
}
