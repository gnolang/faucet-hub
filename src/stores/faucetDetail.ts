import { defineStore, storeToRefs, PiniaPluginContext } from 'pinia'
import { gsap } from 'gsap'
import { CustomEase } from 'gsap/CustomEase'
import { CSSPlugin } from 'gsap/CSSPlugin'
import { RequestStatus, Faucet } from '@/types'
import { watch, nextTick } from 'vue'

// Register GSAP plugins
gsap.registerPlugin(CustomEase, CSSPlugin)

const STORAGE_KEY = 'last-selected-faucet'
const MIN_LOADING_TIME = 2000 // 2 seconds minimum loading time

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

            // Reset form visibility
            gsap.set('.js-faucetform', { autoAlpha: 1 })
            gsap.set('.js-faucetpending', { autoAlpha: 0 })
            gsap.set('.js-faucetsuccess', { autoAlpha: 0 })
          }
          this.status = 'null'
          this.animationPending = false
        },
      })
    },

    initializeFromGithub() {
      // Set initial state
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

        // Fond flouté
        gsap.set(this.DOM.bg, {
          autoAlpha: 1,
          visibility: 'visible',
        })
        gsap.set('.js-main', { scale: 0.9 })

        // Masquer le formulaire et afficher le conteneur pending
        gsap.set('.js-faucetform', { autoAlpha: 0 })
        gsap.set('.js-faucetpending', { autoAlpha: 1 })

        // Animer le logo comme dans handleRequestAnimation
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

    handleRequestAnimation() {
      // If we're already in pending state (like when returning from GitHub), skip the animation
      if (this.status === 'pending' && this.contentStep === 1) {
        return
      }

      // Save current height for smooth animation
      if (this.DOM.popup && this.DOM.faucetRequest) {
        this.popupHeight.from = this.DOM.popup.getBoundingClientRect().height
        gsap.set(this.DOM.popup, { height: this.popupHeight.from + 'px' })
      }

      // Fade out form and show loading animation
      gsap.to('.js-faucetform', {
        autoAlpha: 0,
        duration: 0.5,
        onComplete: () => {
          this.status = 'pending'
          this.contentStep = 1
        },
      })

      if (this.DOM.gnoRequestLogo) {
        gsap.to(this.DOM.gnoRequestLogo, { autoAlpha: 1, delay: 0.5 })
      }

      // Setup the pending animation
      this.setupPendingAnimation()
      this.toggleLoader(true)
    },

    async handleRequestSuccess() {
      this.status = 'success'
      this.contentStep = 2
      gsap.to('.js-faucetsuccess', { autoAlpha: 1 })
    },

    async handleRequestError(errorMessage: string) {
      this.error = errorMessage
      this.status = 'error'
      console.error(errorMessage)
    },

    async requestWithCaptcha(address: string, amount?: number, captchaSecret?: string) {
      await this.handleRequestAnimation()

      // min default loading timer
      const minTimer = new Promise((resolve) => setTimeout(resolve, MIN_LOADING_TIME))

      try {
        const response = await fetch(this.selectedFaucet.url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            to: address,
            amount: amount ? amount * 1000000 + 'ugnot' : undefined,
            captcha: captchaSecret,
          }),
        })

        await minTimer // Ensure minimum loading time
        const faucetResponse = await response.json()

        if (response.status === 200 && !faucetResponse.error) {
          await this.handleRequestSuccess()
        } else {
          await this.handleRequestError(faucetResponse.error)
        }
      } catch (e) {
        await minTimer // Ensure minimum loading time even on error
        await this.handleRequestError(e as string)
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
      // Temporary flag for local development - to be removed later
      const LOCAL_DEV_SUCCESS = true // Set to false to simulate error

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

      // min default loading timer
      const minTimer = new Promise((resolve) => setTimeout(resolve, MIN_LOADING_TIME))

      try {
        // Simulate API call for local development
        if (LOCAL_DEV_SUCCESS) {
          await minTimer
          await this.handleRequestSuccess()
          return
        }

        // If not in local dev mode, proceed with actual API call
        const fetchPromise = fetch(`${storage.url}?code=${code}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            to: storage.address,
            amount: parseInt(storage.value!, 10) * 1000000 + 'ugnot', //TODO: need to be dynamic if different token
          }),
        })

        const response = (await Promise.race([
          fetchPromise,
          // Timeout after 10s
          new Promise((_, reject) => setTimeout(() => reject(new Error('Request timeout')), 10000)),
        ])) as Response

        await minTimer // Ensure minimum loading time
        const faucetResponse = await response.json()

        if (response.status === 200 && !faucetResponse.error) {
          await this.handleRequestSuccess()
        } else {
          await this.handleRequestError(faucetResponse.error || 'Request failed')
        }
      } catch (e) {
        await minTimer // Ensure minimum loading time even on error
        await this.handleRequestError(e instanceof Error ? e.message : 'Network error')
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
                  duration: 0.6,
                })
              },
            })
            break

          case 'null':
            gsap.set('.js-faucetform', { autoAlpha: 1 })
            gsap.set('.js-faucetpending', { autoAlpha: 1 })
            gsap.set('.js-faucetsuccess', { autoAlpha: 0 })
            gsap.set('.js-faucetsuccessdetail', { height: 0 })
            gsap.set(this.DOM.popup, { height: 'auto', delay: 0.4 })

            this.error = null
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
