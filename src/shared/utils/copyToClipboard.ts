import * as Clipboard from 'expo-clipboard'

export default async function copyToClipboard(data: string) {
	await Clipboard.setStringAsync(data)
}
