<template>
	<div class="min-h-screen bg-slate-50 dark:bg-slate-950">
		<AppHeader class="hidden md:block" title="Minha conta" subtitle="" />
		<AppNavbar
			logo-text="MicroLab"
			@search="onSearch"
			@favorites="onFavorites"
			@login="onLogin"
			@cart="onCart"
		/>

		<section class="px-4 py-8 sm:px-6 lg:px-12">
			<div class="mx-auto w-full max-w-7xl space-y-6">
				<ProfileHeroBanner :display-name="displayName" :display-email="displayEmail" :member-since="memberSince" />

				<ProfileAccountCard :display-name="displayName" :display-email="displayEmail" @sign-out="handleSignOut" />

				<div class="space-y-6">
						<div class="grid grid-cols-1 gap-6 md:grid-cols-2 auto-rows-fr">
							<ProfileOrdersCard @go-orders="goToOrders" />

							<ProfileSecurityCard
								:current-password="currentPassword"
								:new-password="newPassword"
								:confirm-new-password="confirmNewPassword"
								:is-password-validated="isPasswordValidated"
								:is-updating-password="isUpdatingPassword"
								:password-message="passwordMessage"
								@update:current-password="currentPassword = $event"
								@update:new-password="newPassword = $event"
								@update:confirm-new-password="confirmNewPassword = $event"
								@validate-password="validateCurrentPassword"
								@update-password="updatePassword"
								@cancel-password="resetPasswordValidation"
							/>
						</div>

					<ProfileAddressManager
						:addresses="addresses"
						:address-message="addressMessage"
						:is-address-form-open="isAddressFormOpen"
						:is-saving-address="isSavingAddress"
						:editing-address-id="editingAddressId"
						:address-form="addressForm"
						@create-address="openCreateAddress"
						@edit-address="openEditAddress"
						@save-address="saveAddress"
						@cancel-address="cancelAddressForm"
						@update:address-form="addressForm = $event"
						@zip-input="handleZipCodeInput"
						@lookup-zip="lookupAddressByZip"
					/>
				</div>
			</div>
		</section>

		<AppFooter />
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import AppHeader from '../components/layout/AppHeader.vue'
import AppNavbar from '../components/layout/AppNavbar.vue'
import AppFooter from '../components/layout/AppFooter.vue'
import ProfileHeroBanner from '../components/profile/ProfileHeroBanner.vue'
import ProfileAccountCard from '../components/profile/ProfileAccountCard.vue'
import ProfileOrdersCard from '../components/profile/ProfileOrdersCard.vue'
import ProfileSecurityCard from '../components/profile/ProfileSecurityCard.vue'
import ProfileAddressManager from '../components/profile/ProfileAddressManager.vue'
import { supabase } from '../lib/supabase'
import { getCurrentAuthUser, getCurrentSession, signInWithEmail, signOutUser, updateCurrentUserPassword } from '../services/auth.service'

type AddressRecord = {
	address_id: number
	user_id: number
	street: string
	number: string
	complement: string | null
	neighborhood: string
	city: string
	state: string
	zip_code: string
	country: string
}

