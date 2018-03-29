<style lang="sass">
.patient-description-container{
    img{
        margin:2px;
        padding:2px;
        border:1px solid #ccc;
    }
}
</style>

<template lang="html">
  <div class="patient-description-container">
      <div class="">
        {{message}}
      </div>
       <img  width="100" height="100"  class="other-file-image viewer-image" group="cloud-image-otherfile" v-for="f in otherFiles&&otherFiles.split(',')" :src="f | upload-image"
      />
      
  </div>
</template>

<script>
export default {
    props:{
        message:{
            default :""
        },
        otherFiles:{
            default:""
        }
    },
    watch:{
        message(newValue,oldValue){

        }
    }
}
</script>

<style lang="css">
</style>
