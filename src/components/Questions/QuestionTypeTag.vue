
  <template>
    <Badge :style="{'background-color': LabelColor}">{{$props.TypeName}}</Badge>
  </template>

  <script>
    export default {
      name: 'QuestionTypeTag',
      props: ['TypeId', 'TypeName'],
      computed:{
        LabelColor() {

          var color = "";

          if (this.$props.TypeId == 1)
            color = "#1E88E5"

          if (this.$props.TypeId == 2)
            color = "#5E35B1"

          if (this.$props.TypeId == 3)
            color = "#00796B"

          if (this.$props.TypeId == 4)
            color = "#90A4AE"

          return color;

        }
      }
    }
  </script>

