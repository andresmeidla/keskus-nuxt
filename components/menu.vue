<template>
  <div class="bg-info flex h-fit w-full justify-center text-sky-900">
    <ul class="menu menu-horizontal">
      <li v-for="item of menuItems" :key="item.path">
        <NuxtLink :class="{ active: useRoute().path === item.path }" :to="item.path" @click.prevent="item.click ?? undefined">
          <Icon :name="item.icon"></Icon>
          <span>{{ item.label }}</span>
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>
<script setup lang="ts">
import { Routes } from '@/lib/routes';
const menuItems = [
  {
    path: Routes.MAIN,
    icon: 'material-symbols:format-list-bulleted-rounded',
    label: 'Teemad',
  },
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
    path: Routes.LOGIN,
    icon: 'material-symbols:logout',
    label: 'Logi välja',
    click: () => {
      useAuthCookie().value = '';
      useRouter().push(Routes.MAIN);
    },
  },
];
</script>
