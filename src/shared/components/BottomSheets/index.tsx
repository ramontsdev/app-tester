import { AddDigitalDocumentFailBottomSheet } from '@/shared/components/BottomSheets/AddDigitalDocumentFailBottomSheet'
import { AddDigitalDocumentSuccessBottomSheet } from '@/shared/components/BottomSheets/AddDigitalDocumentSuccessBottomSheet'
import { ConfirmRemoveDigitalDocumentBottomSheet } from '@/shared/components/BottomSheets/ConfirmRemoveDigitalDocumentBottomSheet'
import { FileDownloadFaliureBottomSheet } from '@/shared/components/BottomSheets/FileDownloadFaliureBottomSheet'
import { LoginFailBottomSheet } from '@/shared/components/BottomSheets/LoginFailBottomSheet'
import { ProfileUpdateFailBottomSheet } from '@/shared/components/BottomSheets/ProfileUpdateFailBottomSheet'
import { ProfileUpdatePendingBottomSheet } from '@/shared/components/BottomSheets/ProfileUpdatePendingBottomSheet'
import { ProfileUpdateSuccessBottomSheet } from '@/shared/components/BottomSheets/ProfileUpdateSuccessBottomSheet'
import { SessionExpiredBottomSheet } from '@/shared/components/BottomSheets/SessionExpiredBottomSheet'

import { EnableNotificationsBottomSheet } from './EnableNotificationBottomSheet'
import { FavoriteErrorBottomSheet } from './FavoriteErrorBottomSheet'
import { FavoriteSuccessBottomSheet } from './FavoriteSuccessBottomSheet'

export { FavoriteSuccessBottomSheet } from './FavoriteSuccessBottomSheet'
export { FavoriteErrorBottomSheet } from './FavoriteErrorBottomSheet'

export default function BottomSheets() {
	return (
		<>
			<AddDigitalDocumentFailBottomSheet />
			<AddDigitalDocumentSuccessBottomSheet />
			<ConfirmRemoveDigitalDocumentBottomSheet />
			<SessionExpiredBottomSheet />
			<FileDownloadFaliureBottomSheet />
			<ProfileUpdateFailBottomSheet />
			<ProfileUpdatePendingBottomSheet />
			<ProfileUpdateSuccessBottomSheet />
			<LoginFailBottomSheet />
			<FavoriteErrorBottomSheet />
			<FavoriteSuccessBottomSheet />
			<EnableNotificationsBottomSheet />
		</>
	)
}
