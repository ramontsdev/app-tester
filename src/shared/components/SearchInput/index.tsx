import React, { useCallback, useRef, useState } from 'react'
import { Keyboard, Modal, Platform, Pressable, TextInput, TextInputProps, TouchableOpacity, View } from 'react-native'
import { Search, XCircle } from 'lucide-react-native'
import { useFocusEffect } from '@react-navigation/native'

import { defaultTheme } from '@/app/styles/theme'

import { Text } from '../Text'
import { Input } from './Input'

type SearchInputProps = {
	inputProps: TextInputProps
	suggestItens: React.ReactNode
	inputValue?: string
	onClear?: () => void
}

export function SearchInput({ inputProps, suggestItens, inputValue, onClear }: SearchInputProps) {
	const [showModal, setShowModal] = useState(false)
	const DropdownButton = useRef<View>(null)
	const inputRef = useRef<TextInput>(null)
	const inputDropRef = useRef<TextInput>(null)

	const [dropdownStyles, setDropdownStyles] = useState({
		top: 0,
		width: 0,
		left: 0,
		height: 0,
	})

	const measureDropdown = useCallback(() => {
		DropdownButton.current?.measure((_fx, _fy, width, height, left, top) => {
			setDropdownStyles({ top, width, left, height })
		})
	}, [])

	function toggleDropdown() {
		setShowModal((prev) => !prev)
		Keyboard.dismiss()
		if (!showModal) {
			measureDropdown()
			inputRef.current?.blur()
		}
	}

	useFocusEffect(
		useCallback(() => {
			measureDropdown()
			return () => setShowModal(false)
		}, [measureDropdown]),
	)

	return (
		<>
			<Modal
				visible={showModal}
				transparent
				animationType="none"
				statusBarTranslucent
				onShow={() => {
					const timeout = setTimeout(() => {
						inputDropRef.current?.blur()
						inputDropRef.current?.focus()
					}, 50)
					return () => clearTimeout(timeout)
				}}
			>
				<TouchableOpacity onPress={toggleDropdown} className="w-full h-full absolute bg-zinc-900/20" />
				<View
					className="flex-row items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 bg-white"
					style={dropdownStyles}
				>
					<Search color={defaultTheme.colors.primary.default} />
					<Input
						ref={inputDropRef}
						autoFocus={Platform.OS === 'android'}
						placeholder="Busque por um serviço"
						className="flex-1 text-lg leading-tight"
						placeholderTextColor={defaultTheme.colors.gray[400]}
						{...inputProps}
					/>

					{inputValue && (
						<TouchableOpacity onPress={onClear} className="p-2">
							<XCircle color={defaultTheme.colors.primary.default} />
						</TouchableOpacity>
					)}
				</View>
				<View
					className="rounded-b-lg border border-zinc-200 bg-white pt-4 px-4"
					style={{ top: dropdownStyles.top, width: dropdownStyles.width, left: dropdownStyles.left }}
				>
					{suggestItens}
				</View>
			</Modal>

			<View
				ref={DropdownButton}
				onLayout={measureDropdown}
				className="flex-row items-center gap-2 px-4 rounded-lg border border-slate-200 bg-white"
			>
				<Search color={defaultTheme.colors.primary.default} />
				<Pressable ref={inputRef} className="flex-1 justify-center h-12" onPress={toggleDropdown}>
					<Text className="text-gray-600 text-lg">{inputValue?.length ? inputValue : 'Busque por um serviço'}</Text>
				</Pressable>

				{inputValue && (
					<TouchableOpacity onPress={onClear} className="p-2">
						<XCircle color={defaultTheme.colors.primary.default} />
					</TouchableOpacity>
				)}
			</View>
		</>
	)
}
