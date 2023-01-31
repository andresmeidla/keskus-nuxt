<template>
  <div id="login" class="flex min-h-screen w-full items-center justify-center bg-[url('/login.png')] bg-cover bg-no-repeat">
    <div class="flex content-center items-center justify-center px-4 py-8 align-middle md:px-6 lg:px-8">
      <div class="border-round card w-80 items-center p-4 lg:w-80">
        <slot />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts"></script>
<style scoped></style>
