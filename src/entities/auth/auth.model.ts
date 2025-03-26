import * as v from 'valibot'

export const tokenSchema = v.object({
	access_token: v.string(),
	expires_in: v.number(),
	id_token: v.string(),
	refresh_expires_in: v.number(),
	refresh_token: v.string(),
	scope: v.string(),
	session_state: v.string(),
	token_type: v.string(),
	'not-before-policy': v.number(),
})

export const profileSchema = v.object({
	piid: v.optional(v.string()),
	sub: v.string(),
	email_verified: v.boolean(),
	roles: v.array(v.string()),
	groups: v.array(v.any()),
	preferred_username: v.string(),
	given_name: v.string(),
	picture: v.optional(v.string()),
	name: v.string(),
	pidigital: v.optional(v.string()),
	dataNascimento: v.string(),
	cartao_fazendario_confirmacao: v.optional(v.boolean()),
	family_name: v.string(),
	catalog_favorite: v.string(),
	email: v.string(),
	nomeMae: v.string(),
	nomeCompleto: v.string(),
})

export const serviceTokenSchema = v.object({
	access_token: v.string(),
	expires_in: v.number(),
	'not-before-policy': v.number(),
	refresh_expires_in: v.number(),
	scope: v.string(),
	token_type: v.string(),
})

export const tokenIntrospectionSchema = v.pipe(
	v.object({
		permissions: v.optional(
			v.array(
				v.object({
					resource_id: v.string(),
					resource_name: v.string(),
				}),
			),
		),
		exp: v.optional(v.number()),
		nbf: v.optional(v.number()),
		iat: v.optional(v.number()),
		aud: v.optional(v.string()),
		active: v.boolean(),
	}),
	v.transform((input) => {
		if (input.active === true) return { active: true } as const

		return { active: false } as const
	}),
)
