<template>
    <div class="climate">
        <ClimateRenderItem deviceId="THOR" title="Schlafzimmer" />
        <ClimateRenderItem deviceId="ZEUS" title="Wohnzimmer" />
        <ClimateRenderItem deviceId="AMUN" title="Badezimmer" />
    </div>
</template>

<script>
import ClimateRenderItem from '@/components/ClimateRenderItem.vue'

export default {
  name: 'climate',
  components: {
    ClimateRenderItem
  },
  created () {
    if (this.$store.getters.items.length < 1) {
      this.$store.dispatch('populate')
    }
  }
}
</script>

<style lang="scss">
.climate {
  align-items: flex-start;
  display: flex;
  flex-wrap: wrap;
  min-height: 100vh;

  > *:nth-child(2n) {
    background: var(--color-green-transparent);
  }
}
</style>
