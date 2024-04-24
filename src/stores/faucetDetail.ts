import { defineStore } from 'pinia'
import { gsap } from 'gsap'
import { CustomEase } from 'gsap/CustomEase'
import { RequestStatus, Faucet } from '@/types'

gsap.registerPlugin(CustomEase)

export const useFaucetDetail = defineStore('faucetDetail', {
  state: () => ({
    DOM: {
      bg: null as HTMLElement | null,
      popup: null as HTMLElement | null,
      cards: [] as HTMLElement[],
      title: null as HTMLElement | null,
    },
    isOpen: false,
    isVisible: false,
    animationPending: false,
    contentStep: 0,
    status: 'null' as RequestStatus,
    selectedFaucet: {} as Faucet,
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
      if (this.isOpen) this.isVisible = true

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
          amount: 0.3,
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
          }
          this.status = 'null'
          this.animationPending = false
        },
      })
    },
  },
})
