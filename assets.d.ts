declare module '*.svg' {
	/*   const content: React.FunctionComponent<React.SVGAttributes<SVGElement>>;
    export default content; */
	/*   import SvgProps from 'react-native-svg';
    const content: (props: SvgProps) => JSX.Element;
    export default content; */
	import React from 'react'
	import { SvgProps } from 'react-native-svg'

	const content: React.FC<SvgProps>
	export default content
}

declare module '*.png' {
	const content: number
	export default content
}
