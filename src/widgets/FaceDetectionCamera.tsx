import { useCallback, useEffect, useRef, useState } from 'react'
import { ImageBackground, StyleSheet, useWindowDimensions } from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import { Frame, useCameraDevice, Camera as VisionCamera } from 'react-native-vision-camera'
import { Camera, Face, FaceDetectionOptions } from 'react-native-vision-camera-face-detector'
import * as FileSystem from 'expo-file-system'
import { useRouter } from 'expo-router'
import { TrueSheet } from '@lodev09/react-native-true-sheet'
import { useAppState } from '@react-native-community/hooks'
import { useDebounce } from 'use-debounce'

import { useUserProfile } from '@/features/authenticate/useUserProfile'
import { useFaceDectionSizes, useFaceDetectionStore } from '@/features/detectFace/useFaceDetectionFlow'
import { proofOfLifeQueries } from '@/entities/proofOfLife'
import { localStorage } from '@/shared/lib/localStorage'
import { LocalStorageKeys } from '@/shared/utils/localStorageKeys'

type Props = {
	debug?: boolean
}

export function FaceDetectionCamera({ debug = false }: Props) {
	const appState = useAppState()
	const router = useRouter()

	const [shouldCapture, setShouldCapture] = useState(false)
	const [shouldRedirect, setShouldRedirect] = useState(false)
	const [tempCapturedPhoto, setTempCapturedPhoto] = useState<string>('')

	const [debouncedShouldCapture] = useDebounce(shouldCapture, 2000)
	const [debouncedShouldRedirect] = useDebounce(shouldRedirect, 1500)

	const isCameraActive = appState === 'active'

	const { width: screenWidth, height: screenHeight } = useWindowDimensions()
	const { oval } = useFaceDectionSizes()
	const setOverlayVariant = useFaceDetectionStore((state) => state.setOverlayVariant)
	const setTextVariant = useFaceDetectionStore((state) => state.setTextVariant)
	const setIsFaceDetectionLoading = useFaceDetectionStore((state) => state.setIsFaceDetectionLoading)

	const { query: userProfileQuery } = useUserProfile({ enabled: false })
	const {
		data: proofOfLife,
		mutate: getProofOfLifeFromPhoto,
		status: getProofOfLifeFromPhotoStatus,
	} = proofOfLifeQueries.useGetProofOfLifeFromPhotoMutation()

	const faceDetectionOptions = useRef<FaceDetectionOptions>({
		performanceMode: 'fast',
		windowWidth: screenWidth,
		windowHeight: screenHeight,
		autoScale: true,
	}).current

	const cameraDevice = useCameraDevice('front')
	const camera = useRef<VisionCamera>(null)

	const aFaceW = useSharedValue(0)
	const aFaceH = useSharedValue(0)
	const aFaceX = useSharedValue(0)
	const aFaceY = useSharedValue(0)
	const aRot = useSharedValue(0)

	const animatedStyle = useAnimatedStyle(() => ({
		width: withTiming(aFaceW.value, { duration: 100 }),
		height: withTiming(aFaceH.value, { duration: 100 }),
		left: withTiming(aFaceX.value, { duration: 100 }),
		top: withTiming(aFaceY.value, { duration: 100 }),
		transform: [{ rotate: `${aRot.value}deg` }],
	}))

	function handleCameraMountError(error: any) {
		console.error('camera mount error', error)
	}

	function handleFacesDetected(faces: Face[], frame: Frame): void {
		if (Object.keys(faces).length <= 0) {
			setOverlayVariant('idle')
			setTextVariant('idle')
			return
		}

		const { bounds } = faces[0]
		const { width: faceWidth, height: faceHeight, x: faceX, y: faceY } = bounds

		aFaceW.value = faceWidth
		aFaceH.value = faceHeight
		aFaceX.value = faceX
		aFaceY.value = faceY

		const faceBoundTop = faceY
		const faceBoundLeft = faceX
		const faceBoundRight = faceX + faceWidth
		const faceBoundBottom = faceY + faceHeight

		const ovalBoundTop = oval.y
		const ovalBoundLeft = oval.x
		const ovalBoundRight = oval.x + oval.width
		const ovalBoundBottom = oval.y + oval.height

		const isFaceInOval =
			faceBoundLeft >= ovalBoundLeft &&
			faceBoundTop >= ovalBoundTop &&
			faceBoundBottom <= ovalBoundBottom &&
			faceBoundRight <= ovalBoundRight
		const isTooClose = faceHeight > oval.height * 0.75
		const isTooFar = faceHeight < oval.height * 0.7
		const hasAcceptableFaceHeight = faceHeight >= oval.height * 0.7 && faceHeight <= oval.height * 0.75

		if (!debouncedShouldCapture) {
			if (!isFaceInOval) {
				setOverlayVariant('idle')
				setTextVariant('idle')
				setShouldCapture(false)
			} else if (hasAcceptableFaceHeight && isFaceInOval) {
				setOverlayVariant('success')
				setTextVariant('hold')
				setShouldCapture(true)
			} else if (isTooFar && isFaceInOval) {
				setOverlayVariant('idle')
				setTextVariant('too-far')
				setShouldCapture(false)
			} else if (isTooClose) {
				setOverlayVariant('idle')
				setTextVariant('too-close')
				setShouldCapture(false)
			} else {
				setOverlayVariant('idle')
				setTextVariant('idle')
				setShouldCapture(false)
			}
		}
	}

	const takePhoto = useCallback(async () => {
		if (camera.current) {
			const tempPhoto = await camera.current.takePhoto({ enableShutterSound: false })
			setTempCapturedPhoto(tempPhoto.path)
			const tempPhotoBase64 = await FileSystem.readAsStringAsync(`file://${tempPhoto.path}`, { encoding: 'base64' })

			if (!userProfileQuery.data?.preferred_username) {
				setOverlayVariant('error')
				setTextVariant('error')
				return
			}

			setIsFaceDetectionLoading(true)

			getProofOfLifeFromPhoto({
				document: userProfileQuery.data.preferred_username,
				photos: [tempPhotoBase64],
			})
		}
	}, [getProofOfLifeFromPhoto, setIsFaceDetectionLoading, setOverlayVariant, setTextVariant, userProfileQuery])

	useEffect(() => {
		if (getProofOfLifeFromPhotoStatus === 'error') {
			setIsFaceDetectionLoading(false)
			setOverlayVariant('error')
			setTextVariant('error')

			setShouldRedirect(true)
			return
		}

		if (getProofOfLifeFromPhotoStatus === 'success') {
			setIsFaceDetectionLoading(false)
			localStorage.setItem(LocalStorageKeys.PROOF_OF_LIFE_KEY, proofOfLife.key)

			setOverlayVariant('success')
			setTextVariant('success')

			setShouldRedirect(true)
			return
		}
	}, [getProofOfLifeFromPhotoStatus, proofOfLife, setIsFaceDetectionLoading, setOverlayVariant, setTextVariant])

	useEffect(() => {
		if (debouncedShouldCapture && camera.current) {
			takePhoto()
		}
	}, [debouncedShouldCapture, takePhoto])

	useEffect(() => {
		if (debouncedShouldRedirect) {
			router.replace('/profile')
			TrueSheet.present('profile-update-pending')
		}
	}, [debouncedShouldRedirect, router])

	return (
		<>
			{tempCapturedPhoto ? (
				<ImageBackground source={{ uri: 'file://' + tempCapturedPhoto }} style={StyleSheet.absoluteFill} />
			) : (
				<Camera
					photo
					isActive={isCameraActive}
					ref={camera}
					style={StyleSheet.absoluteFill}
					device={cameraDevice!}
					onError={handleCameraMountError}
					faceDetectionCallback={handleFacesDetected}
					faceDetectionOptions={{
						...faceDetectionOptions,
					}}
				/>
			)}

			{debug && (
				<Animated.View
					className="absolute border-4 border-solid border-l-green-500 border-t-red-500 border-r-green-500 border-b-green-500"
					style={animatedStyle}
				/>
			)}
		</>
	)
}
