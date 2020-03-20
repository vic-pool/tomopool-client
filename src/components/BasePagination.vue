<template>
  <ul :class="paginationClasses.ul">
    <li
      v-if="paginationLabels.first"
      :class="`${paginationClasses.li} ${hasFirst ? paginationClasses.liDisable : ''}`"
    >
      <button
        @click="first"
        :disabled="hasFirst"
        :class="`${paginationClasses.button} ${hasFirst ? paginationClasses.buttonDisable : ''}`"
        v-html="paginationLabels.first"
      ></button>
    </li>

    <li
      v-if="paginationLabels.prev"
      :class="`${paginationClasses.li} ${hasFirst ? paginationClasses.liDisable : ''}`"
    >
      <button
        @click="prev"
        :disabled="hasFirst"
        :class="`${paginationClasses.button} ${hasFirst ? paginationClasses.buttonDisable : ''}`"
        v-html="paginationLabels.prev"
      ></button>
    </li>

    <li
      v-for="page in items"
      :key="page.label"
      :class="`${paginationClasses.li} ${page.active ? paginationClasses.liActive : ''} ${page.disable ? paginationClasses.liDisable : ''}`"
    >
      <span
        v-if="page.disable"
        :class="`${paginationClasses.button} ${paginationClasses.buttonDisable}`"
      >
        ...
      </span>
      <button
        v-else
        @click="goto(page.label)"
        :class="`${paginationClasses.button} ${page.active ? paginationClasses.buttonActive : ''}`"
      >
        {{ page.label }}
      </button>
    </li>

    <li
      v-if="paginationLabels.next"
      :class="`${paginationClasses.li} ${hasLast ? paginationClasses.liDisable : ''}`"
    >
      <button
        @click="next"
        :disabled="hasLast"
        :class="`${paginationClasses.button} ${hasLast ? paginationClasses.buttonDisable : ''}`"
        v-html="paginationLabels.next"
      ></button>
    </li>

    <li
      v-if="paginationLabels.last"
      :class="`${paginationClasses.li} ${hasLast ? paginationClasses.liDisable : ''}`"
    >
      <button
        @click="last"
        :disabled="hasLast"
        :class="`${paginationClasses.button} ${hasLast ? paginationClasses.buttonDisable : ''}`"
        v-html="paginationLabels.last"
      ></button>
    </li>
  </ul>
</template>

<script>
  const defaultClasses = { // http://getbootstrap.com/docs/4.1/components/pagination/
    ul: 'pagination justify-content-center',
    li: 'page-item',
    liActive: 'active',
    liDisable: 'disabled',
    button: 'page-link'
  }
  const defaultLabels = {
    first: '‹‹',
    prev: '‹',
    next: '›',
    last: '››'
  }

  export default {
    name: "base-pagination",
    props: {
      value: {  // current page
        type: Number,
        required: true
      },
      pageCount: { // page numbers
        type: Number,
        required: true
      }
    },
    computed: {
      items() {
        let valPrev = this.value > 1 ? (this.value - 1) : 1 // for easier navigation - gives one previous page
        let valNext = this.value < this.pageCount ? (this.value + 1) : this.pageCount // one next page
        let extraPrev = valPrev === 3 ? 2 : null
        let extraNext = valNext === (this.pageCount - 2) ? (this.pageCount - 1) : null
        let dotsBefore = valPrev > 3 ? 2 : null
        let dotsAfter = valNext < (this.pageCount - 2) ? (this.pageCount - 1) : null

        let output = []

        for (let i = 1; i <= this.pageCount; i += 1) {
          if ([1, this.pageCount, this.value, valPrev, valNext, extraPrev, extraNext, dotsBefore, dotsAfter].includes(i)) {
            output.push({
              label: i,
              active: this.value === i,
              disable: [dotsBefore, dotsAfter].includes(i)
            })
          }
        }

        return output
      },

      hasFirst() {
        return (this.value === 1)
      },

      hasLast() {
        return (this.value === this.pageCount)
      },
    },
    data() {
      return {
        paginationClasses: defaultClasses,
        paginationLabels: defaultLabels
      }
    },
    methods: {
      first() {
        if (!this.hasFirst) {
          this.$emit('input', 1)
        }
      },

      prev() {
        if (!this.hasFirst) {
          this.$emit('input', (this.value - 1))
        }
      },

      goto(page) {
        this.$emit('input', page)
      },

      next() {
        if (!this.hasLast) {
          this.$emit('input', (this.value + 1))
        }
      },

      last() {
        if (!this.hasLast) {
          this.$emit('input', this.pageCount)
        }
      },
    },
    watch: {
      value: function () {
        this.$emit('change')
      }
    },
    mounted() {
      if (this.value > this.pageCount) {
        this.$emit('input', this.pageCount)
      }
    },
  }
</script>
