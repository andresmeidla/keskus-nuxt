<template>
  <nav class="navbar bg-secondary flex h-[4rem] w-full items-center p-0 brightness-95">
    <div class="navbar-start">
      <NuxtLink :to="Routes.MAIN" class="ml-4 cursor-pointer select-none duration-200 hover:drop-shadow-xl hover:saturate-50 hover:transition-all">
        <NuxtImg src="/logo.png" :width="150" />
      </NuxtLink>
    </div>
    <div class="navbar-center">
      <div class="flex items-center justify-items-center">
        <button class="btn btn-primary rounded-full" onclick="my_modal_3.showModal()">
          <!--  -->
          <Icon class="h-5 w-5" name="material-symbols:add-circle-rounded" />
          <span>Uus teema</span>
        </button>
      </div>
    </div>
    <div class="navbar-end flex flex-row gap-2 pr-4">
      <span><Avatar v-if="user" size="md" :user="user" :show-name="false" /></span>
      <span v-for="item of menuItems" :key="item.label" @click="item.click">
        <Icon class="h-8 w-8 cursor-pointer text-gray-800" :name="item.icon"></Icon>
      </span>
    </div>
  </nav>
</template>
<script setup lang="ts">
import { Routes } from '~/lib/routes';

const { user, logout } = useAuth();

const menuItems = [
  /* {
    path: Routes.USERS,
    icon: 'material-symbols:groups',
    label: 'Kasutajad',
  },
  {
    path: Routes.SETTINGS,
    icon: 'material-symbols:settings',
    label: 'Seaded',
  }, */
  {
    icon: 'material-symbols:logout',
    label: 'Logi välja',
    click: () => logout(),
  },
];
</script>
<style scoped>
.menu-horizontal > :where(li) > :where(ul) {
  position: absolute;
  left: calc(-65%);
}
</style>
