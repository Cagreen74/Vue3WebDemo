<template>
  <Badge :value="Status" :style="{'background-color': RoleColor}">{{Role}}</Badge>
</template>

<script>
    export default  {
    name: 'RenderRoles',
    data: () => ({
        Role: '',
        RoleColor: '#546E7A'
    }),
        beforeMount() {
            var color = this.RoleColor;

            if (this.params.data.roleId == "CONS-ADMN")
                color = '#3949AB'
            else if (this.params.data.roleId == "ORG-ADM")
                color = "#1E88E5"
            else if (this.params.data.roleId == "ORG-USR")
                color = "#82B1FF"
            else if (this.params.data.roleId == "SA")
                color = "#FF5722"

            this.Role = this.params.value;
            this.RoleColor = color;
        }
    };

    </script>