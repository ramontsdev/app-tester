import * as Location from 'expo-location'
import { useMutation } from '@tanstack/react-query'

import { localStorage } from '@/shared/lib/localStorage'
import { LocalStorageKeys } from '@/shared/utils/localStorageKeys'

const locationPermissionKey = ['request-location-permission']

export const useRequestLocationPermission = () => {
	return useMutation({
		mutationKey: locationPermissionKey,
		mutationFn: (value: boolean) => {
			localStorage.setItem(LocalStorageKeys.LOCATION_ENABLE, `${value}`)
			return Location.requestForegroundPermissionsAsync()
		},
		onSuccess: (data) => {
			if (data.status !== 'granted') localStorage.setItem(LocalStorageKeys.LOCATION_ENABLE, 'false')
		},
		onError: () => localStorage.setItem(LocalStorageKeys.LOCATION_ENABLE, 'false'),
	})
}
