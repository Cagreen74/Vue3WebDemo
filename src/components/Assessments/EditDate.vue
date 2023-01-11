<template>
  <div class="col-12 p-0">
    <Dialog v-model:visible="modal" class="p-0" :modal="true">
      <Calendar v-model="date" :inline="true" class="p-0 m-0 w-full h-full" dateFormat="dd.mm.yy" inputId="params.data.id" >
        <template #footer>
          <div class="flex justify-content-end">
            <Button label="Close" icon="pi pi-times" class="p-button-text" @click="Cancel" />
            <Button label="Ok" icon="pi pi-check"  @click="SaveDates()" />
          </div>
        </template>
      </Calendar>
    </Dialog>
  </div>
</template>

<style>
  .p-dialog .p-dialog-content {
    padding: 0;
  }

  .p-dialog .p-dialog-header {
   display:none
  }
</style>

<script>
  /* eslint-disable no-debugger */
    export default  {
        name: 'EditDate',
        data: () => ({
            date: '',
            modal:true,
    }),
        mounted() {
          this.date = new Date(this.params.value)
         
        },
        methods: {
            getValue() {
            return new Date(this.date);
            },

            isPopup() {
                return true;
            },
            onClick() {
                this.params.api.stopEditing(true);
            },
            onKeyDown(event) {
                let key = event.which || event.keyCode;
                if (
                    key == 37 || // left
                    key == 39
                ) {
                    // right
                    event.stopPropagation();
                }
            },
            Cancel() {
                this.params.api.stopEditing(true);
            },
            SaveDates() {
                this.params.api.stopEditing(false);
            }
        },

    };

</script>