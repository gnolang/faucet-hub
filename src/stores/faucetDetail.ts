import { defineStore, storeToRefs, PiniaPluginContext } from 'pinia'
import { gsap } from 'gsap'
import { CustomEase } from 'gsap/CustomEase'
import { CSSPlugin } from 'gsap/CSSPlugin'
import { RequestStatus, Faucet } from '@/types'
import { watch, nextTick } from 'vue'
import { useFaucetApi } from '@/composables/useFaucetApi'
import { convertToUgnot } from '@/utils/amount'

// Register GSAP plugins
gsap.registerPlugin(CustomEase, CSSPlugin)

const STORAGE_KEY = 'last-selected-faucet'
const MIN_LOADING_TIME = 2000 // 2 seconds minimum loading time for UI animations

export const useFaucetDetail = defineStore('faucetDetail', {
  state: () => ({
    DOM: {
      bg: null as HTMLElement | null,
      popup: null as HTMLElement | null,
      cards: [] as HTMLElement[],
      title: null as HTMLElement | null,
      gnoRequestLogo: null as HTMLElement | null,
      faucetRequest: null as HTMLElement | null,
    },
    isOpen: false,
    isVisible: false,
    animationPending: false,
    contentStep: 0,
    status: 'null' as RequestStatus,
    selectedFaucet: JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') as Faucet,
    error: null as string | null,
    popupHeight: {
      from: 0,
      to: 0,
    },
    TLPending: null as gsap.core.Timeline | null,
    availableRewards: 0,
    prefilledAddress: '',
    prefilledAmount: 0,
  }),
  getters: {
    faucetAmount: (state) =>
      state.selectedFaucet.amounts?.map((amount: number) => ({
        content: `${amount} ${state.selectedFaucet?.token ?? '$GNOT'}`,
        value: amount,
      })) ?? [{ content: '', value: 0 }],
  },
  actions: {
    cardDisplay() {
      gsap.to(this.DOM.cards, {
        x: 0,
        autoAlpha: 1,
        stagger: 0.1,
        ease: CustomEase.create('custom', 'M0,0 C0.331,1.606 0.516,0.948 1,1 '),
        duration: 0.8,
      })
    },

    titleToggle() {
      const words = this.DOM.title?.querySelectorAll('.word > span')
      if (words)
        gsap.to(words, {
          y: this.isOpen ? 75 : 0,
          autoAlpha: this.isOpen ? 0 : 1,
          stagger: { amount: this.isOpen ? 0.001 : 0.4 },
          ease: 'power3.out',
          duration: 1.4,
        })
    },

    popupToggle() {
      if (this.animationPending || this.status === 'pending') return
      this.animationPending = true
      this.isOpen = !this.isOpen
      if (this.isOpen) {
        this.isVisible = true
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.selectedFaucet))
      } else {
        this.availableRewards = 0
        this.prefilledAddress = ''
        this.prefilledAmount = 0
        this.status = 'null'
        this.error = null
      }

      this.titleToggle()

      gsap.to('.js-main', {
        scale: this.isOpen ? 0.9 : 1,
        ease: 'power3.out',
        duration: 0.8,
      })

      gsap.to('.js-card', {
        'clip-path': this.isOpen ? 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)' : 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
        duration: 0.6,
        stagger: {
          amount: 0.15,
        },
      })

      gsap.to(this.DOM.popup, {
        top: this.isOpen ? '50%' : '45%',
        autoAlpha: this.isOpen ? 1 : 0,
        'clip-path': this.isOpen ? 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)' : 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)',
        duration: 0.6,
        delay: this.isOpen ? 0.4 : 0,
      })
      gsap.to(this.DOM.bg, {
        autoAlpha: this.isOpen ? 1 : 0,
        duration: 1,
        delay: this.isOpen ? 0 : 0.4,
        onComplete: () => {
          if (!this.isOpen) {
            this.contentStep = 0
            this.isVisible = false
            this.cleanupPendingAnimation()
          }
          this.status = 'null'
          this.animationPending = false
        },
      })
    },

    initializeFromGithub() {
      this.isVisible = true
      this.isOpen = true
      this.status = 'pending'
      this.contentStep = 1

      // Apply initial styles without animation
      if (this.DOM.popup && this.DOM.bg) {
        // Initial popup setup
        gsap.set('.popup', {
          autoAlpha: 1,
          top: '50%',
          'clip-path': 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
        })

        gsap.set(this.DOM.bg, {
          autoAlpha: 1,
          visibility: 'visible',
        })
        gsap.set('.js-main', { scale: 0.9 })

        gsap.set('.js-faucetform', { autoAlpha: 0 })
        gsap.set('.js-faucetpending', { autoAlpha: 1 })

        if (this.DOM.gnoRequestLogo) {
          gsap.to(this.DOM.gnoRequestLogo, { autoAlpha: 1, delay: 0.5 })
        }

        // Setup the pending animation
        this.setupPendingAnimation()
        this.toggleLoader(true)

        // Verify GitHub code after initialization
        nextTick(() => {
          this.verifyGithubCode()
        })
      }
    },

    async handleRequestAnimation() {
      // Prevent multiple animations from running simultaneously
      if (this.status === 'pending' || this.animationPending) {
        return
      }

      this.animationPending = true

      // Save current height for smooth animation
      if (this.DOM.popup && this.DOM.faucetRequest) {
        this.popupHeight.from = this.DOM.popup.getBoundingClientRect().height
        gsap.set(this.DOM.popup, { height: this.popupHeight.from + 'px' })
      }

      // Fade out form and show loading animation
      await gsap.to('.js-faucetform', {
        autoAlpha: 0,
        duration: 0.5,
      })

      this.status = 'pending'
      this.contentStep = 1

      if (this.DOM.gnoRequestLogo) {
        gsap.to(this.DOM.gnoRequestLogo, { autoAlpha: 1, delay: 0.2 })
      }

      // Setup the pending animation
      this.setupPendingAnimation()
      this.toggleLoader(true)

      this.animationPending = false
    },

    async handleRequestSuccess() {
      this.status = 'success'
      this.contentStep = 2
      gsap.to('.js-faucetsuccess', { autoAlpha: 1 })

      // Cleanup sensitive data
      localStorage.removeItem('address')
      localStorage.removeItem('faucet-value')
      localStorage.removeItem('faucet-url')
      localStorage.removeItem('last-code')
    },

    async handleRequestError(errorMessage: string) {
      this.status = 'error'
      this.error = errorMessage
      console.error(errorMessage)
    },

    async ensureMinLoadingTime<T>(promise: Promise<T>): Promise<T> {
      const minTimer = new Promise((resolve) => setTimeout(resolve, MIN_LOADING_TIME))
      try {
        const result = await promise
        await minTimer // Ensure minimum loading time for UI
        return result
      } catch (e) {
        await minTimer // Ensure minimum loading time for UI
        throw e
      }
    },

    async requestWithCaptcha(address: string, amount?: number, captchaSecret?: string) {
      await this.handleRequestAnimation()

      try {
        const { requestFaucet } = useFaucetApi()
        await this.ensureMinLoadingTime(
          requestFaucet(this.selectedFaucet, {
            address,
            amount: amount ? convertToUgnot(amount) : undefined,
            captchaSecret,
          })
        )
        await this.handleRequestSuccess()
      } catch (e) {
        await this.handleRequestError(e instanceof Error ? e.message : String(e))
      }
    },

    async requestWithGithub(address: string, amount?: number) {
      await this.handleRequestAnimation()

      // Save data for when we return from GitHub
      localStorage.setItem('address', address)
      localStorage.setItem('faucet-value', amount?.toString() ?? '')
      localStorage.setItem('faucet-url', this.selectedFaucet.url)

      // Redirect to GitHub OAuth
      const params = new URLSearchParams({
        client_id: this.selectedFaucet.github_oauth_client_id!,
        redirect_uri: window.location.origin,
        scope: 'read:user',
      })

      window.location.href = `https://github.com/login/oauth/authorize?${params}`
    },

    async verifyGithubCode() {
      const storage = {
        address: localStorage.getItem('address'),
        value: localStorage.getItem('faucet-value'),
        url: localStorage.getItem('faucet-url'),
        lastUsedCode: localStorage.getItem('last-code'),
      }

      const params = new URLSearchParams(window.location.search)
      const code = params.get('code')

      // Clean up URL parameters
      window.history.replaceState({}, document.title, window.location.pathname)

      // Validation checks
      const validations: Record<string, [boolean, string]> = {
        address: [!!storage.address, 'Missing address in storage'],
        code: [!!code, 'No GitHub code provided'],
        value: [!!storage.value, 'Missing amount value in storage'],
        url: [!!storage.url, 'Missing API URL in storage'],
        uniqueCode: [storage.lastUsedCode !== code, 'This GitHub code has already been used'],
      }

      const failedCheck = Object.entries(validations).find(([_, [isValid]]) => !isValid)
      if (failedCheck) {
        await this.handleRequestError(failedCheck[1][1])
        return
      }

      localStorage.setItem('last-code', code!)

      try {
        const { requestFaucet, checkClaim } = useFaucetApi()
    
        const claimResult = await checkClaim(this.selectedFaucet, {
          address: storage.address!,
          githubCode: code!,
        })
        
        const availableRewards = claimResult || 0
        
        if (availableRewards > 0) {
          console.log("Available rewards found, returning to form")
          this.availableRewards = availableRewards
          this.status = 'null'
          this.contentStep = 0
          this.isOpen = true
          this.isVisible = true
          

          this.toggleLoader(false)
          this.cleanupPendingAnimation()
          

          gsap.set('.js-faucetform', { autoAlpha: 1 })
          gsap.set('.js-faucetpending', { autoAlpha: 0 })
          gsap.set('.js-faucetsuccess', { autoAlpha: 0 })
          

          this.prefilledAddress = storage.address!
          this.prefilledAmount = parseInt(storage.value!, 10)
          
        } else {
          console.log("No rewards available, continuing with automatic drip")
          console.log(storage.address!)
          console.log(storage.value!)
          console.log('Code from URL:', code!)
          await this.ensureMinLoadingTime(
            requestFaucet(this.selectedFaucet, {
              address: storage.address!,
              amount: convertToUgnot(parseInt(storage.value!, 10)),
              githubCode: code!,
            })
          )
          await this.handleRequestSuccess()
         }
      } catch (e) {
        console.log("Error caught in verifyGithubCode:", e)
        await this.handleRequestError(e instanceof Error ? e.message : String(e))
      }
    },

    setupPendingAnimation() {
      // Kill any existing timeline first
      if (this.TLPending) {
        this.TLPending.kill()
        this.TLPending = null
      }

      this.TLPending = gsap
        .timeline({ repeat: -1, paused: true })
        .fromTo('.popup', { '--mx': '0%' }, { '--mx': '100%', duration: 0.8, ease: 'none' })
        .fromTo('.popup', { '--my': '100%' }, { '--my': '0%', duration: 0.8, ease: 'none' })
        .fromTo('.popup', { '--mx': '100%' }, { '--mx': '0%', duration: 0.8, ease: 'none' })
        .to('.popup', { '--my': '100%', duration: 0.8, ease: 'none' })
    },

    cleanupPendingAnimation() {
      if (this.TLPending) {
        this.TLPending.kill()
        this.TLPending = null
      }
    },

    toggleLoader(state: boolean) {
      gsap.to('.popup', {
        '--op': state ? 1 : 0,
        onComplete: () => {
          !state && this.TLPending && this.TLPending.pause()
        },
      })
      state && this.TLPending && this.TLPending.play()
    },

    setPopupHeight() {
      this.popupHeight.to = this.DOM.faucetRequest?.getBoundingClientRect().height ?? 0
      gsap.to(this.DOM.popup, { height: this.popupHeight.to + 'px', duration: 0.4 })
    },

    handleStatusChange(value: RequestStatus) {
      if (value === 'null') {
        gsap.set('.js-faucetform', { autoAlpha: 1 })
        gsap.set('.js-faucetpending', { autoAlpha: 1 })
        gsap.set('.js-faucetsuccess', { autoAlpha: 0 })
        gsap.set('.js-faucetsuccessdetail', { height: 0 })
        gsap.set(this.DOM.popup, { height: 'auto' })

        this.error = null
        return
      }
      nextTick(() => {
        switch (value) {
          case 'pending':
            this.setupPendingAnimation()
            this.toggleLoader(true)
            this.setPopupHeight()
            break

          case 'error':
            this.toggleLoader(false)
            this.setPopupHeight()
            this.cleanupPendingAnimation()

            gsap.to('.js-faucetpending', {
              autoAlpha: 0,
              duration: 0.6,
              onComplete: () => {
                this.contentStep = 0
                this.popupHeight.from = this.popupHeight.to
                gsap.set(this.DOM.popup, { height: 'auto' })

                gsap.to('.js-faucetform', {
                  autoAlpha: 1,
                  duration: 0.5,
                })
                gsap.set('.js-faucetpending', { autoAlpha: 1 })
              },
            })
            break

          case 'success':
            this.toggleLoader(false)
            this.cleanupPendingAnimation()

            gsap.to('.js-faucetpending', {
              autoAlpha: 0,
              duration: 0.6,
              onComplete: () => {
                this.contentStep = 2
                this.popupHeight.from = this.popupHeight.to
                gsap.set(this.DOM.popup, { height: 'auto' })

                gsap.to('.js-faucetsuccess', {
                  autoAlpha: 1,
                  duration: 0.6,
                })

                gsap.to('.js-faucetsuccessdetail', {
                  height: 'auto',
                  autoAlpha: 1,
                  duration: 0.6,
                  ease: 'power2.inOut',
                })
              },
            })
            break
        }
      })
    },

    handleGithubReturn() {
      const hasGithubCode = new URLSearchParams(window.location.search).has('code')
      if (hasGithubCode && Object.keys(this.selectedFaucet).length > 0) {
        nextTick(() => {
          this.initializeFromGithub()
        })
      }
    },

    isGithubConnected(): boolean {
      const hasGithubCode = !!localStorage.getItem('last-code')
      const usesGithubOAuth = !!this.selectedFaucet.github_oauth_client_id
      
      return hasGithubCode  && usesGithubOAuth
    },

    async claimRewards() {
      await this.handleRequestAnimation()

      try {
        const { claim } = useFaucetApi()
        const githubCode = localStorage.getItem('last-code')
        
        await this.ensureMinLoadingTime(
          claim(this.selectedFaucet, {
            address: this.prefilledAddress,
            githubCode: githubCode || undefined,
          })
        )
        await this.handleRequestSuccess()
      } catch (e) {
        await this.handleRequestError(e instanceof Error ? e.message : String(e))
      }
    },

    async requestDripWithGithub() {
      await this.handleRequestAnimation()

      try {
        const { requestFaucet } = useFaucetApi()
        const githubCode = localStorage.getItem('last-code')
        
        await this.ensureMinLoadingTime(
          requestFaucet(this.selectedFaucet, {
            address: this.prefilledAddress,
            amount: convertToUgnot(this.prefilledAmount),
            githubCode: githubCode || undefined,
          })
        )
        await this.handleRequestSuccess()
      } catch (e) {
        await this.handleRequestError(e instanceof Error ? e.message : String(e))
      }
    },
  },
})

// Plugin to setup watchers
export function faucetDetailPlugin({ store }: PiniaPluginContext) {
  if (store.$id === 'faucetDetail') {
    const { status } = storeToRefs(store)
    watch(
      () => status.value,
      (value) => store.handleStatusChange(value),
    )
  }
}
