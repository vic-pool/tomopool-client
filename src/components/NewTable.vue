<template>
    <table class="tomo-table">
        <thead>
        <tr>
            <th
                v-for="(field, key) in fields"
                :key="key"
                :class="field.cssClass"
                style="vertical-align: center; vert-align: middle">
                {{field.label}}
                <span v-if="field.smallLabel" class="small">{{field.smallLabel}}</span>
            </th>
        </tr>
        </thead>
        <tbody>
        <tr
            v-for="(item, index) in items"
            :key="index">
            <td
                v-for="(field, key) in fields"
                :key="key"
                :data-label="field.labelWithoutHtml || field.label"
                :data-desc="field.smallLabel"
                :class="field.cssClass">
                <slot
                    :name="key"
                    :item="item"
                    :index="index">{{ item[key] }}</slot>
            </td>
        </tr>
        </tbody>
    </table>
</template>
<script>
  export default {
    name: 'new-table',
    props: {
      fields: {
        type: Object,
        default: () => {
          return {}
        }
      },
      items: {
        type: Array,
        default: () => {
          return []
        }
      }
    }
  }
</script>
