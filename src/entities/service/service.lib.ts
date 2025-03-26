import { parse as parseHtml } from 'fast-html-parser'

import { ParsedHtmlResult } from '@/entities/service/service.model'

enum Tags {
	Paragraph = 'p',
	UnorderedList = 'ul',
}

export function parseHtmlFromService(html: string): ParsedHtmlResult {
	const root = parseHtml(html)

	return root.childNodes
		.map((childNode) => {
			if (childNode.tagName === Tags.Paragraph) {
				return { type: 'paragraph', text: childNode.text } as const
			}

			if (childNode.tagName === Tags.UnorderedList) {
				return {
					type: 'unordered-list',
					items: childNode
						.querySelectorAll('li')
						.map((itemElement) => itemElement.text)
						.filter(Boolean),
				} as const
			}
		})
		.filter((item) => Boolean(item?.text) || Boolean(item?.items?.length))
		.filter(Boolean)
}

export function convertParsedHtmlToString(parsedHtml: ParsedHtmlResult): string {
	return parsedHtml
		.map((item) => {
			if (item.type === 'paragraph') {
				return `<p>${item.text}</p>`
			}
			if (item.type === 'unordered-list') {
				const listItems = item.items.map((li) => `<li>${li}</li>`).join('')
				return `<ul>${listItems}</ul>`
			}
			return ''
		})
		.join('')
}
