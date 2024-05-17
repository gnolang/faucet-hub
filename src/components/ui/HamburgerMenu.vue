<template>
    <div ref="menu">
        <button @click.stop="toggleMenu" class="w-[30px] md:hidden block">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
        </button>
        <div :class="['flex flex-col items-start bg-[#252424] absolute left-0 w-full py-2 z-1', isOpen ? 'top-[80px]' : 'top-[-200px] opacity-0', 'transition-all']">
            <a class="cursor-pointer w-full hover:bg-grey-400 py-2 px-5" v-for="item, i in navItems" :key="i" href="item.link" target="_blank">
                <span class="px-1">{{item.title}}</span>
            </a>
            <a class="cursor-pointer w-full hover:bg-grey-400 py-2 px-5">
                <span class="px-1">Connect Wallet</span>
            </a>
        </div>
    </div>
</template>
    
<script setup lang="ts">
    import { NavItem } from '@/types';
    import { defineProps, ref, onMounted, onBeforeUnmount } from 'vue';
    const isOpen = ref<boolean>(false)
    
    const toggleMenu = () => {
        isOpen.value = !isOpen.value;
    }
    const menu = ref<HTMLElement | null>(null);

    const handleClickOutside = (event: MouseEvent) => {
        if (
            menu.value &&
            !menu.value.contains(event.target as Node)
        ) {
            console.log(isOpen.value)
            isOpen.value = false;
        }
    };

    onMounted(() => {
        document.addEventListener('click', handleClickOutside);
    });

    onBeforeUnmount(() => {
        document.removeEventListener('click', handleClickOutside);
    });

    const props = defineProps<{
        navItems: NavItem[]
    }>();
  
</script>