export default defineComponent({
	name: 'PerfilView',
	components: {
		AppHeader,
		AppNavbar,
		AppFooter,
		ProfileHeroBanner,
		ProfileAccountCard,
		ProfileOrdersCard,
		ProfileSecurityCard,
		ProfileAddressManager
	},
	data() {
		return {
			displayName: 'Cliente MicroLab',
			displayEmail: 'seu-email@microlab.com',
			memberSince: 'agora',
			appUserId: null as number | null,
			addresses: [] as AddressRecord[],
			addressMessage: '',
			isAddressFormOpen: false,
			isSavingAddress: false,
			editingAddressId: null as number | null,
			addressForm: {
				street: '',
				number: '',
				complement: '',
				neighborhood: '',
				city: '',
				state: '',
				zip_code: '',
				country: 'Brasil'
			},
			currentPassword: '',
			newPassword: '',
			confirmNewPassword: '',
			isPasswordValidated: false,
			isUpdatingPassword: false,
			passwordMessage: '',
			isLookingUpZip: false,
			lastZipLookup: ''
		}
	},
	async created() {
		const authUser = await getCurrentAuthUser()
		if (authUser?.email) {
			const metadataName = authUser.user_metadata?.name
			this.displayName = typeof metadataName === 'string' && metadataName.trim()
				? metadataName
				: authUser.email.split('@')[0]
			this.displayEmail = authUser.email
			this.memberSince = new Date(authUser.created_at || Date.now()).toLocaleDateString('pt-BR')
			await this.resolveAndLoadAddresses(authUser.id, authUser.email)
		}
	},
	methods: {
		resetAddressForm(): void {
			this.addressForm = {
				street: '',
				number: '',
				complement: '',
				neighborhood: '',
				city: '',
				state: '',
				zip_code: '',
				country: 'Brasil'
			}
			this.editingAddressId = null
			this.lastZipLookup = ''
		},
		openCreateAddress(): void {
			this.addressMessage = ''
			this.resetAddressForm()
			this.isAddressFormOpen = true
		},
		openEditAddress(address: AddressRecord): void {
			this.addressMessage = ''
			this.editingAddressId = address.address_id
			this.addressForm = {
				street: address.street,
				number: address.number,
				complement: address.complement || '',
				neighborhood: address.neighborhood,
				city: address.city,
				state: address.state,
				zip_code: address.zip_code,
				country: address.country
			}
			this.lastZipLookup = address.zip_code.replace(/\D/g, '')
			this.isAddressFormOpen = true
		},
		cancelAddressForm(): void {
			this.isAddressFormOpen = false
			this.resetAddressForm()
		},
		async resolveAndLoadAddresses(authUid: string, email: string): Promise<void> {
			let userId: number | null = null

			const byAuthUid = await supabase
				.from('users')
				.select('user_id')
				.eq('auth_uid', authUid)
				.maybeSingle()

			if (!byAuthUid.error && byAuthUid.data?.user_id) {
				userId = byAuthUid.data.user_id
			}

			if (!userId) {
				const byEmail = await supabase
					.from('users')
					.select('user_id')
					.eq('email', email)
					.maybeSingle()

				if (!byEmail.error && byEmail.data?.user_id) {
					userId = byEmail.data.user_id
				}
			}

			this.appUserId = userId
			await this.loadAddresses()
		},
		async loadAddresses(): Promise<void> {
			if (!this.appUserId) {
				this.addresses = []
				return
			}

			const { data, error } = await supabase
				.from('address')
				.select('*')
				.eq('user_id', this.appUserId)
				.order('address_id', { ascending: false })

			if (error) {
				this.addressMessage = 'Nao foi possivel carregar os enderecos.'
				return
			}

			this.addresses = (data || []) as AddressRecord[]
		},
		async saveAddress(): Promise<void> {
			if (!this.appUserId) {
				this.addressMessage = 'Usuario nao encontrado para salvar endereco.'
				return
			}

			const required = [
				this.addressForm.street,
				this.addressForm.number,
				this.addressForm.neighborhood,
				this.addressForm.city,
				this.addressForm.state,
				this.addressForm.zip_code,
				this.addressForm.country
			]

			if (required.some((value) => !value.trim())) {
				this.addressMessage = 'Preencha todos os campos obrigatorios do endereco.'
				return
			}

			this.isSavingAddress = true
			this.addressMessage = ''

			const payload = {
				user_id: this.appUserId,
				street: this.addressForm.street.trim(),
				number: this.addressForm.number.trim(),
				complement: this.addressForm.complement.trim() || null,
				neighborhood: this.addressForm.neighborhood.trim(),
				city: this.addressForm.city.trim(),
				state: this.addressForm.state.trim(),
				zip_code: this.addressForm.zip_code.trim(),
				country: this.addressForm.country.trim()
			}

			const result = this.editingAddressId
				? await supabase.from('address').update(payload).eq('address_id', this.editingAddressId)
				: await supabase.from('address').insert(payload)

			if (result.error) {
				this.addressMessage = result.error.message
				this.isSavingAddress = false
				return
			}

			this.addressMessage = this.editingAddressId ? 'Endereco atualizado com sucesso.' : 'Endereco adicionado com sucesso.'
			this.isAddressFormOpen = false
			this.resetAddressForm()
			await this.loadAddresses()
			this.isSavingAddress = false
		},
		handleZipCodeInput(): void {
			const normalizedZip = this.addressForm.zip_code.replace(/\D/g, '')
			if (normalizedZip.length === 8) {
				void this.lookupAddressByZip()
			}
		},
		async lookupAddressByZip(force = false): Promise<void> {
			const normalizedZip = this.addressForm.zip_code.replace(/\D/g, '')
			if (normalizedZip.length !== 8) {
				return
			}

			if (!force && this.lastZipLookup === normalizedZip) {
				return
			}

			this.isLookingUpZip = true

			try {
				const response = await fetch(`https://viacep.com.br/ws/${normalizedZip}/json/`)
				if (!response.ok) {
					throw new Error('Falha ao consultar CEP.')
				}

				const data = await response.json() as {
					erro?: boolean
					logradouro?: string
					bairro?: string
					localidade?: string
					uf?: string
					cep?: string
				}

				if (data.erro) {
					throw new Error('CEP nao encontrado.')
				}

				this.addressForm.zip_code = data.cep || this.addressForm.zip_code
				this.addressForm.street = data.logradouro || this.addressForm.street
				this.addressForm.neighborhood = data.bairro || this.addressForm.neighborhood
				this.addressForm.city = data.localidade || this.addressForm.city
				this.addressForm.state = data.uf || this.addressForm.state
				this.lastZipLookup = normalizedZip
				this.addressMessage = 'Endereco preenchido automaticamente pelo CEP.'
			} catch (error) {
				this.addressMessage = error instanceof Error ? error.message : 'Nao foi possivel consultar o CEP.'
			} finally {
				this.isLookingUpZip = false
			}
		},
		async goToOrders(): Promise<void> {
			await this.$router.push({ name: 'my-orders' })
		},
		async updatePassword(): Promise<void> {
			if (!this.newPassword || !this.confirmNewPassword) {
				this.passwordMessage = 'Preencha nova senha e confirmacao.'
				return
			}

			if (this.newPassword.length < 6) {
				this.passwordMessage = 'A senha precisa ter ao menos 6 caracteres.'
				return
			}

			if (this.newPassword !== this.confirmNewPassword) {
				this.passwordMessage = 'As senhas informadas nao conferem.'
				return
			}

			this.isUpdatingPassword = true
			this.passwordMessage = ''

			try {
				await updateCurrentUserPassword(this.newPassword)
				this.passwordMessage = 'Senha alterada com sucesso.'
				this.resetPasswordValidation()
			} catch (error) {
				this.passwordMessage = error instanceof Error ? error.message : 'Nao foi possivel alterar a senha.'
			} finally {
				this.isUpdatingPassword = false
			}
		},
		async validateCurrentPassword(): Promise<void> {
			if (!this.currentPassword) {
				this.passwordMessage = 'Preencha a senha atual.'
				return
			}

			this.isUpdatingPassword = true
			this.passwordMessage = ''

			try {
				const authUser = await getCurrentAuthUser()
				if (!authUser?.email) {
					throw new Error('Nao foi possivel validar a conta atual.')
				}

				await signInWithEmail({
					email: authUser.email,
					password: this.currentPassword
				})

				this.isPasswordValidated = true
				this.passwordMessage = 'Senha validada com sucesso.'
			} catch (error) {
				this.passwordMessage = error instanceof Error ? error.message : 'Senha incorreta.'
			} finally {
				this.isUpdatingPassword = false
			}
		},
		resetPasswordValidation(): void {
			this.isPasswordValidated = false
			this.currentPassword = ''
			this.newPassword = ''
			this.confirmNewPassword = ''
			this.passwordMessage = ''
		},
		onSearch(searchTerm: string): void {
			console.log('search', searchTerm)
		},
		async onFavorites(): Promise<void> {
			const session = await getCurrentSession()
			if (!session) {
				await this.$router.push({ name: 'sign-in', query: { redirect: '/favoritos' } })
				return
			}

			await this.$router.push({ name: 'favorites' })
		},
		async onLogin(): Promise<void> {
			const session = await getCurrentSession()
			if (session) {
				await this.$router.push({ name: 'perfil' })
				return
			}

			await this.$router.push({ name: 'sign-in' })
		},
		async onCart(): Promise<void> {
			const session = await getCurrentSession()
			if (!session) {
				await this.$router.push({ name: 'sign-in', query: { redirect: '/cart' } })
				return
			}

			await this.$router.push({ name: 'cart' })
		},
		async handleSignOut(): Promise<void> {
			await signOutUser()
			await this.$router.push({ name: 'sign-in' })
		}
	}
})
</script>
