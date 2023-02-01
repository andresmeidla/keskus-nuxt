<template>
  <nav v-if="store.user" class="navbar bg-info flex h-fit w-full items-center p-0">
    <div class="navbar-start"></div>
    <NuxtLink :to="Routes.MAIN" class="navbar-center cursor-pointer duration-200 hover:drop-shadow-xl hover:saturate-50 hover:transition-all">
      <NuxtImg src="/logo.png" :width="150" />
    </NuxtLink>
    <div class="navbar-end cursor-pointer">
      <ul class="menu menu-horizontal px-1">
        <li tabindex="0">
          <span class="gap-0">
            <Avatar v-if="store.user" size="md" :user="store.user" :show-name="false" /><Icon name="material-symbols:arrow-drop-down" class="h-5 w-5" />
          </span>
          <ul class="bg-info p-2 text-base">
            <li v-for="item of menuItems" :key="item.path" @click="item.click">
              <a :class="{ active: useRoute().path === item.path }" :to="item.path">
                <Icon :name="item.icon"></Icon>
                <span>{{ item.label }}</span>
              </a>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </nav>
</template>
<script setup lang="ts">
import { Routes } from '@/lib/routes';
import { store } from '~~/store';
const menuItems = [
  {
    path: Routes.SETTINGS,
    icon: 'material-symbols:settings',
    label: 'Seaded',
  },
  {
    path: Routes.USERS,
    icon: 'material-symbols:groups',
    label: 'Kasutajad',
  },
  {
    icon: 'material-symbols:logout',
    label: 'Logi välja',
    click: () => {
      useAuthCookie().value = '';
      store.setUserId(undefined);
      store.setUser(null);
      useRouter().push(Routes.LOGIN);
    },
  },
];
</script>
<style scoped>
.menu-horizontal > :where(li) > :where(ul) {
  position: absolute;
  left: calc(-65%);
}
</style>
