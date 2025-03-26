import { Platform, TouchableOpacity } from 'react-native'
import { Share2 } from 'lucide-react-native'

import { useDownloadAndShare } from '@/features/downloadAndShare/useDownloadAndShare'
import { cn } from '@/shared/utils/cn'

type ShareButtonProps = {
	className?: string
	url: string
	fileName: string
}

export function ShareButton({ url, fileName, className = '' }: ShareButtonProps) {
	const { mutate: downloadAndShare, isPending: downloadAndShareIsPedding } = useDownloadAndShare()

	const androidBoxShadow = {
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 2,
	}

	const isIos = Platform.OS === 'ios'

	return (
		<TouchableOpacity
			className={cn(
				'bg-success-default w-12 h-12 rounded-full justify-center items-center',
				isIos && 'shadow-lg',
				className,
			)}
			onPress={() =>
				downloadAndShare({
					url,
					filename: fileName,
					showShareDialog: true,
				})
			}
			style={androidBoxShadow}
			disabled={downloadAndShareIsPedding}
		>
			<Share2 color="white" size={15} />
		</TouchableOpacity>
	)
}
