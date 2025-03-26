import { useMutation, useQueryClient } from '@tanstack/react-query'
import * as favoriteApi from './favorite.api'
import { Favorite } from './favorite.model'
import { accessToken } from '@/shared/lib/localToken'

export function useSetFavorite() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: Favorite) => {
      const token = accessToken.get()

      if (!token) {
        throw new Error('No authentication token found')
      }

      return favoriteApi.setFavorites(token, data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] })
    },
  })
}
