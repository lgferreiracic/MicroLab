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
				<div class="relative overflow-hidden rounded-2xl bg-linear-to-r from-brand-primary via-brand-secondary to-brand-tertiary p-6 text-white shadow-lg sm:p-8">
					<div class="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10"></div>
					<div class="pointer-events-none absolute -bottom-16 right-12 h-32 w-32 rounded-full bg-white/10"></div>

					<p class="m-0 text-xs font-semibold uppercase tracking-[0.2em] text-white/85">Area do cliente</p>
					<h1 class="m-0 mt-2 text-2xl font-semibold sm:text-3xl">{{ displayName }}</h1>
					<p class="m-0 mt-2 text-sm text-white/90">{{ displayEmail }}</p>

					<div class="mt-5 flex flex-wrap gap-2">
						<span class="rounded-full bg-white/15 px-3 py-1 text-xs font-medium">Conta ativa</span>
						<span class="rounded-full bg-white/15 px-3 py-1 text-xs font-medium">Membro desde {{ memberSince }}</span>
					</div>
				</div>

				<div class="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
						<div class="flex items-start justify-between gap-4">
							<div class="flex-1">
								<h2 class="m-0 text-lg font-semibold text-slate-800 dark:text-slate-100">Dados da conta</h2>
								<div class="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
									<div class="rounded-lg bg-slate-50 p-3 dark:bg-slate-800/60">
										<p class="m-0 text-xs text-slate-500 dark:text-slate-400">Nome</p>
										<p class="m-0 mt-1 text-sm font-medium text-slate-800 dark:text-slate-100">{{ displayName }}</p>
									</div>
									<div class="rounded-lg bg-slate-50 p-3 dark:bg-slate-800/60">
										<p class="m-0 text-xs text-slate-500 dark:text-slate-400">E-mail</p>
										<p class="m-0 mt-1 text-sm font-medium text-slate-800 dark:text-slate-100">{{ displayEmail }}</p>
									</div>
								</div>
							</div>
							<button
								type="button"
								class="mt-0 h-10 rounded-lg bg-red-600 px-4 text-sm font-semibold text-white transition hover:bg-red-700"
								@click="handleSignOut"
							>
								Sair
							</button>
						</div>
				</div>

				<div class="space-y-6">
						<div class="grid grid-cols-1 gap-6 md:grid-cols-2 auto-rows-fr">
							<div class="flex flex-col rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
								<div>
									<h2 class="m-0 text-lg font-semibold text-slate-800 dark:text-slate-100">Meus pedidos</h2>
									<p class="m-0 mt-2 text-sm text-slate-600 dark:text-slate-300">Acompanhe status e historico de compras em uma tela dedicada.</p>
								</div>
								<div class="flex-1"></div>
								<button
									type="button"
									class="mt-4 h-10 w-fit rounded-lg bg-brand-primary px-6 text-sm font-semibold text-white transition hover:bg-brand-secondary"
									@click="goToOrders"
								>
									Ver meus pedidos
								</button>
							</div>

							<div class="flex flex-col rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
								<div>
									<h2 class="m-0 text-lg font-semibold text-slate-800 dark:text-slate-100">Seguranca</h2>
									<p class="m-0 mt-2 text-sm text-slate-600 dark:text-slate-300">Altere sua senha da conta.</p>

									<div class="mt-4 space-y-2">
										<input v-model="currentPassword" type="password" placeholder="Senha atual" class="h-10 w-full rounded-lg border border-slate-300 px-3 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100" />

										<div v-if="isPasswordValidated" class="space-y-2">
											<input v-model="newPassword" type="password" placeholder="Nova senha" class="h-10 w-full rounded-lg border border-slate-300 px-3 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100" />
											<input v-model="confirmNewPassword" type="password" placeholder="Confirmar nova senha" class="h-10 w-full rounded-lg border border-slate-300 px-3 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100" />
										</div>
									</div>

									<p v-if="passwordMessage" class="m-0 mt-2 text-sm text-brand-primary">{{ passwordMessage }}</p>
								</div>

								<div class="mt-4 space-y-2">
									<button
										type="button"
										:disabled="isUpdatingPassword || !currentPassword"
										class="h-10 w-fit rounded-lg px-6 text-sm font-semibold text-white transition"
										:class="isPasswordValidated ? 'bg-brand-primary hover:bg-brand-secondary' : 'bg-slate-500 hover:bg-slate-600'"
										@click="isPasswordValidated ? updatePassword : validateCurrentPassword"
									>
										{{ isUpdatingPassword ? 'Processando...' : (isPasswordValidated ? 'Alterar senha' : 'Validar senha') }}
									</button>

									<button
										v-if="isPasswordValidated"
										type="button"
										class="h-10 w-fit rounded-lg bg-slate-200 px-6 text-sm font-semibold text-slate-700 transition hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600"
										@click="resetPasswordValidation"
									>
										Cancelar
									</button>
								</div>
							</div>
						</div>

					<div class="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
							<div class="flex items-center justify-between gap-3">
								<h2 class="m-0 text-lg font-semibold text-slate-800 dark:text-slate-100">Meus enderecos</h2>
								<button
									type="button"
									class="h-9 rounded-lg bg-brand-primary px-3 text-sm font-semibold text-white transition hover:bg-brand-secondary"
									@click="openCreateAddress"
								>
									Adicionar endereco
								</button>
							</div>

							<p v-if="addressMessage" class="m-0 mt-3 text-sm text-brand-primary">{{ addressMessage }}</p>

							<div class="mt-4 space-y-3">
								<div
									v-for="address in addresses"
									:key="address.address_id"
									class="rounded-lg border border-slate-200 p-3 dark:border-slate-700"
								>
									<div class="flex items-start justify-between gap-3">
										<div class="text-sm text-slate-700 dark:text-slate-200">
											<p class="m-0 font-semibold">{{ address.street }}, {{ address.number }}</p>
											<p class="m-0 mt-1">{{ address.neighborhood }} - {{ address.city }}/{{ address.state }}</p>
											<p class="m-0 mt-1">CEP {{ address.zip_code }} - {{ address.country }}</p>
											<p v-if="address.complement" class="m-0 mt-1 text-slate-500 dark:text-slate-400">Comp.: {{ address.complement }}</p>
										</div>
										<button
											type="button"
											class="rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
											@click="openEditAddress(address)"
										>
											Editar
										</button>
									</div>
								</div>

								<p v-if="!addresses.length" class="m-0 rounded-lg bg-slate-50 p-3 text-sm text-slate-600 dark:bg-slate-800/60 dark:text-slate-300">
									Voce ainda nao cadastrou enderecos.
								</p>
							</div>

							<div v-if="isAddressFormOpen" class="mt-4 rounded-lg border border-brand-tertiary/40 bg-slate-50 p-4 dark:border-brand-tertiary/30 dark:bg-slate-800/60">
								<h3 class="m-0 text-sm font-semibold text-slate-800 dark:text-slate-100">
									{{ editingAddressId ? 'Editar endereco' : 'Novo endereco' }}
								</h3>

								<div class="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
									<input
										v-model="addressForm.zip_code"
										type="text"
										placeholder="CEP"
										class="h-10 rounded-lg border border-slate-300 px-3 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 sm:col-span-2"
										@input="handleZipCodeInput"
										@blur="lookupAddressByZip(true)"
										@keyup.enter="lookupAddressByZip(true)"
									/>
									<input v-model="addressForm.street" type="text" placeholder="Rua" class="h-10 rounded-lg border border-slate-300 px-3 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100" />
									<input v-model="addressForm.number" type="text" placeholder="Numero" class="h-10 rounded-lg border border-slate-300 px-3 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100" />
									<input v-model="addressForm.complement" type="text" placeholder="Complemento" class="h-10 rounded-lg border border-slate-300 px-3 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100" />
									<input v-model="addressForm.neighborhood" type="text" placeholder="Bairro" class="h-10 rounded-lg border border-slate-300 px-3 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100" />
									<input v-model="addressForm.city" type="text" placeholder="Cidade" class="h-10 rounded-lg border border-slate-300 px-3 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100" />
									<input v-model="addressForm.state" type="text" placeholder="Estado" class="h-10 rounded-lg border border-slate-300 px-3 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100" />
								</div>

								<div class="mt-3 flex gap-2">
									<button type="button" :disabled="isSavingAddress" class="h-9 rounded-lg bg-brand-primary px-3 text-sm font-semibold text-white transition hover:bg-brand-secondary" @click="saveAddress">
										{{ isSavingAddress ? 'Salvando...' : 'Salvar endereco' }}
									</button>
									<button type="button" class="h-9 rounded-lg bg-slate-200 px-3 text-sm font-medium text-slate-700 transition hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600" @click="cancelAddressForm">
										Cancelar
									</button>
								</div>
							</div>
						</div>
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
		AppFooter
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
